import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, User, MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen pb-20 md:pb-0 flex flex-col">
      {/* Desktop Top Bar */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white shadow-sm z-50">
        <Link to="/" className="text-2xl font-bold tracking-tight">DriveUG</Link>
        <nav className="flex items-center gap-6 font-medium text-gray-600">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <Link to="/cars" className="hover:text-primary transition">Cars</Link>
          <Link to="/list-car" className="hover:text-primary transition">List your car</Link>
        </nav>
        <div className="flex items-center gap-4">
          <User className="w-6 h-6 text-gray-600 cursor-pointer" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto md:px-8 py-6">
        {children}
      </main>

      {/* Mobile Bottom Action Bar */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-6 py-3 flex items-center justify-between z-50">
        <NavItem to="/" icon={<Home />} label="Home" current={location.pathname === '/'} />
        <NavItem to="/cars" icon={<Search />} label="Search" current={location.pathname === '/cars'} />
        <NavItem to="/list-car" icon={<Calendar />} label="Bookings" current={location.pathname === '/list-car'} />
        <NavItem 
          to="#" 
          onClick={(e) => {
            e.preventDefault();
            window.location.href = getWhatsAppLink('Hi DriveUG, I need some assistance.');
          }}
          icon={<MessageCircle />} 
          label="Chat" 
          current={false} 
        />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, current, onClick }) {
  return (
    <Link to={to} onClick={onClick} className={`flex flex-col items-center p-2 rounded-full transition ${current ? 'text-primary' : 'text-gray-400'}`}>
      <div className={`p-1.5 rounded-full ${current ? 'bg-primary text-white' : ''}`}>
        {icon}
      </div>
    </Link>
  );
}
