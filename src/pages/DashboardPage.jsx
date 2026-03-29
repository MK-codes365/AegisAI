import {
  Ticket, AlertTriangle, Clock, CheckCircle2,
  TrendingUp, TrendingDown, Zap, Shield, Users,
  BarChart3, Sparkles, ArrowUpRight
} from 'lucide-react';
import { useTickets } from '../hooks/useTickets';
import TicketCard from '../components/TicketCard';
import { AGENTS } from '../utils/constants';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import './DashboardPage.css';

export default function DashboardPage({ onTicketClick }) {
  const { filteredTickets, getStats, analytics, clusters, resolveCluster, agents, lastSync } = useTickets();
  const stats = getStats();

  const criticalTickets = filteredTickets.filter((t) => t.urgency === 'critical' || t.status === 'escalated');
  const recentTickets = filteredTickets.slice(0, 5);

  const statCards = [
    {
      label: 'Total Tickets',
      value: stats.total,
      icon: Ticket,
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.12)',
      change: '+12%',
      positive: true,
    },
    {
      label: 'Critical Alerts',
      value: stats.critical + stats.escalated,
      icon: AlertTriangle,
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.12)',
      change: stats.critical > 0 ? 'Action Required' : 'All Clear',
      positive: stats.critical === 0,
    },
    {
      label: 'Avg. Response',
      value: analytics.avgResponseTime,
      icon: Clock,
      color: '#22d3ee',
      bg: 'rgba(34,211,238,0.12)',
      change: '-18%',
      positive: true,
    },
    {
      label: 'Resolved Today',
      value: analytics.resolvedToday,
      icon: CheckCircle2,
      color: '#34d399',
      bg: 'rgba(52,211,153,0.12)',
      change: '+8%',
      positive: true,
    },
  ];

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

  return (
    <div className="dashboard-page">
      <div className="stats-grid stagger-children">
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card stat-card animate-fade-in-up">
            <div style={{ background: stat.bg, color: stat.color }} className="stat-icon">
              <stat.icon size={22} />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
              {stat.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {stat.change}
            </div>
            <div className="stat-card-strip" style={{ background: stat.color }}></div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="dashboard-grid">
        {/* Critical Alerts */}
        {criticalTickets.length > 0 && (
          <div className="dashboard-section critical-section animate-fade-in-up">
            <div className="section-header">
              <div>
                <h3 className="section-title">
                  <Zap size={18} className="text-red" />
                  Critical & Escalated
                </h3>
                <p className="section-subtitle">
                  {criticalTickets.length} tickets requiring immediate attention
                </p>
              </div>
            </div>
            <div className="critical-tickets">
              {criticalTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} onClick={onTicketClick} compact />
              ))}
            </div>
          </div>
        )}

        {/* Master Incidents / Clusters */}
        {clusters.length > 0 && (
          <div className="dashboard-section cluster-section animate-fade-in-up">
            <div className="section-header">
              <div>
                <h3 className="section-title text-gradient">
                  <Sparkles size={18} className="ai-sparkle" />
                  AI-Detected Master Incidents
                </h3>
                <p className="section-subtitle">
                  {clusters.length} active clusters based on shared root patterns
                </p>
              </div>
            </div>
            <div className="cluster-grid">
              {clusters.map((cluster) => (
                <div key={cluster.id} className="glass-card cluster-card neon-glow">
                  <div className="cluster-header">
                    <div className={`cluster-badge ${cluster.urgency}`}>
                      {cluster.count} Tickets
                    </div>
                    <div className="cluster-category">{cluster.category}</div>
                  </div>
                  <h4 className="cluster-pattern">{cluster.pattern}</h4>
                  <div className="cluster-footer">
                    <div className="cluster-customers">
                      {cluster.tickets.slice(0, 3).map(t => t.customer.name).join(', ')}
                      {cluster.count > 3 && ` +${cluster.count - 3} more`}
                    </div>
                    <button 
                      className="btn-resolve-cluster"
                      onClick={() => resolveCluster(cluster.pattern)}
                    >
                      Mass Resolve <CheckCircle2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="charts-row">
          {/* Ticket Volume Chart */}
          <div className="glass-card-static chart-card animate-fade-in-up">
            <div className="chart-header">
              <div>
                <h4 className="chart-title">Ticket Volume</h4>
                <p className="chart-subtitle">This week's activity</p>
              </div>
              <BarChart3 size={18} className="chart-icon" />
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analytics.ticketsByDay} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="tickets" fill="#6366f1" radius={[4, 4, 0, 0]} name="Received" />
                  <Bar dataKey="resolved" fill="#34d399" radius={[4, 4, 0, 0]} name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="glass-card-static chart-card animate-fade-in-up">
            <div className="chart-header">
              <div>
                <h4 className="chart-title">By Category</h4>
                <p className="chart-subtitle">Ticket distribution</p>
              </div>
            </div>
            <div className="chart-container pie-chart-container">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={analytics.ticketsByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {analytics.ticketsByCategory.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {analytics.ticketsByCategory.map((cat, i) => (
                  <div key={i} className="pie-legend-item">
                    <span className="pie-legend-dot" style={{ background: cat.color }}></span>
                    <span className="pie-legend-label">{cat.name}</span>
                    <span className="pie-legend-value">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Trend */}
        <div className="glass-card-static chart-card wide-chart animate-fade-in-up">
          <div className="chart-header">
            <div>
              <h4 className="chart-title">
                <Sparkles size={16} className="ai-sparkle" />
                Sentiment Trend
              </h4>
              <p className="chart-subtitle">AI-detected customer sentiment throughout the day</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={analytics.sentimentTrend}>
                <defs>
                  <linearGradient id="gradAngry" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradFrustrated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradNeutral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPositive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="angry" stroke="#ef4444" fill="url(#gradAngry)" strokeWidth={2} name="😠 Angry" />
                <Area type="monotone" dataKey="frustrated" stroke="#f97316" fill="url(#gradFrustrated)" strokeWidth={2} name="😤 Frustrated" />
                <Area type="monotone" dataKey="neutral" stroke="#94a3b8" fill="url(#gradNeutral)" strokeWidth={2} name="😐 Neutral" />
                <Area type="monotone" dataKey="positive" stroke="#22c55e" fill="url(#gradPositive)" strokeWidth={2} name="😊 Positive" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-bottom">
          {/* Recent Tickets */}
          <div className="dashboard-section recent-section">
            <div className="section-header">
              <div>
                <h3 className="section-title">Recent Tickets</h3>
                <p className="section-subtitle">Latest incoming tickets</p>
              </div>
            </div>
            <div className="recent-tickets">
              {recentTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} onClick={onTicketClick} compact />
              ))}
            </div>
          </div>

          {/* Agent Load */}
          <div className="glass-card-static agent-load-card">
            <div className="chart-header" style={{ padding: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 className="chart-title">
                  <Users size={16} />
                  Agent Workload
                </h4>
                <p className="chart-subtitle">Current ticket distribution</p>
              </div>
              <div className="live-status-badge">
                <span className="live-dot"></span>
                <span className="live-text">LIVE</span>
                <span className="sync-time">{lastSync}</span>
              </div>
            </div>
            <div className="agent-list">
              {agents.map((agent) => (
                <div key={agent.id} className="agent-item">
                  <div className="agent-info">
                    <span className="agent-avatar">{agent.avatar}</span>
                    <div>
                      <div className="agent-name">{agent.name}</div>
                      <div className="agent-role">{agent.role}</div>
                    </div>
                  </div>
                  <div className="agent-load">
                    <div className="progress-bar agent-progress">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${Math.min(agent.tickets * 10, 100)}%` }}
                      ></div>
                    </div>
                    <span className="agent-ticket-count">{agent.tickets}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
