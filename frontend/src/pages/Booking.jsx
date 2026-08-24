import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Mail, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
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

export default function Booking() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const availableTimes = ['09:00 AM', '10:30 AM', '01:00 PM', '03:00 PM', '04:30 PM'];
  const API_URL = import.meta.env.VITE_API_URL || 'https://modern-trend-hair-styling.onrender.com';

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/bookings`, null, {
        params: { name, email, date, time }
      });
      alert(`Success! Your appointment for ${date} at ${time} is pending confirmation.`);
      setStep(1); setDate(''); setTime(''); setName(''); setEmail('');
    } catch (error) {
      console.error("Booking error:", error);
      alert("There was an issue saving your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-700 selection:text-white flex items-center justify-center py-20 px-6">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
          .font-modern-title { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
          @keyframes slideDown { 0% { transform: translateY(-100%); } 100% { transform: translateY(0); } }
          .animate-strap-fast { animation: slideDown 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-strap-slow { animation: slideDown 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards; transform: translateY(-100%); }
        `}
      </style>

      {/* Background Grid & Decorative Straps */}
      <BackgroundPattern />
      <div className="absolute top-0 right-12 md:right-28 bottom-0 w-24 md:w-36 flex justify-end gap-4 pointer-events-none z-0">
        <div className="w-8 md:w-12 h-full bg-red-600 animate-strap-fast shadow-xl"></div>
        <div className="w-8 md:w-12 h-full bg-blue-700 animate-strap-slow shadow-xl"></div>
      </div>

      <main className="relative z-10 w-full max-w-2xl">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-2xl p-8 md:p-12 overflow-hidden">
          
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2 block">Precision Appointment</span>
            <h1 className="font-modern-title text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
              Schedule <span className="text-blue-700">Service</span>
            </h1>
          </div>

          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
            {[
              { num: 1, label: 'Date' },
              { num: 2, label: 'Time' },
              { num: 3, label: 'Details' }
            ].map(s => (
              <div key={s.num} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num ? 'bg-blue-700 text-white shadow-md scale-110' : step > s.num ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider hidden sm:inline ${step === s.num ? 'text-slate-900' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Select Date */}
          {step === 1 && (
            <div className="space-y-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Choose Preferred Date
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => { setDate(e.target.value); setStep(2); }}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-blue-700 focus:bg-white transition-all cursor-pointer shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Step 2: Select Time */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Available Slots for {date}
                </span>
                <button onClick={() => setStep(1)} className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Change Date
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableTimes.map(t => (
                  <button 
                    key={t}
                    onClick={() => { setTime(t); setStep(3); }}
                    className="p-4 rounded-2xl border border-slate-200 font-bold text-sm text-slate-800 hover:border-blue-700 hover:bg-blue-50/50 hover:text-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                  >
                    <Clock className="w-4 h-4 text-slate-400" />
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Client Details & Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-slate-400">Selected Appointment</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">{date} at {time}</p>
                </div>
                <button onClick={() => setStep(2)} className="text-xs font-bold text-blue-700 hover:underline">
                  Edit
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-700 transition-colors" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-700 transition-colors" 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setStep(2)} 
                  className="flex-1 bg-slate-100 text-slate-700 font-bold py-4 rounded-full hover:bg-slate-200 transition-all text-sm"
                >
                  Back
                </button>
                <button 
                  onClick={handleConfirm} 
                  disabled={!name || !email || isSubmitting} 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm active:scale-95"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}