import { useState, createContext, useContext, useCallback, useEffect, useMemo } from 'react';
import { getTickets, updateTicket as apiUpdateTicket, isBackendAvailable } from '../utils/api';
// import { mockTickets, mockAnalytics } from '../utils/mockData';

const TicketContext = createContext(null);

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) throw new Error('useTickets must be used within TicketProvider');
  return context;
};

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  
  // Dynamic analytics calculated from real ticket data
  const analytics = useMemo(() => {
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const resolvedToday = tickets.filter(t => t.status === 'resolved' && new Date(t.updatedAt).toDateString() === new Date().toDateString()).length;
    
    // 1. Tickets By Day (Last 7 Days)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const ticketsByDay = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayName = days[d.getDay()];
      const dayTickets = tickets.filter(t => new Date(t.createdAt).toDateString() === d.toDateString());
      const dayResolved = tickets.filter(t => t.status === 'resolved' && new Date(t.updatedAt).toDateString() === d.toDateString());
      return { day: dayName, tickets: dayTickets.length, resolved: dayResolved.length };
    });

    // 2. Tickets By Category
    const categories = ['Technical', 'Billing', 'Account', 'Bug Report', 'Feature Request', 'Security', 'Performance', 'Integration', 'General'];
    const colors = ['#6366f1', '#22d3ee', '#a78bfa', '#fb7185', '#34d399', '#fbbf24', '#f43f5e', '#ec4899', '#94a3b8'];
    const ticketsByCategory = categories.map((cat, i) => {
      const count = tickets.filter(t => t.category === cat).length;
      return { name: cat, value: count, color: colors[i] };
    }).filter(cat => cat.value > 0);

    // 3. Tickets By Urgency
    const urgencies = ['critical', 'high', 'medium', 'low'];
    const uColors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
    const ticketsByUrgency = urgencies.map((u, i) => {
      const count = tickets.filter(t => t.urgency === u).length;
      return { name: u.charAt(0).toUpperCase() + u.slice(1), value: count, color: uColors[i] };
    });

    // 4. Sentiment Trend (Last 8 Hours)
    const sentimentTrend = Array.from({ length: 8 }, (_, i) => {
      const d = new Date();
      d.setHours(d.getHours() - (7 - i));
      const hourStr = d.getHours() % 12 || 12;
      const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
      const time = `${hourStr}${ampm}`;
      
      const hourTickets = tickets.filter(t => new Date(t.createdAt).getHours() === d.getHours());
      return {
        time,
        angry: hourTickets.filter(t => t.sentiment === 'angry').length,
        frustrated: hourTickets.filter(t => t.sentiment === 'frustrated').length,
        neutral: hourTickets.filter(t => t.sentiment === 'neutral').length,
        positive: hourTickets.filter(t => t.sentiment === 'positive').length,
      };
    });

    return {
      totalTickets,
      openTickets,
      resolvedToday,
      avgResponseTime: '0 min',
      avgResolutionTime: '0 hours',
      customerSatisfaction: 0,
      escalationRate: totalTickets ? Math.round((tickets.filter(t => t.status === 'escalated').length / totalTickets) * 100) : 0,
      slaCompliance: 100,
      ticketsByDay,
      ticketsByCategory,
      ticketsByUrgency,
      sentimentTrend,
      responseTimeTrend: [],
    };
  }, [tickets]);

  // AI-Driven "Master Incident" Clustering Logic
  const clusters = useMemo(() => {
    const openTickets = tickets.filter(t => t.status !== 'resolved');
    const groups = {};

    openTickets.forEach(t => {
      const pattern = t.aiAnalysis?.similarIssuePattern?.trim().toLowerCase();
      if (pattern && pattern !== 'n/a' && pattern !== 'unknown') {
        if (!groups[pattern]) groups[pattern] = { originalName: t.aiAnalysis.similarIssuePattern, tickets: [] };
        groups[pattern].tickets.push(t);
      }
    });

    // Detect clusters with 2+ related tickets as "Master Incidents" for better visibility
    return Object.entries(groups)
      .filter(([_, data]) => data.tickets.length >= 2)
      .map(([pattern, data]) => ({
        id: `cluster-${pattern.replace(/\s+/g, '-').toLowerCase()}`,
        pattern: data.originalName,
        count: data.tickets.length,
        tickets: data.tickets,
        urgency: data.tickets.some(t => t.urgency === 'critical') ? 'critical' : 'high',
        category: data.tickets[0].category
      }))
      .sort((a, b) => b.count - a.count);
  }, [tickets]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    urgency: 'all',
    category: 'all',
    search: '',
    sortBy: 'urgency',
  });

  // Initial fetch and polling for real-time updates
  useEffect(() => {
    let isMounted = true;

    const fetchTickets = async () => {
      try {
        const backendUp = await isBackendAvailable();
        if (!backendUp) {
          setIsOffline(true);
          return;
        }

        const data = await getTickets();
        if (data && isMounted) {
          setTickets(data);
          setIsOffline(false);
        }
      } catch (err) {
        console.warn('Sync failed:', err.message);
        if (isMounted) setIsOffline(true);
      }
    };

    fetchTickets();

    // Poll every 5 seconds for "real-time" sync
    const interval = setInterval(fetchTickets, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredTickets = tickets
    .filter((t) => {
      if (filters.status !== 'all' && t.status !== filters.status) return false;
      if (filters.urgency !== 'all' && t.urgency !== filters.urgency) return false;
      if (filters.category !== 'all' && t.category !== filters.category) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        return (
          t.subject.toLowerCase().includes(s) ||
          t.customer.name.toLowerCase().includes(s) ||
          t.customer.company.toLowerCase().includes(s) ||
          t.description.toLowerCase().includes(s)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      if (filters.sortBy === 'urgency') return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      if (filters.sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (filters.sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (filters.sortBy === 'sentiment') return b.sentimentScore - a.sentimentScore;
      return 0;
    });

  const addTicket = useCallback((ticket) => {
    setTickets((prev) => [ticket, ...prev]);
  }, []);

  const updateTicket = useCallback(async (id, updates) => {
    // 1. Optimistic UI update
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)));

    // 2. Persist to backend
    const backendUp = await isBackendAvailable();
    if (backendUp) {
      await apiUpdateTicket(id, updates);
    }
  }, []);

  const resolveCluster = useCallback(async (pattern) => {
    const clusterTickets = tickets.filter(t => t.aiAnalysis?.similarIssuePattern === pattern && t.status !== 'resolved');
    
    // 1. Bulk optimistic update
    setTickets(prev => prev.map(t => 
      (t.aiAnalysis?.similarIssuePattern === pattern && t.status !== 'resolved')
        ? { ...t, status: 'resolved', updatedAt: new Date().toISOString() }
        : t
    ));

    // 2. Persist each (ideally should have a bulk endpoint, but we'll use existing per-ID for now)
    const backendUp = await isBackendAvailable();
    if (backendUp) {
      for (const t of clusterTickets) {
        await apiUpdateTicket(t.id, { status: 'resolved' });
      }
    }
  }, [tickets]);

  const getStats = useCallback(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === 'open').length;
    const inProgress = tickets.filter((t) => t.status === 'in_progress').length;
    const escalated = tickets.filter((t) => t.status === 'escalated').length;
    const resolved = tickets.filter((t) => t.status === 'resolved').length;
    const critical = tickets.filter((t) => t.urgency === 'critical').length;
    const high = tickets.filter((t) => t.urgency === 'high').length;

    const sentiments = { angry: 0, frustrated: 0, neutral: 0, positive: 0 };
    tickets.forEach((t) => { sentiments[t.sentiment]++; });

    return { total, open, inProgress, escalated, resolved, critical, high, sentiments };
  }, [tickets]);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        filteredTickets,
        selectedTicket,
        setSelectedTicket,
        filters,
        setFilters,
        addTicket,
        updateTicket,
        resolveCluster,
        getStats,
        analytics,
        clusters,
        isOffline,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}
