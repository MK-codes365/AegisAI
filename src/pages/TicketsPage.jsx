import { useState } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Grid, List } from 'lucide-react';
import { useTickets } from '../hooks/useTickets';
import TicketCard from '../components/TicketCard';
import { CATEGORIES } from '../utils/constants';
import './TicketsPage.css';

export default function TicketsPage({ onTicketClick }) {
  const { filteredTickets, filters, setFilters } = useTickets();
  const [viewMode, setViewMode] = useState('list');

  return (
    <div className="tickets-page">
      {/* Filter Bar */}
      <div className="tickets-filter-bar glass-card-static animate-fade-in">
        <div className="filter-row">
          <div className="filter-group">
            <Filter size={16} className="filter-icon" />

            <select
              className="form-select filter-select"
              value={filters.status}
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
            </select>

            <select
              className="form-select filter-select"
              value={filters.urgency}
              onChange={(e) => setFilters((p) => ({ ...p, urgency: e.target.value }))}
            >
              <option value="all">All Urgency</option>
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>

            <select
              className="form-select filter-select"
              value={filters.category}
              onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-right">
            <div className="sort-group">
              <ArrowUpDown size={14} />
              <select
                className="form-select filter-select"
                value={filters.sortBy}
                onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value }))}
              >
                <option value="urgency">Sort: Urgency</option>
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="sentiment">Sort: Sentiment</option>
              </select>
            </div>

            <div className="view-toggle">
              <button
                className={`btn btn-ghost btn-icon ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </button>
              <button
                className={`btn btn-ghost btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="filter-summary">
          Showing <strong>{filteredTickets.length}</strong> tickets
          {filters.status !== 'all' && ` • Status: ${filters.status}`}
          {filters.urgency !== 'all' && ` • Urgency: ${filters.urgency}`}
          {filters.category !== 'all' && ` • Category: ${filters.category}`}
        </div>
      </div>

      {/* Ticket List */}
      <div className={`tickets-list ${viewMode === 'grid' ? 'grid-view' : 'list-view'} stagger-children`}>
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={onTicketClick}
              compact={viewMode === 'grid'}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Filter size={28} />
            </div>
            <h3>No tickets match your filters</h3>
            <p className="section-subtitle">Try adjusting your filters to see more results</p>
            <button
              className="btn btn-secondary"
              onClick={() =>
                setFilters({ status: 'all', urgency: 'all', category: 'all', search: '', sortBy: 'urgency' })
              }
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
