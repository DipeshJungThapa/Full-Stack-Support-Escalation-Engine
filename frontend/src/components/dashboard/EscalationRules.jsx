import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import {
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Save,
  Trash
} from 'lucide-react';

const EscalationRules = () => {
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({ name: '', priority_threshold: 'MEDIUM', max_idle_hours: 24 });
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const fetchRules = async () => {
    try {
      const response = await api.get('/escalation-rules/');
      setRules(response.data);
    } catch (error) {
      console.error("Failed to fetch rules", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualScan = async () => {
    setScanning(true);
    try {
      const response = await api.post('/tickets/scan_escalations/');
      alert(response.data.message);
    } catch (error) {
      console.error("Scan failed", error);
      alert("Failed to run escalation engine.");
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/escalation-rules/', newRule);
      setNewRule({ name: '', priority_threshold: 'MEDIUM', max_idle_hours: 24 });
      fetchRules();
    } catch (error) {
      console.error("Failed to create rule", error);
    }
  };

  const toggleRule = async (rule) => {
    try {
      await api.patch(`/escalation-rules/${rule.id}/`, { is_active: !rule.is_active });
      fetchRules();
    } catch (error) {
      console.error("Failed to toggle rule", error);
    }
  };

  const deleteRule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) return;
    try {
      await api.delete(`/escalation-rules/${id}/`);
      fetchRules();
    } catch (error) {
      console.error("Failed to delete rule", error);
    }
  };

  if (loading) return <div className="animate-pulse space-y-6"><div className="h-64 bg-slate-100 rounded-xl" /></div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Escalation Rules</h2>
          <p className="text-slate-500 text-sm font-medium">Configure automatic ticket escalation thresholds.</p>
        </div>
        <button
          onClick={handleManualScan}
          disabled={scanning}
          className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-amber-100 transition-all disabled:opacity-50"
        >
          <ShieldAlert className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Running Engine...' : 'Run Escalation Engine'}
        </button>
      </div>

      {/* New Rule Form */}
      <div className="premium-card p-8 bg-white/50 border-dashed">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create New Rule
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Rule Name</label>
            <input
              type="text"
              placeholder="e.g. Critical Priority Guard"
              value={newRule.name}
              onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-600/20 transition-all shadow-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Priority Threshold</label>
            <select
              value={newRule.priority_threshold}
              onChange={(e) => setNewRule({ ...newRule, priority_threshold: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-600/20 transition-all shadow-sm"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Max Idle Hours</label>
            <div className="relative">
              <input
                type="number"
                value={newRule.max_idle_hours}
                onChange={(e) => setNewRule({ ...newRule, max_idle_hours: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-600/20 transition-all shadow-sm"
                required
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            </div>
          </div>
          <button type="submit" className="premium-button-primary h-[46px] justify-center shadow-md shadow-primary-600/10">
            <Save className="w-4 h-4" /> Save Rule
          </button>
        </form>
      </div>

      {/* Rules Table */}
      <div className="premium-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest border-b border-slate-200">
            <tr>
              <th className="px-8 py-5">Rule Info</th>
              <th className="px-8 py-5">Threshold</th>
              <th className="px-8 py-5">Max Idle</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 italic-last-row">
            {rules.map(rule => (
              <tr key={rule.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 uppercase">{rule.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Active Policy</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${rule.priority_threshold === 'CRITICAL' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                    {rule.priority_threshold} Priority
                  </span>
                </td>
                <td className="px-8 py-6 font-bold text-slate-700 text-sm">
                  {rule.max_idle_hours} <span className="text-slate-400 font-medium">hrs</span>
                </td>
                <td className="px-8 py-6">
                  <button onClick={() => toggleRule(rule)} className="flex items-center gap-2 group/btn">
                    {rule.is_active ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-tighter">Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-slate-300 group-hover/btn:text-slate-400" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Inactive</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="px-8 py-6 text-right">
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest italic">
                  No escalation rules defined.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EscalationRules;
