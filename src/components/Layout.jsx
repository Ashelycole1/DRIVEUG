import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, CarFront, Moon, Sun } from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';
import WhatsAppIcon from './WhatsAppIcon';

export default function Layout({ children }) {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  // Initialize dark mode from localStorage or default to light mode
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 flex flex-col bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300">
      {/* Desktop Navigation */}
      <header className="sticky top-0 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-8 py-4 flex items-center justify-between z-50 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black tracking-tight text-gray-900 dark:text-white hover:opacity-90 transition">
            Drive<span className="text-green-600">UG</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600 dark:text-gray-300">
            <Link to="/" className={`hover:text-gray-900 dark:hover:text-white transition ${location.pathname === '/' ? 'text-gray-900 dark:text-white' : ''}`}>Home</Link>
            <Link to="/cars" className={`hover:text-gray-900 dark:hover:text-white transition ${location.pathname === '/cars' ? 'text-gray-900 dark:text-white' : ''}`}>Browse Cars</Link>
            <Link to="/list-car" className={`hover:text-gray-900 dark:hover:text-white transition ${location.pathname === '/list-car' ? 'text-gray-900 dark:text-white' : ''}`}>List Your Car</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a
            href={getWhatsAppLink('Hi DriveUG, I need some assistance.')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full text-sm font-bold shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon className="w-4 h-4 text-white" />
            <span>Support</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        {children}
      </main>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-white dark:bg-[#111] border-t border-gray-100 dark:border-gray-800 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-gray-900 dark:text-white text-lg">Drive<span className="text-green-600">UG</span></span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span>Premium Car Rentals Uganda</span>
          </div>
          <div>
            <span>© 2026 DriveUG. All rights reserved.</span>
          </div>
          <div>
            <a
              href={getWhatsAppLink('Hi DriveUG, I have an enquiry.')}
              className="flex items-center gap-2 px-4 py-2 border border-green-200 hover:border-green-400 bg-green-50/50 hover:bg-green-50 text-green-700 font-semibold rounded-full transition-all duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span>Contact WhatsApp Support</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Mobile Footer Area (pre-nav spacing) */}
      <div className="md:hidden mt-8 py-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111] flex flex-col items-center gap-3 text-xs text-gray-400 dark:text-gray-500 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800 dark:text-gray-200">DriveUG</span>
          <span>© 2026</span>
        </div>
        <a
          href={getWhatsAppLink('Hi DriveUG, I have an enquiry.')}
          className="flex items-center gap-1.5 text-green-600 font-semibold"
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon className="w-3.5 h-3.5" />
          <span>WhatsApp Assistance</span>
        </a>
      </div>

      {/* Mobile Bottom Action Bar */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/95 dark:bg-[#111]/95 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-gray-100/50 dark:border-gray-800/50 px-6 py-2 flex items-center justify-between z-50 transition-colors duration-300">
        <NavItem to="/" icon={<Home className="w-5 h-5" />} label="Home" current={location.pathname === '/'} />
        <NavItem to="/cars" icon={<Search className="w-5 h-5" />} label="Browse" current={location.pathname === '/cars'} />
        <NavItem to="/list-car" icon={<CarFront className="w-5 h-5" />} label="Earn" current={location.pathname === '/list-car'} />
        <NavItem 
          to="#" 
          onClick={(e) => {
            e.preventDefault();
            window.location.href = getWhatsAppLink('Hi DriveUG, I need some assistance.');
          }}
          icon={<WhatsAppIcon className="w-5 h-5 text-[#25D366]" />} 
          label="Chat" 
          current={false} 
        />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label, current, onClick }) {
  return (
    <Link 
      to={to} 
      onClick={onClick} 
      className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-300 ${current ? 'text-green-600 font-medium' : 'text-gray-400 dark:text-gray-500'}`}
    >
      <div className="transition-transform duration-300 scale-100 hover:scale-110">
        {icon}
      </div>
      <span className="text-[10px] mt-0.5 font-medium tracking-wide">{label}</span>
    </Link>
  );
}
