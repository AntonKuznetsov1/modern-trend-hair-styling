import { useState, useEffect } from 'react';
import { Calendar, FileText, Clock, Mail, XCircle, Send, ShieldAlert, RefreshCw, Upload, Image as ImageIcon, Trash2, Plus, CalendarX, PlusCircle, Ban, Lock, LogOut } from 'lucide-react';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // Blog Form State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [publishing, setPublishing] = useState(false);

  // Availability State
  const [settings, setSettings] = useState({
    default_slots: [],
    blocked_dates: [],
    blocked_times: [],
    custom_slots: []
  });

  const [newDefaultTime, setNewDefaultTime] = useState('');
  const [blockDateInput, setBlockDateInput] = useState('');
  const [blockTimeDate, setBlockTimeDate] = useState('');
  const [blockTimeSlot, setBlockTimeSlot] = useState('');
  const [customSlotDate, setCustomSlotDate] = useState('');
  const [customSlotTime, setCustomSlotTime] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://modern-trend-hair-styling.onrender.com';

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (token === 'admin-session-active') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError('');
    try {
      const res = await axios.post(`${API_URL}/api/admin/login`, { password: passwordInput });
      if (res.data.authenticated) {
        sessionStorage.setItem('admin_token', res.data.token);
        setIsAuthenticated(true);
        setPasswordInput('');
      }
    } catch (err) {
      setAuthError('Incorrect password. Access denied.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, blogsRes, settingsRes] = await Promise.all([
        axios.get(`${API_URL}/api/bookings`),
        axios.get(`${API_URL}/api/blogs`),
        axios.get(`${API_URL}/api/availability/settings`)
      ]);
      setBookings(bookingsRes.data);
      setBlogs(blogsRes.data);
      setSettings(settingsRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePublishBlog = async (e) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogContent.trim()) {
      alert("Please fill in both title and content.");
      return;
    }

    setPublishing(true);
    let imageUrl = null;

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error } = await supabase.storage
          .from('blog-images')
          .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });

        if (error) throw error;

        const { data: publicData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(fileName);

        imageUrl = publicData.publicUrl;
      }

      const res = await axios.post(`${API_URL}/api/blogs`, {
        title: blogTitle,
        content: blogContent,
        image_url: imageUrl
      });

      setBlogs([res.data, ...blogs]);
      setBlogTitle('');
      setBlogContent('');
      setImageFile(null);
      setImagePreview(null);
      alert("Article published successfully!");
    } catch (err) {
      console.error("Error publishing blog post:", err);
      alert("Failed to publish post.");
    } finally {
      setPublishing(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await axios.delete(`${API_URL}/api/blogs/${id}`);
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(id);
    try {
      await axios.delete(`${API_URL}/api/bookings/${id}`);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error("Failed to cancel booking:", err);
    } finally {
      setCancellingId(null);
    }
  };

  const handleAddDefaultSlot = async (e) => {
    e.preventDefault();
    if (!newDefaultTime) return;
    try {
      const res = await axios.post(`${API_URL}/api/availability/default-slots`, { time: newDefaultTime });
      setSettings(prev => ({ ...prev, default_slots: [...prev.default_slots, res.data] }));
      setNewDefaultTime('');
    } catch (err) { console.error(err); }
  };

  const handleDeleteDefaultSlot = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/availability/default-slots/${id}`);
      setSettings(prev => ({ ...prev, default_slots: prev.default_slots.filter(s => s.id !== id) }));
    } catch (err) { console.error(err); }
  };

  const handleBlockDate = async (e) => {
    e.preventDefault();
    if (!blockDateInput) return;
    try {
      const res = await axios.post(`${API_URL}/api/availability/block-date`, { date: blockDateInput });
      setSettings(prev => ({ ...prev, blocked_dates: [...prev.blocked_dates, res.data] }));
      setBlockDateInput('');
    } catch (err) { console.error(err); }
  };

  const handleUnblockDate = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/availability/block-date/${id}`);
      setSettings(prev => ({ ...prev, blocked_dates: prev.blocked_dates.filter(b => b.id !== id) }));
    } catch (err) { console.error(err); }
  };

  const handleBlockTime = async (e) => {
    e.preventDefault();
    if (!blockTimeDate || !blockTimeSlot) return;
    try {
      const res = await axios.post(`${API_URL}/api/availability/block-time`, { date: blockTimeDate, time: blockTimeSlot });
      setSettings(prev => ({ ...prev, blocked_times: [...prev.blocked_times, res.data] }));
      setBlockTimeDate(''); setBlockTimeSlot('');
    } catch (err) { console.error(err); }
  };

  const handleUnblockTime = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/availability/block-time/${id}`);
      setSettings(prev => ({ ...prev, blocked_times: prev.blocked_times.filter(b => b.id !== id) }));
    } catch (err) { console.error(err); }
  };

  const handleAddCustomSlot = async (e) => {
    e.preventDefault();
    if (!customSlotDate || !customSlotTime) return;
    try {
      const res = await axios.post(`${API_URL}/api/availability/custom-slot`, { date: customSlotDate, time: customSlotTime });
      setSettings(prev => ({ ...prev, custom_slots: [...prev.custom_slots, res.data] }));
      setCustomSlotDate(''); setCustomSlotTime('');
    } catch (err) { console.error(err); }
  };

  const handleDeleteCustomSlot = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/availability/custom-slot/${id}`);
      setSettings(prev => ({ ...prev, custom_slots: prev.custom_slots.filter(c => c.id !== id) }));
    } catch (err) { console.error(err); }
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans text-slate-100">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
            .font-modern-title { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
          `}
        </style>

        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-tr from-red-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg font-bold text-xl text-white">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-modern-title text-2xl font-bold tracking-tight text-white mt-4">Admin Authentication</h1>
            <p className="text-xs text-slate-400 font-medium">Enter system access key to access management dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Password</label>
              <input 
                type="password" 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-blue-700 font-medium text-sm transition-colors"
                required
              />
            </div>

            {authError && (
              <p className="text-xs font-bold text-red-400 bg-red-950/40 border border-red-800/50 p-3 rounded-xl text-center">
                {authError}
              </p>
            )}

            <button 
              type="submit" 
              disabled={loggingIn} 
              className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 text-sm"
            >
              {loggingIn ? 'Authenticating...' : 'Unlock Console'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen flex bg-slate-950 font-sans text-slate-100 selection:bg-blue-700 selection:text-white">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
          .font-modern-title { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
        `}
      </style>

      {/* Sidebar */}
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
                    isActive ? 'bg-blue-700 text-white shadow-lg shadow-blue-700/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-red-400 py-3 rounded-xl text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" /> Exit Session
          </button>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>System Operational</span>
            <button onClick={fetchData} title="Refresh Data" className="hover:text-white transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto bg-slate-950">
        
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500">Active Bookings</p>
              <p className="text-3xl font-bold font-modern-title mt-1 text-white">{bookings.length}</p>
            </div>
            <div className="p-3 bg-blue-700/10 text-blue-400 rounded-xl"><Calendar className="w-6 h-6" /></div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500">Published Posts</p>
              <p className="text-3xl font-bold font-modern-title mt-1 text-white">{blogs.length}</p>
            </div>
            <div className="p-3 bg-red-600/10 text-red-400 rounded-xl"><FileText className="w-6 h-6" /></div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500">Default Slots</p>
              <p className="text-3xl font-bold font-modern-title mt-1 text-emerald-400">{settings.default_slots.length}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><Clock className="w-6 h-6" /></div>
          </div>
        </div>

        {/* TAB 1: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-modern-title text-3xl font-bold text-white">Manage Bookings</h2>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-full">
                Realtime Feed ({bookings.length})
              </span>
            </div>

            {loading ? (
              <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 text-center text-slate-400">Loading appointments...</div>
            ) : bookings.length === 0 ? (
              <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 text-center text-slate-500">No active bookings.</div>
            ) : (
              [...bookings]
                .sort((a, b) => b.id - a.id)
                .map((item) => (
                  <div key={item.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition-colors">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-white">{item.name}</span>
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">Confirmed</span>
                      </div>
                      <p className="text-sm font-medium text-slate-400 mt-1">{item.date} • {item.time} ({item.email})</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <a href={`mailto:${item.email}`} className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors">
                        <Mail className="w-4 h-4 text-blue-400" /> Email Client
                      </a>
                      <button onClick={() => handleCancelBooking(item.id)} disabled={cancellingId === item.id} className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50">
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
          <div className="space-y-10 max-w-4xl">
            <div>
              <h2 className="font-modern-title text-3xl font-bold text-white mb-6">Create New Article</h2>
              
              <form onSubmit={handlePublishBlog} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Article Title</label>
                  <input type="text" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} placeholder="e.g. Master Beard Styling" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-700 font-medium" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Cover Image</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-slate-950 border border-slate-800 hover:border-slate-700 px-5 py-3.5 rounded-xl flex items-center gap-2 text-sm font-semibold text-slate-300">
                      <Upload className="w-4 h-4 text-blue-400" /> Choose File
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    <span className="text-xs text-slate-500">{imageFile ? imageFile.name : 'No image selected'}</span>
                  </div>
                  {imagePreview && (
                    <div className="mt-4 relative w-full h-48 rounded-xl overflow-hidden border border-slate-800">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Article Content</label>
                  <textarea rows="6" value={blogContent} onChange={(e) => setBlogContent(e.target.value)} placeholder="Write your editorial content here..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-700 font-medium resize-none"></textarea>
                </div>

                <button type="submit" disabled={publishing} className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                  <Send className="w-4 h-4" /> {publishing ? 'Publishing...' : 'Publish Insight'}
                </button>
              </form>
            </div>

            <div>
              <h3 className="font-modern-title text-xl font-bold text-white mb-4">Published Articles ({blogs.length})</h3>
              <div className="space-y-4">
                {blogs.map(blog => (
                  <div key={blog.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {blog.image_url ? (
                        <img src={blog.image_url} alt={blog.title} className="w-14 h-14 rounded-xl object-cover border border-slate-800" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600"><ImageIcon className="w-6 h-6" /></div>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-base">{blog.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{blog.content}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteBlog(blog.id)} className="p-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-xl border border-red-500/20">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AVAILABILITY SETTINGS */}
        {activeTab === 'schedule' && (
          <div className="space-y-8 max-w-4xl">
            <div>
              <h2 className="font-modern-title text-3xl font-bold text-white mb-2">Schedule & Availability Controls</h2>
              <p className="text-slate-400 text-sm">Configure standard daily hours, ban entire days or specific times, and create custom single-day slots.</p>
            </div>

            {/* SECTION 1: DEFAULT SLOTS */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" /> Default Recurring Slots
              </h3>
              
              <form onSubmit={handleAddDefaultSlot} className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="e.g. 09:00 AM, 02:30 PM" 
                  value={newDefaultTime} 
                  onChange={e => setNewDefaultTime(e.target.value)} 
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-blue-700 text-sm" 
                />
                <button type="submit" className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Default
                </button>
              </form>

              <div className="flex flex-wrap gap-3">
                {settings.default_slots.map(s => (
                  <div key={s.id} className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3 text-sm font-semibold text-slate-200">
                    <span>{s.time}</span>
                    <button onClick={() => handleDeleteDefaultSlot(s.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: BLOCK ENTIRE DATE */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <CalendarX className="w-5 h-5 text-red-400" /> Block Entire Days (Holidays / Days Off)
              </h3>

              <form onSubmit={handleBlockDate} className="flex gap-4">
                <input 
                  type="date" 
                  value={blockDateInput} 
                  onChange={e => setBlockDateInput(e.target.value)} 
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-red-600 text-sm" 
                />
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Ban Date
                </button>
              </form>

              <div className="flex flex-wrap gap-3">
                {settings.blocked_dates.map(b => (
                  <div key={b.id} className="bg-red-950/40 border border-red-800/50 px-4 py-2 rounded-xl flex items-center gap-3 text-sm font-semibold text-red-200">
                    <span>{b.date}</span>
                    <button onClick={() => handleUnblockDate(b.id)} className="text-red-400 hover:text-white transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: BLOCK SPECIFIC TIME ON SPECIFIC DAY */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Ban className="w-5 h-5 text-amber-400" /> Ban Specific Time Slot on Specific Day
              </h3>

              <form onSubmit={handleBlockTime} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input 
                  type="date" 
                  value={blockTimeDate} 
                  onChange={e => setBlockTimeDate(e.target.value)} 
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-amber-500 text-sm" 
                />
                <input 
                  type="text" 
                  placeholder="e.g. 01:00 PM" 
                  value={blockTimeSlot} 
                  onChange={e => setBlockTimeSlot(e.target.value)} 
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-amber-500 text-sm" 
                />
                <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <Ban className="w-4 h-4" /> Block Slot
                </button>
              </form>

              <div className="flex flex-wrap gap-3">
                {settings.blocked_times.map(bt => (
                  <div key={bt.id} className="bg-amber-950/30 border border-amber-800/40 px-4 py-2 rounded-xl flex items-center gap-3 text-sm font-semibold text-amber-200">
                    <span>{bt.date} @ {bt.time}</span>
                    <button onClick={() => handleUnblockTime(bt.id)} className="text-amber-400 hover:text-white transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: SINGLE-DAY CUSTOM EXTRA SLOTS */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" /> Add Custom Slot for Single Day Only
              </h3>

              <form onSubmit={handleAddCustomSlot} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input 
                  type="date" 
                  value={customSlotDate} 
                  onChange={e => setCustomSlotDate(e.target.value)} 
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-emerald-500 text-sm" 
                />
                <input 
                  type="text" 
                  placeholder="e.g. 06:30 PM" 
                  value={customSlotTime} 
                  onChange={e => setCustomSlotTime(e.target.value)} 
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-emerald-500 text-sm" 
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <PlusCircle className="w-4 h-4" /> Add Custom
                </button>
              </form>

              <div className="flex flex-wrap gap-3">
                {settings.custom_slots.map(cs => (
                  <div key={cs.id} className="bg-emerald-950/30 border border-emerald-800/40 px-4 py-2 rounded-xl flex items-center gap-3 text-sm font-semibold text-emerald-200">
                    <span>{cs.date} @ {cs.time}</span>
                    <button onClick={() => handleDeleteCustomSlot(cs.id)} className="text-emerald-400 hover:text-white transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}