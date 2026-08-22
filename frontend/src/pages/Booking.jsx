import { useState } from 'react';
import axios from 'axios';

export default function Booking() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const availableTimes = ['09:00 AM', '10:30 AM', '01:00 PM', '03:00 PM'];
  const API_URL = import.meta.env.VITE_API_URL || 'https://modern-trend-hair-styling.onrender.com';

  const handleConfirm = async () => {
    try {
      // FastAPI expects these as query parameters based on our setup
      await axios.post(`${API_URL}/api/bookings`, null, {
        params: { name, email, date, time }
      });
      alert(`Success! Your appointment for ${date} at ${time} is pending confirmation.`);
      setStep(1); setDate(''); setTime(''); setName(''); setEmail('');
    } catch (error) {
      console.error("Booking error:", error);
      alert("There was an issue saving your booking. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-8 border-red-600">
        <h2 className="text-2xl font-bold mb-6 text-center">Book Your Cut</h2>
        
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <label className="font-semibold text-gray-700">Select Date:</label>
            <input 
              type="date" 
              className="border p-3 rounded outline-none focus:ring-2 focus:ring-blue-500"
              value={date}
              onChange={(e) => { setDate(e.target.value); setStep(2); }}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Available Times for {date}:</span>
              <button onClick={() => setStep(1)} className="text-sm text-blue-600 underline">Change Date</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {availableTimes.map(t => (
                <button 
                  key={t}
                  onClick={() => { setTime(t); setStep(3); }}
                  className="border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50 transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <p className="text-center text-lg">You selected: <br/><span className="text-xl font-bold text-blue-800">{date} at {time}</span></p>
            <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} className="border p-3 rounded outline-none focus:ring-2 focus:ring-blue-500" required />
            <input type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-3 rounded outline-none focus:ring-2 focus:ring-blue-500" required />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(2)} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded font-bold hover:bg-gray-300">Back</button>
              <button onClick={handleConfirm} disabled={!name || !email} className="flex-1 bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 disabled:opacity-50">Confirm</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}