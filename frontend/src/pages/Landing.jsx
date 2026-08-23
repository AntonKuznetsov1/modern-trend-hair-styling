import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

// COMPONENT: Solid, subtle architectural grid
const BackgroundPattern = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-white">
      {/* Crisp, subtle grid lines */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.33) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.33) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '56px 56px'
        }}
      ></div>
    </div>
  );
};

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden font-sans text-slate-900">
      
      {/* Styles for Plus Jakarta Sans (ultra-clean Inter alternative) & animations */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800;900&display=swap');
          
          .font-modern-title {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
          }

          @keyframes slideDown {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(0); }
          }
          .animate-strap-fast {
            animation: slideDown 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-strap-slow {
            animation: slideDown 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
            transform: translateY(-100%);
          }
        `}
      </style>

      {/* Background Grid Component */}
      <BackgroundPattern />

      {/* RIGHT SIDE: Animated Vertical Straps */}
      <div className="absolute top-0 right-8 md:right-32 bottom-0 w-32 md:w-48 flex justify-end gap-4 md:gap-8 pointer-events-none z-0">
        <div className="w-12 md:w-16 h-full bg-red-600 animate-strap-fast shadow-2xl"></div>
        <div className="w-12 md:w-16 h-full bg-blue-700 animate-strap-slow shadow-2xl"></div>
      </div>

      {/* BOTTOM LEFT: Main Page Contents */}
      <div className="absolute inset-0 flex flex-col justify-end items-start p-8 md:p-16 w-full md:w-3/4 lg:w-2/3 z-10">
        
        {/* Typography */}
        <h1 className="font-modern-title text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tighter leading-[0.95] uppercase">
          Modern <span className="text-red-600">Trend</span> <br />
          <span className="text-blue-700">Hair Styling</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-700 mb-10 leading-relaxed max-w-lg font-medium bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-sm">
          Your premier barbershop specializing in men's styling, precision beard trimming, and standard military cuts. Ladies' cuts also welcome. Open Monday through Saturday.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          <Link to="/booking" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg">
            Book Appointment
          </Link>
          <Link to="/blog" className="bg-white/90 backdrop-blur-md border-2 border-slate-200 hover:border-slate-900 text-slate-900 font-bold py-4 px-10 rounded-full transition-all">
            Read Our Blog
          </Link>
        </div>

        {/* Minimalist Contact Info */}
        <div className="flex flex-col sm:flex-row gap-6 text-sm font-bold text-slate-600 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-red-600 transition-colors">
            <MapPin className="w-5 h-5 text-red-600"/> 
            144 Gibson Street, Fredericton, NB
          </a>
          <a href="tel:+15064728199" className="flex items-center gap-2 hover:text-blue-700 transition-colors">
            <Phone className="w-5 h-5 text-blue-700"/> 
            (506) 472-8199
          </a>
          <a href="mailto:uscdarrell@gmail.com" className="flex items-center gap-2 hover:text-slate-900 transition-colors">
            <Mail className="w-5 h-5 text-slate-900"/> 
            uscdarrell@gmail.com
          </a>
        </div>
        
      </div>
    </div>
  );
}