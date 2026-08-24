import { useState, useEffect } from 'react';
import { Calendar, FileText, Clock, Mail, XCircle, Send, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://modern-trend-hair-styling.onrender.com';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, blogsRes] = await Promise.all([
        axios.get(`${API_URL}/api/bookings`),
        axios.get(`${API_URL}/api/blogs`)
      ]);
      setBookings(bookingsRes.data);
      setBlogs(blogsRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(id);
    try {
      await axios.delete(`${API_URL}/api/bookings/${id}`);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      alert("Error deleting booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans text-slate-100 selection:bg-blue-700 selection:text-white">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
          .font-modern-title { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
        `}
      </style>

      {/* Dark Modern Sidebar Navigation */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-blue-700 flex items-center justify-center shadow-lg font-bold text-lg">
              MT
            </div>
            <div>
              <h2 className="font-modern-title font-bold text-slate-100 tracking-tight leading-tight">Modern Trend</h2>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Admin Console</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'blog', label: 'Blog Manager', icon: FileText },
              { id: 'schedule', label: 'Availability', icon: Clock }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)} 
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                    isActive 
                      ? 'bg-blue-700 text-white shadow-lg shadow-blue-700/30' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 font-medium flex items-center justify-between">
          <span>System Operational</span>
          <button onClick={fetchData} title="Refresh Data" className="hover:text-white transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </aside>

      {/* Main Content Dashboard */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto bg-slate-950">
        
        {/* Dynamic Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500">Active Bookings</p>
              <p className="text-3xl font-bold font-modern-title mt-1 text-white">{bookings.length}</p>
            </div>
            <div className="p-3 bg-blue-700/10 text-blue-400 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500">Published Posts</p>
              <p className="text-3xl font-bold font-modern-title mt-1 text-white">{blogs.length}</p>
            </div>
            <div className="p-3 bg-red-600/10 text-red-400 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500">Shop Status</p>
              <p className="text-3xl font-bold font-modern-title mt-1 text-emerald-400">Open</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* TAB 1: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-modern-title text-3xl font-bold text-white">Manage Bookings</h2>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-full">
                Realtime Feed ({bookings.length})
              </span>
            </div>

            {loading ? (
              <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 text-center text-slate-400 font-medium">
                Loading appointments...
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 text-center text-slate-500 font-medium">
                No active bookings recorded yet.
              </div>
            ) : (
              bookings.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-white">{item.name}</span>
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">
                        Confirmed
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-400 mt-1">
                      {item.date} • {item.time} ({item.email})
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <a 
                      href={`mailto:${item.email}`}
                      className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
                    >
                      <Mail className="w-4 h-4 text-blue-400" /> Email Client
                    </a>
                    <button 
                      onClick={() => handleCancelBooking(item.id)}
                      disabled={cancellingId === item.id}
                      className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> {cancellingId === item.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: BLOG MANAGER */}
        {activeTab === 'blog' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="font-modern-title text-3xl font-bold text-white mb-6">Create New Article</h2>
            
            <form className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Article Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Master Beard Styling in 5 Steps" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-700 font-medium transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Article Content</label>
                <textarea 
                  rows="6" 
                  placeholder="Write your editorial content here..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-700 font-medium transition-colors resize-none"
                ></textarea>
              </div>

              <button 
                type="button" 
                className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-2 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" /> Publish Insight
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: AVAILABILITY & SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="font-modern-title text-3xl font-bold text-white mb-6">Availability Settings</h2>
            
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-6">
              <p className="text-slate-400 text-sm font-medium">Block specific dates for holidays or staff training.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Exception Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-blue-700 font-medium" 
                  />
                </div>
                <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Block Date
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}