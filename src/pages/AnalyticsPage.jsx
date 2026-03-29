import {
  TrendingUp, Clock, CheckCircle2, AlertTriangle,
  ThumbsUp, BarChart3, Target, Sparkles, Gauge
} from 'lucide-react';
import { useTickets } from '../hooks/useTickets';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';
import './AnalyticsPage.css';

export default function AnalyticsPage() {
  const { analytics, getStats } = useTickets();
  const stats = getStats();

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="chart-tooltip-value">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  };

  const kpiCards = [
    {
      label: 'Customer Satisfaction',
      value: `${analytics.customerSatisfaction}%`,
      icon: ThumbsUp,
      color: '#34d399',
      description: 'Based on post-resolution surveys',
    },
    {
      label: 'SLA Compliance',
      value: `${analytics.slaCompliance}%`,
      icon: Target,
      color: '#6366f1',
      description: 'Tickets resolved within SLA',
    },
    {
      label: 'Avg Resolution Time',
      value: analytics.avgResolutionTime,
      icon: Clock,
      color: '#22d3ee',
      description: 'From open to resolved',
    },
    {
      label: 'Escalation Rate',
      value: `${analytics.escalationRate}%`,
      icon: AlertTriangle,
      color: '#fbbf24',
      description: 'Tickets requiring escalation',
    },
  ];

  const satisfactionData = [
    { name: 'Score', value: analytics.customerSatisfaction, fill: '#34d399' },
  ];

  return (
    <div className="analytics-page">
      {/* AI Insight Banner */}
      <div className="ai-insight-banner animate-fade-in-up">
        <div className="ai-insight-icon">
          <Sparkles size={20} className="ai-sparkle" />
        </div>
        <div className="ai-insight-content">
          <h4 className="ai-insight-title">AI Weekly Insight</h4>
          <p className="ai-insight-text">
            Ticket volume increased 12% this week, driven primarily by <strong>Technical</strong> and <strong>Billing</strong> categories.
            Customer sentiment improved by 8% after implementing AI-suggested responses. <strong>3 recurring issues</strong> detected
            in the payment gateway — consider a proactive status page update.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid stagger-children">
        {kpiCards.map((kpi, i) => (
          <div key={i} className="glass-card kpi-card animate-fade-in-up">
            <div className="kpi-header">
              <div className="kpi-icon" style={{ background: `${kpi.color}18`, color: kpi.color }}>
                <kpi.icon size={20} />
              </div>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-description">{kpi.description}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="analytics-charts">
        {/* Response Time Trend */}
        <div className="glass-card-static chart-card animate-fade-in-up">
          <div className="chart-header">
            <div>
              <h4 className="chart-title">
                <Gauge size={16} />
                Response Time Trend
              </h4>
              <p className="chart-subtitle">Average first response time (minutes)</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={analytics.responseTimeTrend}>
                <defs>
                  <linearGradient id="gradResponse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} unit="m" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="avg" stroke="#22d3ee" fill="url(#gradResponse)" strokeWidth={2} name="Avg Response" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Urgency Distribution */}
        <div className="glass-card-static chart-card animate-fade-in-up">
          <div className="chart-header">
            <div>
              <h4 className="chart-title">Urgency Distribution</h4>
              <p className="chart-subtitle">Current ticket urgency levels</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.ticketsByUrgency} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Tickets">
                  {analytics.ticketsByUrgency.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Breakdown */}
        <div className="glass-card-static chart-card wide-chart animate-fade-in-up">
          <div className="chart-header">
            <div>
              <h4 className="chart-title">
                <Sparkles size={16} className="ai-sparkle" />
                Sentiment Analysis Over Time
              </h4>
              <p className="chart-subtitle">AI-powered customer sentiment tracking throughout the day</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={analytics.sentimentTrend}>
                <defs>
                  <linearGradient id="gradA2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradF2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradN2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradP2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="positive" stroke="#22c55e" fill="url(#gradP2)" strokeWidth={2} name="😊 Positive" />
                <Area type="monotone" dataKey="neutral" stroke="#94a3b8" fill="url(#gradN2)" strokeWidth={2} name="😐 Neutral" />
                <Area type="monotone" dataKey="frustrated" stroke="#f97316" fill="url(#gradF2)" strokeWidth={2} name="😤 Frustrated" />
                <Area type="monotone" dataKey="angry" stroke="#ef4444" fill="url(#gradA2)" strokeWidth={2} name="😠 Angry" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-grid">
        <div className="glass-card-static summary-card">
          <h4 className="summary-title">Status Overview</h4>
          <div className="summary-items">
            {[
              { label: 'Open', value: stats.open, color: '#3b82f6' },
              { label: 'In Progress', value: stats.inProgress, color: '#a855f7' },
              { label: 'Escalated', value: stats.escalated, color: '#ef4444' },
              { label: 'Resolved', value: stats.resolved, color: '#22c55e' },
            ].map((item, i) => (
              <div key={i} className="summary-item">
                <div className="summary-item-left">
                  <span className="summary-dot" style={{ background: item.color }}></span>
                  <span className="summary-label">{item.label}</span>
                </div>
                <span className="summary-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card-static summary-card">
          <h4 className="summary-title">Sentiment Overview</h4>
          <div className="summary-items">
            {[
              { label: '😠 Angry', value: stats.sentiments.angry, color: '#ef4444' },
              { label: '😤 Frustrated', value: stats.sentiments.frustrated, color: '#f97316' },
              { label: '😐 Neutral', value: stats.sentiments.neutral, color: '#94a3b8' },
              { label: '😊 Positive', value: stats.sentiments.positive, color: '#22c55e' },
            ].map((item, i) => (
              <div key={i} className="summary-item">
                <div className="summary-item-left">
                  <span className="summary-dot" style={{ background: item.color }}></span>
                  <span className="summary-label">{item.label}</span>
                </div>
                <span className="summary-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card-static summary-card ai-summary-card">
          <h4 className="summary-title">
            <Sparkles size={14} className="ai-sparkle" />
            AI Performance
          </h4>
          <div className="summary-items">
            <div className="summary-item">
              <span className="summary-label">Tickets Analyzed</span>
              <span className="summary-value">{stats.total}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Avg Confidence</span>
              <span className="summary-value ai-value">91.2%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Auto-categorized</span>
              <span className="summary-value ai-value">96.5%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Response Suggestions Used</span>
              <span className="summary-value ai-value">78.3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
