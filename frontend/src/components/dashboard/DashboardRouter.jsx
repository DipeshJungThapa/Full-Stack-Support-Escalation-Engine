import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AgentDashboard from '../dashboard/AgentDashboard';
import TicketList from '../tickets/TicketList';

const DashboardRouter = () => {
  const { user } = useAuth();

  if (user?.role === 'AGENT' || user?.role === 'ADMIN') {
    return <AgentDashboard />;
  }

  return <TicketList />;
};

export default DashboardRouter;
