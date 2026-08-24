import { Link } from 'react-router-dom';
import { Scissors, MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 text-white font-sans border-t border-slate-800 overflow-hidden">
      
      {/* Decorative Red/Blue Bottom Accent Bars */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="w-1/2 bg-red-600"></div>
        <div className="w-1/2 bg-blue-700"></div>
      </div>

      <div className="max-w-7xl mx-auto px-8 md:px-16 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-slate-900 flex items-center justify-center shadow-md">
                <Scissors className="w-5 h-5 text-red-600 transform -rotate-45" />
              </div>
              <h3 className="font-modern-title font-bold text-xl tracking-tight text-white">
                Modern <span className="text-red-500">Trend</span>
              </h3>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Fredericton's destination for modern men's cuts, traditional military regulation styling, and precision beard grooming.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Mon – Sat | Walk-Ins Welcome
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-modern-title text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Navigation</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Book Appointment <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Style Insights & Blog
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-slate-400 transition-colors text-xs text-slate-500 pt-2 block">
                  Barber Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Direct Contact */}
          <div>
            <h4 className="font-modern-title text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-300">
              <li>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="flex items-start gap-3 hover:text-white transition-colors group">
                  <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>144 Gibson Street<br />Fredericton, NB E3A 4E2</span>
                </a>
              </li>
              <li>
                <a href="tel:+15064728199" className="flex items-center gap-3 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                  <span>(506) 472-8199</span>
                </a>
              </li>
              <li>
                <a href="mailto:uscdarrell@gmail.com" className="flex items-center gap-3 hover:text-white transition-colors">
                  <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>uscdarrell@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Location Callout */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block mb-1">Location</span>
              <h5 className="font-bold text-white text-base mb-2">Visit the Shop</h5>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Located right on Gibson Street with straightforward parking access.
              </p>
            </div>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noreferrer"
              className="mt-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
            >
              Get Directions <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
          <p>© Modern Trend Hair Styling. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
}