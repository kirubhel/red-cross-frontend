"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Settings,
  HelpCircle,
  Bell,
  Search,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Loader2,
  X,
  MessageSquare,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  Mail,
  Zap,
  Globe,
  Plus,
  Rocket,
  Building2,
  Phone,
  Users,
  SearchCode
} from 'lucide-react';
import api from '@/lib/api';

const AdminDashboard = () => {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    pending: 0
  });

  // UI States
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ show: false, action: null as any, id: null as any, name: '' });
  const [matchModal, setMatchModal] = useState({ show: false, org: null as any });

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/organizations');
      const data = res.data.organizations || [];
      setBusinesses(data);
      calculateStats(data);
    } catch (error: any) {
      toast.error('Failed to load businesses');
      if (error.response?.status === 401) router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: any[]) => {
    setStats({
      total: data.length,
      active: data.filter(b => b.status === 'APPROVED').length,
      suspended: data.filter(b => b.status === 'REJECTED').length,
      pending: data.filter(b => b.status === 'PENDING').length
    });
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/organizations/status`, { id, status });
      toast.success(`Business ${status} successfully`);
      fetchBusinesses();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/organizations/${id}`);
      toast.success('Business deleted');
      fetchBusinesses();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const openConfirm = (action: string, id: string, name: string) => {
    setConfirmModal({ show: true, action, id, name });
  };

  const closeConfirm = () => {
    setConfirmModal({ show: false, action: null, id: null, name: '' });
  };

  const executeAction = () => {
    const { action, id } = confirmModal;
    if (action === 'delete') handleDelete(id);
    else handleUpdateStatus(id, action.toUpperCase());
    closeConfirm();
  };

  const filteredBusinesses = businesses.filter(b => {
    const status = b.status?.toLowerCase() || 'pending';
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'approved' && status === 'approved') ||
      (activeTab === 'pending' && status === 'pending') ||
      (activeTab === 'rejected' && status === 'rejected');
    
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  if (loading && businesses.length === 0) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#ED1C24] animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Initializing Admin Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden">
      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={closeConfirm}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                confirmModal.action === 'delete' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
              }`}>
                {confirmModal.action === 'delete' ? <Trash2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
              </div>
              <h3 className="text-2xl font-black mb-2">Confirm Action</h3>
              <p className="text-slate-500 mb-8 font-medium">
                Are you sure you want to <span className="font-black text-slate-900">{confirmModal.action}</span> "{confirmModal.name}"?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={closeConfirm}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeAction}
                  className={`flex-1 py-4 text-white font-black rounded-2xl transition-all shadow-lg ${
                    confirmModal.action === 'delete' ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Match Volunteers Modal */}
      <AnimatePresence>
        {matchModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setMatchModal({ show: false, org: null })}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[40px] p-10 max-w-2xl w-full shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h3 className="text-3xl font-black tracking-tighter">Candidate Match</h3>
                    <p className="text-slate-400 font-bold">Top volunteers for {matchModal.org?.name}</p>
                 </div>
                 <button onClick={() => setMatchModal({ show: false, org: null })} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {[1,2,3].map((v) => (
                  <div key={v} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm font-black text-blue-600 border border-blue-50">
                          {v === 1 ? 'AB' : v === 2 ? 'KT' : 'SB'}
                        </div>
                        <div>
                           <p className="font-black text-sm">{v === 1 ? 'Abebe Bikila' : v === 2 ? 'Kalkidan Tadesse' : 'Solomon Belay'}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Matched: 94% • Addis Ababa</p>
                        </div>
                     </div>
                     <button className="bg-white hover:bg-[#ED1C24] hover:text-white text-black border border-slate-200 px-4 py-2 rounded-xl text-xs font-black transition-all">
                        Assign
                     </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center">
                 <p className="text-xs text-slate-400 font-medium italic">Showing AI-matched candidates based on organization requirements</p>
                 <button className="bg-black text-white px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all">
                    View More
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-80' : 'w-24'} transition-all duration-500 bg-white border-r border-slate-100 flex flex-col z-40 relative shadow-xl shadow-slate-200/50`}
      >
        <div className="p-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#ED1C24] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-red-200">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter leading-none">ERCS</span>
              <span className="text-[10px] font-black text-[#ED1C24] tracking-[0.2em] uppercase mt-1">Admin Hub</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'Overview' },
            { id: 'businesses', icon: Building2, label: 'Business Hub' },
            { id: 'volunteers', icon: Users, label: 'Volunteers' },
            { id: 'analytics', icon: Zap, label: 'Performance' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                item.id === 'businesses' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-6 h-6 ${item.id === 'businesses' ? 'text-blue-600' : 'group-hover:scale-110 transition-transform'}`} />
              {isSidebarOpen && <span className="font-bold">{item.label}</span>}
              {item.id === 'volunteers' && isSidebarOpen && (
                <span className="ml-auto bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-lg">LIVE</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-50">
          <button 
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold group"
          >
            <LogOut className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            {isSidebarOpen && <span>Secure Exit</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-6 py-3 rounded-2xl w-full max-w-xl group focus-within:bg-white focus-within:shadow-xl focus-within:shadow-blue-500/5 transition-all">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by name, email or status..."
              className="bg-transparent border-none outline-none w-full text-sm font-bold placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
             <button className="relative p-3 text-slate-400 hover:text-slate-900 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-[#ED1C24] rounded-full border-2 border-white" />
             </button>
             <div className="h-10 w-px bg-slate-100" />
             <div className="flex items-center gap-4 bg-slate-50 p-2 pr-4 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-100">
                  DA
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-black leading-none">Admin Area</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">Authorized</p>
                </div>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-5xl font-black tracking-tighter mb-2">Business Control Hub</h1>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Real-time Data Stream Enabled
                </p>
              </div>
              <div className="flex gap-4">
                 <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 min-w-[180px]">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                      <p className="text-2xl font-black tabular-nums">{stats.total}</p>
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 min-w-[180px]">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
                      <p className="text-2xl font-black tabular-nums">{stats.pending}</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white p-2 rounded-3xl w-fit shadow-lg shadow-slate-100 border border-slate-50">
              {['all', 'pending', 'approved', 'rejected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-2xl font-black text-sm transition-all capitalize ${
                    activeTab === tab 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                      : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Business Details</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredBusinesses.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-8">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                              <Building2 className="w-7 h-7 text-slate-900" />
                            </div>
                            <div>
                              <p className="font-black text-lg tracking-tight">{item.name}</p>
                              <div className="flex items-center gap-3 mt-1.5 font-bold text-xs text-slate-400">
                                <span>{item.email}</span>
                                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                <span>{item.type}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                            item.status === 'APPROVED' ? 'bg-green-50 text-green-600 border border-green-100' :
                            item.status === 'REJECTED' ? 'bg-red-50 text-red-600 border border-red-100' :
                            'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              item.status === 'APPROVED' ? 'bg-green-600' :
                              item.status === 'REJECTED' ? 'bg-red-600' : 'bg-amber-600'
                            }`} />
                            {item.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="px-8 py-8">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.status === 'APPROVED' && (
                               <button 
                                 onClick={() => setMatchModal({ show: true, org: item })}
                                 className="px-4 py-2 rounded-xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                               >
                                 <SearchCode className="w-3.5 h-3.5" /> Find Volunteers
                               </button>
                            )}
                            {item.status === 'PENDING' && (
                              <button 
                                onClick={() => openConfirm('approved', item.id, item.name)}
                                className="w-10 h-10 rounded-xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all flex items-center justify-center border border-green-100"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                            )}
                            {item.status !== 'REJECTED' && (
                              <button 
                                onClick={() => openConfirm('rejected', item.id, item.name)}
                                className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center border border-amber-100"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                            <button 
                              onClick={() => openConfirm('delete', item.id, item.name)}
                              className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-100"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredBusinesses.length === 0 && (
                  <div className="py-32 text-center flex flex-col items-center">
                    <Search className="w-12 h-12 text-slate-100 mb-4" />
                    <p className="font-black text-slate-300">No records found matching your filters</p>
                  </div>
                )}
            </div>

            <div className="bg-slate-900 rounded-[40px] p-8 text-white flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                     <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black">Volunteer Recruitment Phase</h4>
                    <p className="text-sm text-slate-400 font-bold mt-1">Q2 2024 active campaigns tracking enabled</p>
                  </div>
               </div>
               <button className="bg-[#ED1C24] px-8 py-4 rounded-2xl font-black tracking-widest uppercase text-xs hover:scale-105 transition-all shadow-xl shadow-red-500/20">
                 Run AI Matching
               </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
