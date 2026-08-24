import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Scissors, Clock, Send, ShieldCheck } from 'lucide-react';

// COMPONENT: Solid architectural grid[cite: 2]
const BackgroundPattern = () => {
  return (
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
};

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-700 selection:text-white">
      
      {/* Dynamic Font & Animation Styles[cite: 2] */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
          
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

      {/* Hero Section Container */}
      <div className="relative min-h-screen overflow-hidden flex flex-col justify-end">
        <BackgroundPattern />

        {/* RIGHT SIDE: Animated Vertical Straps[cite: 2] */}
        <div className="absolute top-0 right-8 md:right-32 bottom-0 w-32 md:w-48 flex justify-end gap-4 md:gap-8 pointer-events-none z-0">
          <div className="w-12 md:w-16 h-full bg-red-600 animate-strap-fast shadow-2xl"></div>
          <div className="w-12 md:w-16 h-full bg-blue-700 animate-strap-slow shadow-2xl"></div>
        </div>

        {/* BOTTOM LEFT: Main Hero Contents[cite: 2] */}
        <div className="relative z-10 p-8 md:p-16 w-full md:w-3/4 lg:w-2/3 pt-24 pb-16">
          <h1 className="font-modern-title text-6xl sm:text-7xl md:text-8xl font-medium mb-5 tracking-semibold leading-[0.95]">
            Modern <span className="text-red-600">Trend</span> <br />
            <span className="text-blue-700">Hair Styling</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-700 mb-10 leading-relaxed max-w-lg font-medium bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-sm">
            Delivering distinguished grooming services with a focus on custom men's styling, sharp beard maintenance, and traditional military standards. Comprehensive cuts available for all clients.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-12">
            <Link to="/booking" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg">
              Book Appointment
            </Link>
            <a href="#services" className="bg-white/90 backdrop-blur-md border-2 border-slate-200 hover:border-slate-900 text-slate-900 font-bold py-4 px-10 rounded-full transition-all">
              Explore Services
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 text-sm font-bold text-slate-600 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-200/80 shadow-sm w-fit">
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-red-600 transition-colors">
              <MapPin className="w-5 h-5 text-red-600"/> 
              144 Gibson Street, Fredericton, NB
            </a>
            <a href="tel:+15064728199" className="flex items-center gap-2 hover:text-blue-700 transition-colors">
              <Phone className="w-5 h-5 text-blue-700"/> 
              (506) 472-8199
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: SERVICES OVERVIEW */}
      <section id="services" className="relative z-10 py-24 px-8 md:px-16 border-t border-slate-200/80 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2 block">Craftsmanship</span>
              <h2 className="font-modern-title text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Our Specialties</h2>
            </div>
            <p className="text-slate-600 max-w-md font-medium">Precision cutting tailored to individual facial features, lifestyle preferences, and professional standards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Custom Men's Styling", desc: "Tailored haircutting, texturizing, and modern finishing designed to fit your unique aesthetic.", border: "border-blue-700" },
              { title: "Beard Maintenance", desc: "Detailed shaping, sharp razor edging, and conditioning treatments for clean facial hair.", border: "border-red-600" },
              { title: "Military & Classic Cuts", desc: "Strict regulation-compliant fades, flat tops, and classic low-maintenance haircuts.", border: "border-slate-900" }
            ].map((service, idx) => (
              <div key={idx} className={`bg-white p-8 rounded-2xl border-l-4 ${service.border} border-y border-r border-slate-200/80 shadow-sm hover:shadow-md transition-all`}>
                <Scissors className="w-8 h-8 text-slate-800 mb-6" />
                <h3 className="font-modern-title text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm font-medium">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: SHOP HIGHLIGHTS */}
      <section className="relative z-10 py-20 px-8 md:px-16 border-t border-slate-200/80 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-blue-700 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Monday – Saturday</h4>
              <p className="text-sm text-slate-600">Walk-ins welcome & scheduled appointments available during standard hours.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-red-600 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Welcoming Environment</h4>
              <p className="text-sm text-slate-600">While focusing heavily on men's grooming, ladies' haircuts are always welcome.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-slate-900 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Fredericton Location</h4>
              <p className="text-sm text-slate-600">Conveniently situated on 144 Gibson Street with easy local parking access.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SEPARATE CONTACT SECTION */}
      <section id="contact" className="relative z-10 py-24 px-8 md:px-16 border-t border-slate-200/80 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2 block">Reach Out</span>
            <h2 className="font-modern-title text-4xl md:text-5xl font-bold mb-6 tracking-tight">Get In Touch</h2>
            <p className="text-slate-400 mb-10 text-lg leading-relaxed">
              Have a question about services or need to plan your visit? Contact us directly or send a message using the form.
            </p>

            <div className="space-y-6 text-slate-300">
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 hover:text-white transition-colors">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Address</p>
                  <p className="font-semibold text-white">144 Gibson Street, Fredericton, NB, E3A 4E2</p>
                </div>
              </a>

              <a href="tel:+15064728199" className="flex items-center gap-4 hover:text-white transition-colors">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Phone</p>
                  <p className="font-semibold text-white">(506) 472-8199</p>
                </div>
              </a>

              <a href="mailto:uscdarrell@gmail.com" className="flex items-center gap-4 hover:text-white transition-colors">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="font-semibold text-white">uscdarrell@gmail.com</p>
                </div>
              </a>
            </div>
          </div>

          <form id="contact" onSubmit={(e) => e.preventDefault()} className="bg-white/5 p-8 md:p-10 rounded-3xl border border-white/10 flex flex-col gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
              <input type="text" placeholder="Your name" className="w-full bg-white/10 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" required />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
              <input type="email" placeholder="name@example.com" className="w-full bg-white/10 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" required />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Message</label>
              <textarea rows="4" placeholder="How can we help you?" className="w-full bg-white/10 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none" required></textarea>
            </div>

            <button type="submit" className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98">
              Send Message
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </section>
    </div>
  );
}