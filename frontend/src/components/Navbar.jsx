import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scissors, Menu, X, Phone, Calendar } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/#contact' },
    { name: 'Admin', path: '/admin' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
        scrolled 
          ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-3' 
          : 'bg-white/50 backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-md">
            <Scissors className="w-5 h-5 text-red-500 transform -rotate-45" />
          </div>
          <span className="font-modern-title font-extrabold text-xl md:text-2xl tracking-tight text-slate-900">
            Modern <span className="text-red-600">Trend</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200/80 shadow-sm">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
                isActive(link.path)
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Button & Phone */}
        <div className="hidden lg:flex items-center gap-4">
          <a 
            href="tel:+15064728199" 
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-700 transition-colors px-3 py-2"
          >
            <Phone className="w-4 h-4 text-blue-700" />
            (506) 472-8199
          </a>
          <Link
            to="/booking"
            className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Book Now
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2.5 rounded-xl bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`p-3 rounded-xl text-sm font-bold tracking-wider uppercase transition-colors ${
                  isActive(link.path)
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <a 
              href="tel:+15064728199" 
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 font-bold text-xs text-slate-800"
            >
              <Phone className="w-4 h-4 text-blue-700" /> Call (506) 472-8199
            </a>
            <Link
              to="/booking"
              className="bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl text-center shadow-md flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Book Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}