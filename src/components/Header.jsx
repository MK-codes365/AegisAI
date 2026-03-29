import { Search, Bell, Plus, Sparkles } from 'lucide-react';
import { useTickets } from '../hooks/useTickets';
import { useLocation } from 'react-router-dom';
import './Header.css';

const pageTitles = {
  '/': 'Dashboard',
  '/tickets': 'Tickets',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

export default function Header({ onNewTicket }) {
  const { filters, setFilters, getStats } = useTickets();
  const location = useLocation();
  const stats = getStats();

  return (
    <header className="app-header">
      <div className="header-left">
        <div>
          <h1 className="header-title">{pageTitles[location.pathname] || 'Dashboard'}</h1>
          <p className="header-subtitle">
            {location.pathname === '/'
              ? `${stats.total} tickets • ${stats.critical} critical alerts`
              : location.pathname === '/tickets'
              ? `${stats.open} open • ${stats.inProgress} in progress`
              : location.pathname === '/analytics'
              ? 'AI-powered insights & trends'
              : 'System configuration'}
          </p>
        </div>
      </div>

      <div className="header-center">
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tickets, customers, topics..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          />
          <kbd className="search-kbd">⌘K</kbd>
        </div>
      </div>

      <div className="header-right">
        <button className="header-btn notification-btn" aria-label="Notifications">
          <Bell size={18} />
          {stats.critical > 0 && (
            <span className="notification-dot">{stats.critical}</span>
          )}
        </button>

        <div className="header-ai-badge">
          <Sparkles size={14} />
          <span>AI Active</span>
        </div>

        <button className="btn btn-primary btn-sm" onClick={onNewTicket}>
          <Plus size={16} />
          New Ticket
        </button>
      </div>
    </header>
  );
}
