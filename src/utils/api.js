const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Check if backend is running
export async function isBackendAvailable() {
  try {
    const response = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    return response.ok;
  } catch {
    return false;
  }
}

// Create ticket with AI analysis (calls real AWS Bedrock)
export async function createTicketWithAI({ subject, description, customerName, customerEmail, company, category }) {
  const backendUp = await isBackendAvailable();

  if (!backendUp) {
    console.log('⚠️ Backend not running — using local mock AI');
    return null; // frontend will use its own mock analysis
  }

  try {
    const response = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, description, customerName, customerEmail, company, category }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    console.log(`✅ AI Analysis: ${data.aiPowered ? '🤖 Real AWS Bedrock' : '📋 Fallback'}`);
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

// Fetch all tickets from DynamoDB
export async function getTickets() {
  try {
    const response = await fetch(`${API_BASE}/tickets`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Fetch Tickets Error:', error);
    return null;
  }
}

// Update existing ticket in DynamoDB
export async function updateTicket(id, updates) {
  try {
    const response = await fetch(`${API_BASE}/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Update Ticket Error:', error);
    return null;
  }
}

// Analyze text only (no ticket creation)
export async function analyzeText({ subject, description, customerName }) {
  try {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, description, customerName }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Analyze Error:', error);
    return null;
  }
}

// Test connections
export async function testConnections() {
  const results = {};

  try {
    const health = await fetch(`${API_BASE}/health`).then(r => r.json());
    results.server = { status: 'connected', ...health };
  } catch {
    results.server = { status: 'offline' };
  }

  try {
    const bedrock = await fetch(`${API_BASE}/test-bedrock`).then(r => r.json());
    results.bedrock = bedrock;
  } catch {
    results.bedrock = { status: 'offline' };
  }

  try {
    const comprehend = await fetch(`${API_BASE}/test-comprehend`).then(r => r.json());
    results.comprehend = comprehend;
  } catch {
    results.comprehend = { status: 'offline' };
  }

  return results;
}

export default { createTicketWithAI, getTickets, updateTicket, analyzeText, testConnections, isBackendAvailable };
