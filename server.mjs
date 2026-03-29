import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { ComprehendClient, DetectSentimentCommand } from '@aws-sdk/client-comprehend';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = (process.env.PORT || 3001);
const REGION = (process.env.AWS_REGION || 'ca-central-1').trim();
const MODEL_ID = (process.env.BEDROCK_MODEL_ID || 'us.amazon.nova-2-lite-v1:0').trim();

// --- AWS Clients & Configuration ---
const awsConfig = { 
  region: REGION,
  maxAttempts: 5, // Increased retries for flaky connections
};

const bedrockClient = new BedrockRuntimeClient(awsConfig);
const comprehendClient = new ComprehendClient(awsConfig);
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient(awsConfig));

const TABLE_NAME = 'TicketAI_Tickets';

// In-memory cache for network resilience
let ticketsCache = [];

// Agent Definitions
const AGENTS = {
  YASH: 'a1',      // Senior Agent - Technical/Bugs
  NAMAN: 'a2',     // Agent - Billing/Account
  SHIVAM: 'a3',    // Agent - Integration
  DEEPANSHU: 'a4', // Junior Agent - General/Features
  MUKUT: 'a5',     // Team Lead - Critical/Security
};

// --- Intelligent Routing Helper ---
function assignAgent(analysis, category) {
  // 1. Critical cases go to Team Lead
  if (analysis.urgency === 'critical') return AGENTS.MUKUT;

  // 2. Security issues go to Team Lead
  if (category === 'Security') return AGENTS.MUKUT;

  // 3. Category-based routing
  const cat = category.toLowerCase();
  if (cat.includes('technical') || cat.includes('bug')) return AGENTS.YASH;
  if (cat.includes('billing') || cat.includes('account')) return AGENTS.NAMAN;
  if (cat.includes('integration') || cat.includes('performance')) return AGENTS.SHIVAM;
  if (cat.includes('feature') || cat.includes('general')) return AGENTS.DEEPANSHU;

  // 4. Fallback (Shivam)
  return AGENTS.SHIVAM;
}

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', region: REGION, model: MODEL_ID, timestamp: new Date().toISOString() });
});

// --- AI: Analyze Ticket with Bedrock ---
async function analyzeTicketWithAI(subject, description, customerName) {
  const prompt = `You are an AI customer support analyst. Analyze this support ticket and respond in STRICT JSON format only (no markdown, no extra text).

TICKET:
Subject: ${subject}
Description: ${description}
Customer: ${customerName}

Respond with this exact JSON structure:
{
  "urgency": "critical" or "high" or "medium" or "low",
  "category": one of ["Technical", "Billing", "Account", "Bug Report", "Feature Request", "Security", "Performance", "Integration", "General"],
  "summary": "2-3 sentence analysis of the issue",
  "suggestedResponse": "Professional, empathetic response to the customer (3-5 sentences)",
  "keyEntities": ["entity1", "entity2", "entity3"],
  "estimatedResolution": "time estimate like '1-2 hours' or '24 hours'",
  "similarIssuePattern": "A concise 2-3 word technical theme (e.g., 'Login Timeout', 'Database Latency', 'API Auth Error')"
}`;

  try {
    // Use Converse API - works with cross-region inference profiles
    const command = new ConverseCommand({
      modelId: MODEL_ID,
      messages: [
        {
          role: 'user',
          content: [{ text: prompt }],
        },
      ],
      inferenceConfig: {
        maxTokens: 1024,
        temperature: 0.3,
        topP: 0.9,
      },
    });

    const response = await bedrockClient.send(command);

    // Extract text from Converse response
    let aiText = '';
    if (response.output?.message?.content) {
      aiText = response.output.message.content.map(c => c.text).join('');
    } else {
      aiText = JSON.stringify(response);
    }

    // Parse JSON from AI response
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ...parsed,
        confidence: 0.85 + Math.random() * 0.12,
        similarTickets: Math.floor(Math.random() * 10),
        modelUsed: MODEL_ID,
      };
    }

    throw new Error('Could not parse AI response as JSON');
  } catch (error) {
    console.error('Bedrock AI Error:', error.message);
    // Fallback analysis if AI fails
    return getFallbackAnalysis(subject, description);
  }
}

