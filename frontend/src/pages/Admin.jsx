import { useState } from 'react';
import { Calendar, FileText, Clock, Mail, XCircle } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('bookings');

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-zinc-900 text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-zinc-800">Shop Admin</div>
        <nav className="flex flex-col p-4 gap-2">
          <button onClick={() => setActiveTab('bookings')} className={`flex items-center gap-3 p-3 rounded ${activeTab === 'bookings' ? 'bg-blue-600' : 'hover:bg-zinc-800'}`}><Calendar size={20}/> Bookings</button>
          <button onClick={() => setActiveTab('blog')} className={`flex items-center gap-3 p-3 rounded ${activeTab === 'blog' ? 'bg-blue-600' : 'hover:bg-zinc-800'}`}><FileText size={20}/> Blog Posts</button>
          <button onClick={() => setActiveTab('schedule')} className={`flex items-center gap-3 p-3 rounded ${activeTab === 'schedule' ? 'bg-blue-600' : 'hover:bg-zinc-800'}`}><Clock size={20}/> Schedule</button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10">
        
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Manage Bookings</h2>
            <div className="bg-white rounded shadow-sm border p-4 flex justify-between items-center mb-4">
              <div>
                <p className="font-bold text-lg">John Doe</p>
                <p className="text-gray-600">Aug 25, 2026 - 10:30 AM</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200"><Mail size={16}/> Email</button>
                <button className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200"><XCircle size={16}/> Cancel</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Blog Manager</h2>
            <form className="bg-white p-6 rounded shadow-sm border flex flex-col gap-4 max-w-2xl">
              <input type="text" placeholder="Post Title" className="border p-2 rounded outline-none focus:border-blue-500" />
              <textarea rows="5" placeholder="Post Content..." className="border p-2 rounded outline-none focus:border-blue-500"></textarea>
              <button type="button" className="bg-zinc-900 text-white py-2 rounded font-bold w-32 hover:bg-zinc-800">Publish</button>
            </form>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Availability Settings</h2>
            <div className="bg-white p-6 rounded shadow-sm border max-w-xl">
              <p className="mb-4 text-gray-600">Block out dates or modify standard hours.</p>
              <div className="flex gap-4 items-end mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-1">Exception Date</label>
                  <input type="date" className="border p-2 rounded w-full" />
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700">Block Date</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}