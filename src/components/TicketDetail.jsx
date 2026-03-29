import { useState } from 'react';
import {
  X, Sparkles, Clock, User, Building2, Tag, Send,
  CheckCircle2, AlertTriangle, ArrowUp, Copy, MessageSquare,
  Bot, ChevronDown, ChevronUp, Zap
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { URGENCY_CONFIG, SENTIMENT_CONFIG, STATUS_CONFIG, AGENTS } from '../utils/constants';
import { useTickets } from '../hooks/useTickets';
import './TicketDetail.css';

export default function TicketDetail({ ticket, onClose }) {
  const { updateTicket } = useTickets();
  const [showSuggestion, setShowSuggestion] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!ticket) return null;

  const urgency = URGENCY_CONFIG[ticket.urgency];
  const sentiment = SENTIMENT_CONFIG[ticket.sentiment];
  const status = STATUS_CONFIG[ticket.status];
  const agent = AGENTS.find((a) => a.id === ticket.assignedTo);
  const isSLABreached = new Date(ticket.slaDeadline) < new Date();

  const handleCopySuggestion = () => {
    navigator.clipboard.writeText(ticket.aiAnalysis?.suggestedResponse || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseSuggestion = () => {
    setReplyText(ticket.aiAnalysis?.suggestedResponse || '');
    setShowSuggestion(false);
  };

  const handleStatusChange = (newStatus) => {
    updateTicket(ticket.id, { status: newStatus });
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    const newMessage = {
      role: 'agent',
      content: replyText,
      time: new Date().toISOString(),
    };

    updateTicket(ticket.id, {
      messages: [...ticket.messages, newMessage],
      status: ticket.status === 'open' ? 'in_progress' : ticket.status,
    });

    setReplyText('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="ticket-detail modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="td-header">
          <div className="td-header-left">
            <div className="ticket-badges">
              <span className={`badge badge-${ticket.urgency}`}>
                {urgency.icon} {urgency.label}
              </span>
              <span className={`badge badge-status-${ticket.status.replace('_', '-')}`}>
                {status.label}
              </span>
              {isSLABreached && ticket.status !== 'resolved' && (
                <span className="badge badge-critical">
                  <AlertTriangle size={10} /> SLA Breached
                </span>
              )}
            </div>
            <h2 className="td-title">{ticket.subject}</h2>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="td-body">
          <div className="td-main">
            {/* Customer Info */}
            <div className="td-customer-bar">
              <div className="td-customer-info">
                <User size={14} />
                <span className="td-customer-name">{ticket.customer.name}</span>
                <span className="td-customer-divider">•</span>
                <Building2 size={14} />
                <span>{ticket.customer.company}</span>
                <span className="td-customer-tier">{ticket.customer.tier}</span>
              </div>
              <div className="td-customer-meta">
                <Clock size={13} />
                <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                <span className="td-customer-divider">•</span>
                <span>Sentiment: {sentiment.emoji} {sentiment.label}</span>
              </div>
            </div>

            {/* AI Analysis */}
            {ticket.aiAnalysis && (
              <div className="ai-analysis animate-fade-in-up">
                <div className="ai-analysis-header">
                  <Sparkles size={16} className="ai-sparkle" />
                  <span>AI Analysis</span>
                  <span className="ai-confidence">
                    {Math.round(ticket.aiAnalysis.confidence * 100)}% confidence
                  </span>
                </div>

                <p className="ai-summary">{ticket.aiAnalysis.summary}</p>

                <div className="ai-details">
                  <div className="ai-detail-item">
                    <span className="ai-detail-label">Category</span>
                    <span className="ai-detail-value">{ticket.category}</span>
                  </div>
                  <div className="ai-detail-item">
                    <span className="ai-detail-label">Est. Resolution</span>
                    <span className="ai-detail-value">{ticket.aiAnalysis.estimatedResolution}</span>
                  </div>
                  <div className="ai-detail-item">
                    <span className="ai-detail-label">Similar Tickets</span>
                    <span className="ai-detail-value">{ticket.aiAnalysis.similarTickets}</span>
                  </div>
                </div>

                {/* Key Entities */}
                <div className="ai-entities">
                  <span className="ai-detail-label">Key Entities</span>
                  <div className="ai-entity-tags">
                    {ticket.aiAnalysis.keyEntities.map((entity, i) => (
                      <span key={i} className="ai-entity-tag">{entity}</span>
                    ))}
                  </div>
                </div>

                {/* Suggested Response */}
                {showSuggestion && ticket.aiAnalysis.suggestedResponse && (
                  <div className="ai-suggestion">
                    <div className="ai-suggestion-header">
                      <Bot size={14} />
                      <span>AI Suggested Response</span>
                    </div>
                    <p className="ai-suggestion-text">{ticket.aiAnalysis.suggestedResponse}</p>
                    <div className="ai-suggestion-actions">
                      <button className="btn btn-primary btn-sm" onClick={handleUseSuggestion}>
                        <Zap size={13} /> Use This Response
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={handleCopySuggestion}>
                        <Copy size={13} /> {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="td-section">
              <h4 className="td-section-title">Description</h4>
              <p className="td-description">{ticket.description}</p>
            </div>

            {/* Conversation */}
            <div className="td-section">
              <h4 className="td-section-title">
                <MessageSquare size={16} />
                Conversation ({ticket.messages.length})
              </h4>
              <div className="td-messages">
                {ticket.messages.map((msg, i) => (
                  <div key={i} className={`td-message ${msg.role}`}>
                    <div className="td-message-header">
                      <span className="td-message-author">
                        {msg.role === 'customer' ? ticket.customer.name : agent?.name || 'Agent'}
                      </span>
                      <span className="td-message-time">
                        {formatDistanceToNow(new Date(msg.time), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="td-message-content">{msg.content}</p>
                  </div>
                ))}
              </div>

              {/* Reply box */}
              <div className="td-reply">
                <textarea
                  className="form-textarea td-reply-input"
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                />
                <div className="td-reply-actions">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={handleSendReply}
                  >
                    <Send size={14} /> Send Reply
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="td-sidebar">
            {/* Status Actions */}
            <div className="td-sidebar-section">
              <h5 className="td-sidebar-title">Actions</h5>
              <div className="td-action-buttons">
                {ticket.status !== 'resolved' && (
                  <button
                    className="btn btn-secondary btn-sm td-action-btn"
                    onClick={() => handleStatusChange('resolved')}
                  >
                    <CheckCircle2 size={14} /> Resolve
                  </button>
                )}
                {ticket.status !== 'escalated' && (
                  <button
                    className="btn btn-danger btn-sm td-action-btn"
                    onClick={() => handleStatusChange('escalated')}
                  >
                    <ArrowUp size={14} /> Escalate
                  </button>
                )}
                {ticket.status === 'open' && (
                  <button
                    className="btn btn-secondary btn-sm td-action-btn"
                    onClick={() => handleStatusChange('in_progress')}
                  >
                    <Clock size={14} /> In Progress
                  </button>
                )}
              </div>
            </div>

            {/* Assignment */}
            <div className="td-sidebar-section">
              <h5 className="td-sidebar-title">Assigned To</h5>
              {agent ? (
                <div className="td-assigned-agent">
                  <span className="td-agent-avatar">{agent.avatar}</span>
                  <div>
                    <div className="td-agent-name">{agent.name}</div>
                    <div className="td-agent-role">{agent.role}</div>
                  </div>
                </div>
              ) : (
                <p className="td-unassigned">No agent assigned</p>
              )}
            </div>

            {/* Tags */}
            <div className="td-sidebar-section">
              <h5 className="td-sidebar-title">Tags</h5>
              <div className="td-tags">
                {ticket.tags.map((tag, i) => (
                  <span key={i} className="td-tag">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* SLA */}
            <div className="td-sidebar-section">
              <h5 className="td-sidebar-title">SLA Deadline</h5>
              <p className={`td-sla ${isSLABreached ? 'breached' : ''}`}>
                {format(new Date(ticket.slaDeadline), 'MMM dd, yyyy HH:mm')}
                {isSLABreached && <AlertTriangle size={14} />}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
