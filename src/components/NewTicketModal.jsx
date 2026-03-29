import { useState } from 'react';
import { X, Send, Sparkles, Loader2, Zap } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useTickets } from '../hooks/useTickets';
import { CATEGORIES } from '../utils/constants';
import { createTicketWithAI } from '../utils/api';
import './NewTicketModal.css';

export default function NewTicketModal({ onClose }) {
  const { addTicket } = useTickets();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    company: '',
    subject: '',
    description: '',
    category: '',
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const simulateAIAnalysis = (subject, description) => {
    const text = `${subject} ${description}`.toLowerCase();

    // Simple urgency detection
    let urgency = 'medium';
    let urgencyScore = 0.5;
    if (text.match(/down|outage|crash|emergency|critical|breach|hack|security|revenue|losing money/)) {
      urgency = 'critical'; urgencyScore = 0.95;
    } else if (text.match(/broken|error|failed|cannot|unable|urgent|asap|immediately|production/)) {
      urgency = 'high'; urgencyScore = 0.8;
    } else if (text.match(/slow|issue|problem|bug|wrong|incorrect|missing/)) {
      urgency = 'medium'; urgencyScore = 0.5;
    } else {
      urgency = 'low'; urgencyScore = 0.2;
    }

    // Sentiment detection
    let sentiment = 'neutral';
    let sentimentScore = 0.4;
    if (text.match(/angry|furious|unacceptable|terrible|worst|awful|hate|disgusted/)) {
      sentiment = 'angry'; sentimentScore = 0.9;
    } else if (text.match(/frustrated|annoying|disappointing|upset|concerned|worried/)) {
      sentiment = 'frustrated'; sentimentScore = 0.7;
    } else if (text.match(/great|thank|love|excellent|amazing|wonderful|happy/)) {
      sentiment = 'positive'; sentimentScore = 0.15;
    }

    // Category detection
    let category = form.category || 'General';
    if (!form.category) {
      if (text.match(/bill|charge|invoice|payment|refund|subscribe|price/)) category = 'Billing';
      else if (text.match(/bug|crash|error|broken|fix/)) category = 'Bug Report';
      else if (text.match(/feature|request|wish|would like|suggestion/)) category = 'Feature Request';
      else if (text.match(/security|breach|hack|unauthorized|suspicious/)) category = 'Security';
      else if (text.match(/slow|performance|speed|latency|timeout/)) category = 'Performance';
      else if (text.match(/integrat|api|connect|sync|webhook/)) category = 'Integration';
      else if (text.match(/account|login|password|access|permission/)) category = 'Account';
      else category = 'Technical';
    }

    return {
      urgency,
      sentiment,
      sentimentScore,
      category,
      aiAnalysis: {
        summary: `AI analyzed ticket: Detected ${urgency} urgency with ${sentiment} customer sentiment. Category: ${category}. ${
          urgency === 'critical' ? 'Immediate attention recommended.' :
          urgency === 'high' ? 'Prioritize this ticket.' :
          'Standard handling appropriate.'
        }`,
        suggestedResponse: `Dear ${form.customerName},\n\nThank you for reaching out. I've reviewed your concern regarding "${subject}" and I want to assure you that this is being handled with the appropriate priority.\n\nI'm looking into this matter and will provide you with a detailed update shortly. If you have any additional information that could help us resolve this faster, please don't hesitate to share.\n\nBest regards,\nSupport Team`,
        keyEntities: text.match(/error \w+-?\d+/gi) || [category, urgency, sentiment],
        similarTickets: Math.floor(Math.random() * 10),
        estimatedResolution: urgency === 'critical' ? '1-2 hours' : urgency === 'high' ? '4-8 hours' : '24-48 hours',
        confidence: 0.75 + Math.random() * 0.2,
      },
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);

    try {
      // Try real AWS Bedrock backend first
      const apiResult = await createTicketWithAI({
        subject: form.subject,
        description: form.description,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        company: form.company,
        category: form.category,
      });

      if (apiResult?.ticket) {
        // Real AI analysis from AWS Bedrock!
        console.log('🤖 Used real AWS Bedrock AI');
        addTicket(apiResult.ticket);
      } else {
        // Fallback to local mock analysis
        console.log('📋 Using local mock analysis');
        const analysis = simulateAIAnalysis(form.subject, form.description);

        const newTicket = {
          id: uuidv4(),
          subject: form.subject,
          description: form.description,
          customer: {
            name: form.customerName,
            email: form.customerEmail,
            company: form.company,
            tier: 'Professional',
          },
          category: analysis.category,
          status: analysis.urgency === 'critical' ? 'escalated' : 'open',
          urgency: analysis.urgency,
          sentiment: analysis.sentiment,
          sentimentScore: analysis.sentimentScore,
          assignedTo: analysis.urgency === 'critical' ? 'a5' : null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          slaDeadline: new Date(Date.now() + (analysis.urgency === 'critical' ? 3600000 : 86400000)).toISOString(),
          aiAnalysis: analysis.aiAnalysis,
          tags: [analysis.category.toLowerCase().replace(' ', '-'), analysis.urgency],
          messages: [
            { role: 'customer', content: form.description, time: new Date().toISOString() },
          ],
        };

        addTicket(newTicket);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setIsAnalyzing(false);
    onClose();
  };

  const isValid = form.customerName && form.subject && form.description;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content new-ticket-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="ntm-title">Submit New Ticket</h3>
            <p className="ntm-subtitle">AI will automatically analyze and prioritize this ticket</p>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="ntm-form-grid">
              <div className="form-group">
                <label className="form-label">Customer Name *</label>
                <input
                  className="form-input"
                  placeholder="John Doe"
                  value={form.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="john@company.com"
                  value={form.customerEmail}
                  onChange={(e) => handleChange('customerEmail', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company</label>
                <input
                  className="form-input"
                  placeholder="Company Inc."
                  value={form.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category (AI can auto-detect)</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  <option value="">Auto-detect with AI</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
              <label className="form-label">Subject *</label>
              <input
                className="form-input"
                placeholder="Brief summary of the issue"
                value={form.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                placeholder="Describe the issue in detail. Include error codes, steps to reproduce, and any relevant context..."
                rows={5}
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                required
              />
            </div>

            {/* AI Processing hint */}
            <div className="ntm-ai-hint">
              <Sparkles size={14} className="ai-sparkle" />
              <span>
                AI will automatically: Classify urgency • Detect sentiment • Categorize issue • Generate suggested response • Find similar tickets
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isValid || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  AI Analyzing...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit & Analyze
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
