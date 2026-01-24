import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AgentDashboard from './AgentDashboard';
import EscalationRules from './EscalationRules';
import { LayoutDashboard, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'TICKETS';

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Tab bar wrapper with premium look */}
      <div className="flex border-b border-slate-200">
        <button
          className={`flex items-center gap-2.5 px-8 py-4 text-[11px] font-extrabold uppercase tracking-widest transition-all relative ${activeTab === 'TICKETS'
              ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600'
              : 'text-slate-400 hover:text-slate-600'
            }`}
          onClick={() => setActiveTab('TICKETS')}
        >
          <LayoutDashboard className="w-4 h-4" />
          Manage Tickets
        </button>
        <button
          className={`flex items-center gap-2.5 px-8 py-4 text-[11px] font-extrabold uppercase tracking-widest transition-all relative ${activeTab === 'RULES'
              ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600'
              : 'text-slate-400 hover:text-slate-600'
            }`}
          onClick={() => setActiveTab('RULES')}
        >
          <ShieldAlert className="w-4 h-4" />
          Escalation Rules
        </button>
      </div>

      <div className="animate-slide-in">
        {activeTab === 'TICKETS' ? (
          <AgentDashboard />
        ) : (
          <EscalationRules />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
