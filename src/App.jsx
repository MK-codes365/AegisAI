import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TicketProvider } from './hooks/useTickets';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TicketDetail from './components/TicketDetail';
import NewTicketModal from './components/NewTicketModal';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';
import { Navigate } from 'react-router-dom';

function AppLayout() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicket, setShowNewTicket] = useState(false);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header onNewTicket={() => setShowNewTicket(true)} />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<DashboardPage onTicketClick={handleTicketClick} />} />
            <Route path="/tickets" element={<TicketsPage onTicketClick={handleTicketClick} />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>

      {/* Modals */}
      {selectedTicket && (
        <TicketDetail ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
      {showNewTicket && (
        <NewTicketModal onClose={() => setShowNewTicket(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TicketProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard/*" element={<AppLayout />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TicketProvider>
    </BrowserRouter>
  );
}
