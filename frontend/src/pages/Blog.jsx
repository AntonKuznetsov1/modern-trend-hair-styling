import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export default function Blog() {
  const mockPosts = [
    { id: 1, title: "The Return of the Mullet", excerpt: "Why the classic 80s style is making a modern comeback.", date: "Aug 15, 2026" },
    { id: 2, title: "Beard Care 101", excerpt: "Essential oils and trims to keep your beard looking sharp.", date: "Aug 10, 2026" }
  ];

  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem('likedPosts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
  }, [likedPosts]);

  const toggleLike = (id) => {
    if (!likedPosts.includes(id)) {
      setLikedPosts([...likedPosts, id]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-10 text-center">Style Insights</h1>
      <div className="grid gap-8">
        {mockPosts.map(post => (
          <article key={post.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
              <p className="text-sm text-gray-500 mb-3">{post.date}</p>
              <p className="text-gray-700">{post.excerpt}</p>
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
    </div>
  );
}