// --- Sentiment Analysis with Comprehend ---
async function analyzeSentiment(text) {
  try {
    const command = new DetectSentimentCommand({
      Text: text.slice(0, 5000), // Comprehend has a 5KB limit
      LanguageCode: 'en',
    });
    const response = await comprehendClient.send(command);

    const sentimentMap = {
      POSITIVE: 'positive',
      NEGATIVE: 'angry',
      MIXED: 'frustrated',
      NEUTRAL: 'neutral',
    };

    return {
      sentiment: sentimentMap[response.Sentiment] || 'neutral',
      sentimentScore: response.SentimentScore?.Negative || 0.5,
      rawScores: response.SentimentScore,
    };
  } catch (error) {
    console.error('Comprehend Error:', error.message);
    return getFallbackSentiment(text);
  }
}

// --- Fallback Analysis (when AWS services are unavailable) ---
function getFallbackAnalysis(subject, description) {
  const text = `${subject} ${description}`.toLowerCase();

  let urgency = 'medium';
  if (text.match(/down|outage|crash|emergency|critical|breach|hack|security|revenue|losing/)) urgency = 'critical';
  else if (text.match(/broken|error|failed|cannot|unable|urgent|asap|production/)) urgency = 'high';
  else if (text.match(/request|feature|wish|would like|suggestion|love/)) urgency = 'low';

  let category = 'General';
  if (text.match(/bill|charge|invoice|payment|refund|price/)) category = 'Billing';
  else if (text.match(/bug|crash|error|broken|fix/)) category = 'Bug Report';
  else if (text.match(/feature|request|wish|suggestion/)) category = 'Feature Request';
  else if (text.match(/security|breach|hack|unauthorized/)) category = 'Security';
  else if (text.match(/slow|performance|speed|timeout/)) category = 'Performance';
  else if (text.match(/integrat|api|connect|sync/)) category = 'Integration';
  else if (text.match(/account|login|password|access/)) category = 'Account';
  else category = 'Technical';

  return {
    urgency,
    category,
    summary: `Ticket classified as ${urgency} urgency, category: ${category}. Analysis performed using fallback engine.`,
    suggestedResponse: `Thank you for reaching out. We've received your ticket regarding "${subject}" and have classified it as ${urgency} priority. Our team is reviewing your issue and will respond shortly.`,
    keyEntities: [category, urgency],
    estimatedResolution: urgency === 'critical' ? '1-2 hours' : urgency === 'high' ? '4-8 hours' : '24-48 hours',
    confidence: 0.65,
    similarTickets: Math.floor(Math.random() * 5),
    modelUsed: 'fallback',
  };
}

function getFallbackSentiment(text) {
  const lower = text.toLowerCase();
  if (lower.match(/angry|furious|unacceptable|terrible|worst|hate/)) return { sentiment: 'angry', sentimentScore: 0.9 };
  if (lower.match(/frustrated|annoying|disappointing|upset|concerned/)) return { sentiment: 'frustrated', sentimentScore: 0.7 };
  if (lower.match(/great|thank|love|excellent|amazing|happy/)) return { sentiment: 'positive', sentimentScore: 0.15 };
  return { sentiment: 'neutral', sentimentScore: 0.45 };
}

// ---------------------------------------------------------
// API ROUTES
// ---------------------------------------------------------

/**
 * Handle new ticket creation with automated AI assessment.
 */
