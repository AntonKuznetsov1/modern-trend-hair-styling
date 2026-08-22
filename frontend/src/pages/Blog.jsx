import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import axios from 'axios';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'https://modern-trend-hair-styling.onrender.com';

  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem('likedPosts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
  }, [likedPosts]);

  useEffect(() => {
    // Fetch live blogs from FastAPI
    axios.get(`${API_URL}/api/blogs`)
      .then(res => setPosts(res.data))
      .catch(err => console.error("Error fetching blogs:", err));
  }, []);

  const toggleLike = async (id) => {
    if (!likedPosts.includes(id)) {
      try {
        await axios.post(`${API_URL}/api/blogs/${id}/like`);
        setLikedPosts([...likedPosts, id]);
        // Update local state to reflect the new like count instantly
        setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
      } catch (err) {
        console.error("Error liking post:", err);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-10 text-center">Style Insights</h1>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No blog posts available yet.</p>
      ) : (
        <div className="grid gap-8">
          {posts.map(post => (
            <article key={post.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-700">{post.content}</p>
                <p className="text-sm font-semibold text-blue-600 mt-2">{post.likes} Likes</p>
              </div>
              <button 
                onClick={() => toggleLike(post.id)}
                disabled={likedPosts.includes(post.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${likedPosts.includes(post.id) ? 'bg-red-50 border-red-200 text-red-500 cursor-not-allowed' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                <Heart className={likedPosts.includes(post.id) ? 'fill-current' : ''} size={20} />
                {likedPosts.includes(post.id) ? 'Liked' : 'Like'}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}