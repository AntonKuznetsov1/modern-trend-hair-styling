import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronRight, BookOpen } from 'lucide-react';
import logo from '../assets/logo.png';

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

  useEffect(() => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  }, [location]);

  const toggleMenu = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/#contact' },
  ];

  const isActive = (path) => location.pathname === path && location.hash === '';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-2.5' 
          : 'bg-gradient-to-b from-white/90 via-white/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between gap-4 min-h-[44px]">
        
        {/* Brand Logo with Text */}
        <Link to="/" className="flex items-center gap-3 group z-50 shrink-0">
          <div className="relative flex items-center justify-center p-1.5 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-sm transition-all group-hover:scale-105 group-hover:shadow-md">
            <img 
              src={logo} 
              alt="Modern Trend Hair Styling" 
              className="h-9 sm:h-11 w-auto object-contain filter drop-shadow-sm" 
            />
          </div>
          <div className="flex flex-col justify-center border-l border-slate-200/80 pl-3">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-900 leading-none">
              Hair Styling
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-red-600 mt-1 leading-none">
              Barber & Salon
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200/80 shadow-sm">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
                isActive(link.path)
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Callouts & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4">
            <a 
              href="/blog" 
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 min-h-[44px] whitespace-nowrap"
            >
              <Schedule className="w-4 h-4" />
              Check our Blog
            </a>
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden z-50 p-2.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 shadow-sm hover:bg-slate-50 active:scale-95 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6 text-red-600" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-md pt-24 px-4 sm:px-6 pb-8 flex flex-col justify-between animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 block px-2 mb-1">Navigation</span>
            <nav className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={toggleMenu}
                  className={`flex items-center justify-between p-3.5 rounded-2xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all min-h-[44px] ${
                    isActive(link.path)
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive(link.path) ? 'text-red-500' : 'text-slate-400'}`} />
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link
                to="/blog"
                onClick={toggleMenu}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider py-3.5 sm:py-4 rounded-2xl text-center shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all min-h-[44px]"
              >
                <BookOpen className="w-4 h-4" /> Check Blog
              </Link>
            </div>
          </div>

          <div className="text-center text-xs font-bold text-white/80 uppercase tracking-widest py-2">
            Modern Trend Hair Styling
          </div>
        </div>
      )}
    </header>
  );
}