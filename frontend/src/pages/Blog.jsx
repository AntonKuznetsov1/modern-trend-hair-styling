import { useState, useEffect } from 'react';
import { Heart, Search, Sparkles, MessageSquare, Tag } from 'lucide-react';
import axios from 'axios';

const BackgroundPattern = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-white">
    <div 
      className="absolute inset-0" 
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(148, 163, 184, 0.28) 1.5px, transparent 1.5px),
          linear-gradient(to bottom, rgba(148, 163, 184, 0.28) 1.5px, transparent 1.5px)
        `,
        backgroundSize: '56px 56px'
      }}
    ></div>
  </div>
);

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'https://modern-trend-hair-styling.onrender.com';

  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem('likedPosts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
  }, [likedPosts]);

  useEffect(() => {
    axios.get(`${API_URL}/api/blogs`)
      .then(res => setPosts(res.data))
      .catch(err => console.error("Error fetching blogs:", err));
  }, [API_URL]);

  const toggleLike = async (id) => {
    if (!likedPosts.includes(id)) {
      try {
        await axios.post(`${API_URL}/api/blogs/${id}/like`);
        setLikedPosts([...likedPosts, id]);
        setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
      } catch (err) {
        console.error("Error liking post:", err);
      }
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-700 selection:text-white">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
          .font-modern-title { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
          @keyframes slideDown { 0% { transform: translateY(-100%); } 100% { transform: translateY(0); } }
          .animate-strap-fast { animation: slideDown 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-strap-slow { animation: slideDown 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards; transform: translateY(-100%); }
        `}
      </style>

      {/* Decorative Top Accent Straps */}
      <div className="absolute top-0 right-8 md:right-24 h-64 w-32 md:w-48 flex justify-end gap-4 pointer-events-none z-0">
        <div className="w-10 md:w-14 h-full bg-red-600 animate-strap-fast shadow-xl opacity-90"></div>
        <div className="w-10 md:w-14 h-full bg-blue-700 animate-strap-slow shadow-xl opacity-90"></div>
      </div>

      <BackgroundPattern />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2 block">Journal & Grooming Tips</span>
          <h1 className="font-modern-title text-5xl md:text-7xl font-medium tracking-tight mb-6">
            Style <span className="text-blue-700 font-bold">Insights</span>
          </h1>
          <p className="text-slate-600 text-lg font-medium leading-relaxed bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            Expert hair care advice, beard maintenance guides, and traditional styling standards direct from our master barbers.
          </p>
        </div>

        {/* Filter and Control Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search articles & guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-700 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 px-2">
            <Tag className="w-4 h-4 text-red-600" /> Total Articles: {filteredPosts.length}
          </div>
        </div>

        {/* Post Grid Layout */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-24 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-sm">
            <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold text-lg">No matching insights found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post, idx) => {
              const isLiked = likedPosts.includes(post.id);
              return (
                <article 
                  key={post.id} 
                  className={`group relative bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                    idx % 2 === 0 ? 'border-t-4 border-t-red-600' : 'border-t-4 border-t-blue-700'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                        Article #{post.id}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <MessageSquare className="w-4 h-4" /> Barber's Desk
                      </div>
                    </div>

                    <h2 className="font-modern-title text-2xl md:text-3xl font-bold mb-4 text-slate-900 group-hover:text-blue-700 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 font-medium leading-relaxed mb-8">
                      {post.content}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">
                      {post.likes} <span className="text-slate-500 font-normal">Appreciations</span>
                    </span>

                    <button 
                      onClick={() => toggleLike(post.id)}
                      disabled={isLiked}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                        isLiked 
                          ? 'bg-red-50 text-red-600 border border-red-200 cursor-not-allowed' 
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-95'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-red-600' : ''}`} />
                      {isLiked ? 'Saved' : 'Like Post'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}