import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { useTickets } from '../hooks/useTickets';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dashboard/tickets', icon: Ticket, label: 'Tickets' },
  { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { getStats } = useTickets();
  const stats = getStats();
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <Link to="/" className="sidebar-logo-link">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <img src="/logo.png" alt="AegisAI" className="sidebar-logo-img" />
          </div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-title">AegisAI</span>
              <span className="logo-subtitle">Smart Prioritizer</span>
            </div>
          )}
        </div>
      </Link>

      {/* Collapse Toggle */}
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <div className="sidebar-link-icon">
              <Icon size={20} />
            </div>
            {!collapsed && <span className="sidebar-link-label">{label}</span>}
            {!collapsed && label === 'Tickets' && stats.open > 0 && (
              <span className="sidebar-badge">{stats.open}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Quick Stats */}
      {!collapsed && (
        <div className="sidebar-stats">
          <div className="sidebar-stat-card">
            <div className="sidebar-stat-header">
              <Zap size={14} className="text-amber" />
              <span>Active Alerts</span>
            </div>
            <div className="sidebar-stat-value">
              {stats.critical + stats.escalated}
            </div>
            <div className="sidebar-stat-detail">
              <span className="dot critical"></span>
              {stats.critical} Critical
            </div>
            <div className="sidebar-stat-detail">
              <span className="dot escalated"></span>
              {stats.escalated} Escalated
            </div>
          </div>
        </div>
      )}

      {/* AI Status */}
      <div className="sidebar-footer">
        <div className="ai-status">
          <div className="ai-status-dot"></div>
          {!collapsed && (
            <div className="ai-status-text">
              <span className="ai-status-label">AI Engine</span>
              <span className="ai-status-value">Active</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
