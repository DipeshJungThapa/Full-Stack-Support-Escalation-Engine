import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AgentDashboard from '../dashboard/AgentDashboard';
import AdminDashboard from '../dashboard/AdminDashboard';
import TicketList from '../tickets/TicketList';

const DashboardRouter = () => {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') {
    return <AdminDashboard />;
  }

  if (user?.role === 'AGENT') {
    return <AgentDashboard />;
  }

  return <TicketList />;
};

export default DashboardRouter;
