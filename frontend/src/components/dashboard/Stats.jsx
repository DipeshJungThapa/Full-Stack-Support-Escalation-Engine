import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import {
  BarChart3,
  Ticket,
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const Stats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats/');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl border border-slate-200" />
      ))}
    </div>
  );

  const statItems = [
    {
      label: 'Total Tickets',
      value: stats.TOTAL,
      icon: Ticket,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
      trend: '+12%',
      trendUp: true
    },
    {
      label: 'Open Tickets',
      value: stats.OPEN + stats.IN_PROGRESS,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      trend: '+5%',
      trendUp: true,
      border: 'border-r-4 border-orange-500'
    },
    {
      label: 'Resolved Tickets',
      value: stats.RESOLVED + stats.CLOSED,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      trend: '+7%',
      trendUp: true
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {statItems.map((item) => (
        <div key={item.label} className={`premium-card p-6 flex flex-col justify-between ${item.border || ''}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{item.label}</p>
              <h3 className="text-3xl font-bold text-slate-900">{item.value}</h3>
            </div>
            <div className={`${item.bg} p-2.5 rounded-xl`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5">
            <div className={`flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded ${item.trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-50'}`}>
              {item.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {item.trend}
            </div>
            <span className="text-xs text-slate-400 font-medium tracking-tight">vs last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
