import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Scissors, CalendarCheck, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-red-600 selection:text-white">
      
      {/* HERO SECTION */}
      <section className="relative flex flex-col justify-center items-center text-center min-h-[90vh] px-6 py-20 overflow-hidden bg-blue-700">
        {/* Subtle Background Pattern inspired by the awning */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-red-400 font-bold tracking-widest uppercase text-sm mb-4 bg-white/10 px-4 py-1 rounded-full backdrop-blur-md">
            Established & Experienced
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter leading-none">
            Modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Trend</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-blue-100 mb-8 tracking-wide">
            Hair Styling
          </h2>
          <p className="text-lg md:text-xl mb-10 leading-relaxed text-blue-50 max-w-2xl">
            Your premier barbershop for precision men's styling, expert beard trimming, and standard military cuts. Classic techniques meet modern execution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/booking" className="group flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-red-600/20 transition-all duration-300">
              Book Appointment
              <CalendarCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
            <Link to="/blog" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-4 px-8 rounded-full backdrop-blur-sm transition-all duration-300">
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>

      {/* NEW SECTION: SERVICES */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-blue-900 mb-4 tracking-tight">Our Expertise</h2>
          <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Precision Styling", desc: "Expert men's styling tailored to your head shape and personal aesthetic." },
            { title: "Beard Trimming", desc: "Detailed shaping, trimming, and conditioning for a sharp, clean look." },
            { title: "Military Cuts", desc: "Standard, regulation-compliant military fades and buzz cuts done right." }
          ].map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Scissors className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEW SECTION: INFO BANNER */}
      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold mb-2">Everyone is Welcome</h3>
            <p className="text-slate-400">While we specialize in men's styling, ladies' cuts are always welcome.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 px-6 py-4 rounded-xl border border-white/5">
            <ShieldCheck className="text-red-500 w-8 h-8" />
            <div className="text-left">
              <p className="font-bold">Open Mon - Sat</p>
              <p className="text-sm text-slate-400">Walk-ins & Appointments</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-24 px-6 md:px-16 bg-white w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-black text-blue-900 mb-6 tracking-tight">Visit The Shop</h2>
            <p className="text-slate-600 mb-10 text-lg">
              Located right in Fredericton. Drop us a line, book online, or just walk in to get your next great look.
            </p>
            
            <div className="space-y-6">
              <a href="#" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <MapPin className="w-5 h-5"/>
                </div>
                <div>
                  <p className="font-bold text-slate-900">144 Gibson Street</p>
                  <p className="text-slate-500">Fredericton, NB, Canada, E3A 4E2</p>
                </div>
              </a>
              
              <a href="tel:+15064728199" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5"/>
                </div>
                <div>
                  <p className="font-bold text-slate-900">(506) 472-8199</p>
                  <p className="text-slate-500">Call during business hours</p>
                </div>
              </a>

              <a href="mailto:uscdarrell@gmail.com" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5"/>
                </div>
                <div>
                  <p className="font-bold text-slate-900">uscdarrell@gmail.com</p>
                  <p className="text-slate-500">For general inquiries</p>
                </div>
              </a>
            </div>
          </div>
          
          <div className="bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
            <h3 className="text-2xl font-bold mb-6 text-slate-900">Send a Message</h3>
            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full border-slate-200 p-4 rounded-xl bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full border-slate-200 p-4 rounded-xl bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">How can we help?</label>
                <textarea rows="4" placeholder="Your message..." className="w-full border-slate-200 p-4 rounded-xl bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none" required></textarea>
              </div>
              <button type="submit" className="flex items-center justify-center gap-2 bg-blue-700 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-700/30 mt-2">
                Send Message
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}