import { useState, useEffect } from 'react';
import { 
  FileText, RefreshCw, Upload, Image as ImageIcon, 
  Trash2, Lock, LogOut, Send 
} from 'lucide-react';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Blog Form State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [publishing, setPublishing] = useState(false);

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
      const blogsRes = await axios.get(`${API_URL}/api/blogs`);
      setBlogs(blogsRes.data);
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

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans text-slate-100">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
            .font-modern-title { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
          `}
        </style>

        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-red-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg font-bold text-xl text-white">
              <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h1 className="font-modern-title text-xl sm:text-2xl font-bold tracking-tight text-white mt-4">Admin Authentication</h1>
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 sm:p-4 text-white focus:outline-none focus:border-blue-700 font-medium text-sm transition-colors"
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
              className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3.5 sm:py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 text-sm"
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
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-blue-700 selection:text-white">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
          .font-modern-title { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
        `}
      </style>

      {/* Top Header Navigation Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-blue-700 flex items-center justify-center shadow-lg font-bold text-lg text-white">
              MT
            </div>
            <div>
              <h2 className="font-modern-title font-bold text-slate-100 tracking-tight leading-tight text-base sm:text-lg">Modern Trend</h2>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Admin Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={fetchData} 
              title="Refresh Data" 
              className="p-2.5 text-slate-400 hover:text-white transition-colors rounded-xl bg-slate-950 border border-slate-800"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-red-400 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors min-h-[40px]"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Exit Session</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 sm:p-6 md:p-12 overflow-y-auto bg-slate-950 w-full max-w-7xl mx-auto">
        
        {/* Metric Header */}
        <div className="mb-8 sm:mb-10 max-w-4xl">
          <div className="bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500">Published Posts</p>
              <p className="text-2xl sm:text-3xl font-bold font-modern-title mt-1 text-white">{blogs.length}</p>
            </div>
            <div className="p-3 bg-red-600/10 text-red-400 rounded-xl"><FileText className="w-5 h-5 sm:w-6 sm:h-6" /></div>
          </div>
        </div>

        {/* BLOG MANAGER SECTION */}
        <div className="space-y-8 sm:space-y-10 max-w-4xl">
          <div>
            <h2 className="font-modern-title text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Create New Article</h2>
            
            <form onSubmit={handlePublishBlog} className="bg-slate-900 p-4 sm:p-8 rounded-2xl border border-slate-800 space-y-5 sm:space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Article Title</label>
                <input type="text" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} placeholder="e.g. Master Beard Styling" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 sm:p-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-700 font-medium text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Cover Image</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <label className="cursor-pointer bg-slate-950 border border-slate-800 hover:border-slate-700 px-5 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-slate-300 min-h-[44px]">
                    <Upload className="w-4 h-4 text-blue-400" /> Choose File
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <span className="text-xs text-slate-500 truncate">{imageFile ? imageFile.name : 'No image selected'}</span>
                </div>
                {imagePreview && (
                  <div className="mt-4 relative w-full h-40 sm:h-48 rounded-xl overflow-hidden border border-slate-800">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Article Content</label>
                <textarea rows="6" value={blogContent} onChange={(e) => setBlogContent(e.target.value)} placeholder="Write your editorial content here..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 sm:p-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-700 font-medium text-sm resize-none"></textarea>
              </div>

              <button type="submit" disabled={publishing} className="w-full sm:w-auto bg-blue-700 hover:bg-blue-600 text-white font-bold py-3.5 sm:py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 text-sm min-h-[44px]">
                <Send className="w-4 h-4" /> {publishing ? 'Publishing...' : 'Publish Insight'}
              </button>
            </form>
          </div>

          <div>
            <h3 className="font-modern-title text-lg sm:text-xl font-bold text-white mb-4">Published Articles ({blogs.length})</h3>
            <div className="space-y-3 sm:space-y-4">
              {blogs.map(blog => (
                <div key={blog.id} className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                    {blog.image_url ? (
                      <img src={blog.image_url} alt={blog.title} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-slate-800 flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 flex-shrink-0"><ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                    )}
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white text-sm sm:text-base truncate">{blog.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{blog.content}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteBlog(blog.id)} className="p-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-xl border border-red-500/20 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}