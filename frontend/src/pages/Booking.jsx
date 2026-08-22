import { useState } from 'react';

export default function Booking() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  
  // Mock available times based on a date selection
  const availableTimes = ['09:00 AM', '10:30 AM', '01:00 PM', '03:00 PM'];

  const handleConfirm = () => {
    // Phase 4: Connect to FastAPI endpoint here
    console.log(`Booking confirmed for ${date} at ${time}. Confirmation email triggered.`);
    alert(`Success! Your appointment for ${date} at ${time} is pending confirmation.`);
    setStep(1); setDate(''); setTime('');
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
          <div className="flex flex-col gap-4 text-center">
            <p className="text-lg">You selected:</p>
            <p className="text-xl font-bold text-blue-800">{date} at {time}</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(2)} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded font-bold hover:bg-gray-300">Back</button>
              <button onClick={handleConfirm} className="flex-1 bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700">Confirm Booking</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}