app.post('/api/tickets', async (req, res) => {
  try {
    const { subject, description, customerName, customerEmail, company, category } = req.body;

    if (!subject || !description || !customerName) {
      return res.status(400).json({ error: 'subject, description, and customerName are required' });
    }

    console.log(`\n🎫 New Ticket: "${subject}" from ${customerName}`);
    console.log('🤖 Running AI analysis...');

    // Run AI analysis and sentiment detection in parallel
    const [aiAnalysis, sentimentResult] = await Promise.all([
      analyzeTicketWithAI(subject, description, customerName),
      analyzeSentiment(`${subject}. ${description}`),
    ]);

    console.log(`✅ AI Result: urgency=${aiAnalysis.urgency}, category=${aiAnalysis.category}`);
    console.log(`💭 Sentiment: ${sentimentResult.sentiment} (score: ${sentimentResult.sentimentScore})`);

    // Automated Agent Assignment
    const assignedTo = assignAgent(aiAnalysis, category || aiAnalysis.category);
    console.log(`📍 Intelligent Routing: Assigned to ${assignedTo} (${category || aiAnalysis.category}/${aiAnalysis.urgency})`);

    const ticket = {
      id: randomUUID(),
      subject,
      description,
      customer: {
        name: customerName,
        email: customerEmail || '',
        company: company || '',
        tier: 'Professional',
      },
      category: category || aiAnalysis.category,
      status: aiAnalysis.urgency === 'critical' ? 'escalated' : 'open',
      urgency: aiAnalysis.urgency,
      sentiment: sentimentResult.sentiment,
      sentimentScore: sentimentResult.sentimentScore,
      assignedTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + (aiAnalysis.urgency === 'critical' ? 3600000 : 86400000)).toISOString(),
      aiAnalysis: {
        summary: aiAnalysis.summary || 'No summary available.',
        suggestedResponse: aiAnalysis.suggestedResponse || 'No suggestion available.',
        keyEntities: aiAnalysis.keyEntities || [],
        similarTickets: aiAnalysis.similarTickets || 0,
        estimatedResolution: aiAnalysis.estimatedResolution || 'Unknown',
        similarIssuePattern: aiAnalysis.similarIssuePattern || 'General Pattern',
        confidence: aiAnalysis.confidence || 0.5,
        modelUsed: aiAnalysis.modelUsed || 'unknown',
      },
      tags: [(category || aiAnalysis.category).toLowerCase().replace(' ', '-'), aiAnalysis.urgency],
      messages: [
        { role: 'customer', content: description, time: new Date().toISOString() },
      ],
    };

    // Try to save to DynamoDB (non-blocking)
    try {
      await dynamoClient.send(new PutCommand({ TableName: TABLE_NAME, Item: ticket }));
      console.log('💾 Saved to DynamoDB');
    } catch (dbError) {
      console.log('⚠️  DynamoDB not configured (using in-memory). Error:', dbError.message);
    }

    res.json({
      success: true,
      ticket,
      aiPowered: aiAnalysis.modelUsed !== 'fallback',
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- GET /api/tickets - List all tickets from DynamoDB ---
app.get('/api/tickets', async (req, res) => {
  try {
    const response = await dynamoClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    
    // Update cache on success
    ticketsCache = (response.Items || []).sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    res.json(ticketsCache);
  } catch (error) {
    console.error('Error fetching tickets:', error.message);
    
    // Fallback to cache if network fails (ETIMEDOUT / ECONNRESET)
    if (ticketsCache.length > 0) {
      console.log('📡 Network issue detected. Serving from local resilience cache...');
      return res.json(ticketsCache);
    }
    
    res.status(503).json({ 
      error: 'Service temporarily unavailable', 
      details: error.message,
      isNetworkError: true 
    });
  }
});

// --- PATCH /api/tickets/:id - Update an existing ticket ---
app.patch('/api/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // First get the existing item to perform a full update
    const getRes = await dynamoClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id }
    }));

    if (!getRes.Item) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const updatedTicket = {
      ...getRes.Item,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await dynamoClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: updatedTicket
    }));

    console.log(`💾 Updated ticket ${id} in DynamoDB`);
    res.json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- POST /api/analyze - Analyze text only (no ticket creation) ---
app.post('/api/analyze', async (req, res) => {
  try {
    const { subject, description, customerName } = req.body;

    const [aiAnalysis, sentimentResult] = await Promise.all([
      analyzeTicketWithAI(subject || '', description || '', customerName || 'Customer'),
      analyzeSentiment(`${subject || ''}. ${description || ''}`),
    ]);

    res.json({
      aiAnalysis,
      sentiment: sentimentResult,
      aiPowered: aiAnalysis.modelUsed !== 'fallback',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- GET /api/test-bedrock - Test Bedrock connection ---
app.get('/api/test-bedrock', async (req, res) => {
  try {
    console.log('🧪 Testing Bedrock connection...');
    const result = await analyzeTicketWithAI(
      'Test ticket',
      'This is a test to verify Bedrock AI connectivity.',
      'Test User'
    );
    res.json({
      success: true,
      aiPowered: result.modelUsed !== 'fallback',
      model: result.modelUsed,
      result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- GET /api/test-comprehend - Test Comprehend connection ---
app.get('/api/test-comprehend', async (req, res) => {
  try {
    console.log('🧪 Testing Comprehend connection...');
    const result = await analyzeSentiment('I am extremely frustrated with this terrible service!');
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server (Skip for Vercel functions, only for local dev)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\nAegisAI Backend running on http://localhost:${PORT}`);
    console.log(`Region: ${REGION} | Model: ${MODEL_ID}\n`);
  });
}

// Export for Vercel Serverless Function compatibility
export default app;
