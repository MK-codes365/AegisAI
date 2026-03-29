import { Clock, User, Building2, Sparkles, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { URGENCY_CONFIG, SENTIMENT_CONFIG, STATUS_CONFIG, AGENTS } from '../utils/constants';
import './TicketCard.css';

export default function TicketCard({ ticket, onClick, compact = false }) {
  const urgency = URGENCY_CONFIG[ticket.urgency];
  const sentiment = SENTIMENT_CONFIG[ticket.sentiment];
  const status = STATUS_CONFIG[ticket.status];
  const agent = AGENTS.find((a) => a.id === ticket.assignedTo);
  const timeAgo = formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true });

  const isSLABreached = new Date(ticket.slaDeadline) < new Date();

  return (
    <div
      className={`ticket-card glass-card ${ticket.urgency} ${compact ? 'compact' : ''}`}
      onClick={() => onClick?.(ticket)}
      role="button"
      tabIndex={0}
    >
      {/* Urgency strip */}
      <div className="ticket-urgency-strip" style={{ background: urgency.color }}></div>

      <div className="ticket-card-content">
        {/* Header row */}
        <div className="ticket-card-header">
          <div className="ticket-badges">
            <span className={`badge badge-${ticket.urgency}`}>
              {urgency.icon} {urgency.label}
            </span>
            <span className={`badge badge-status-${ticket.status.replace('_', '-')}`}>
              {status.label}
            </span>
            {isSLABreached && ticket.status !== 'resolved' && (
              <span className="badge badge-critical sla-breach">
                <AlertTriangle size={10} /> SLA Breached
              </span>
            )}
          </div>
          <span className="ticket-time">
            <Clock size={12} />
            {timeAgo}
          </span>
        </div>

        {/* Subject */}
        <h3 className="ticket-subject">{ticket.subject}</h3>

        {/* Description preview */}
        {!compact && (
          <p className="ticket-description">{ticket.description.slice(0, 120)}...</p>
        )}

        {/* AI Analysis preview */}
        {ticket.aiAnalysis && !compact && (
          <div className="ticket-ai-preview">
            <Sparkles size={12} className="ai-sparkle" />
            <span>{ticket.aiAnalysis.summary.slice(0, 100)}...</span>
          </div>
        )}

        {/* Footer */}
        <div className="ticket-card-footer">
          <div className="ticket-meta">
            <div className="ticket-customer">
              <User size={13} />
              <span>{ticket.customer.name}</span>
            </div>
            <div className="ticket-company">
              <Building2 size={13} />
              <span>{ticket.customer.company}</span>
            </div>
            <span className="ticket-category-tag">{ticket.category}</span>
          </div>

          <div className="ticket-footer-right">
            {/* Sentiment */}
            <span className="ticket-sentiment" title={`Sentiment: ${sentiment.label}`}>
              {sentiment.emoji}
            </span>

            {/* Agent */}
            {agent ? (
              <span className="ticket-agent" title={`Assigned to ${agent.name}`}>
                {agent.avatar}
              </span>
            ) : (
              <span className="ticket-unassigned">Unassigned</span>
            )}

            {/* AI Confidence */}
            {ticket.aiAnalysis && (
              <span className="ticket-confidence" title="AI Confidence">
                {Math.round(ticket.aiAnalysis.confidence * 100)}%
              </span>
            )}

            <ArrowUpRight size={14} className="ticket-arrow" />
          </div>
        </div>
      </div>
    </div>
  );
}
