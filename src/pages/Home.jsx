import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, ArrowRight, ShieldCheck, Clock, Users } from 'lucide-react';
import cars from '../data/cars.json';

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  
  const categories = [
    { label: 'Safari 4x4', key: 'safari_4x4' },
    { label: 'Luxury', key: 'luxury' },
    { label: 'Business', key: 'business' },
    { label: 'Budget', key: 'budget' },
    { label: 'Group / Van', key: 'group_van' },
    { label: 'Wedding', key: 'wedding' },
  ];

  const trustPoints = [
    { icon: ShieldCheck, label: 'ID Verified Renters' },
    { icon: Clock, label: 'Fast Response' },
    { icon: Users, label: 'Vetted Owners' },
  ];

  return (
    <div className="flex flex-col gap-10 pb-16">

      {/* ── Hero ── */}
      <section className="relative -mt-8 rounded-b-3xl md:rounded-3xl overflow-hidden h-[420px] shadow-md">
        <img 
          src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1400" 
          alt="DriveUG Premium Car Rental Uganda" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/65" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <p className="text-green-400 font-semibold text-[11px] uppercase tracking-[0.2em] mb-4">
            Uganda&apos;s Premium Car Rental Platform
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-3 max-w-xl">
            Find the Perfect Car<br />
            <span className="text-white/70 font-light">for Every Journey</span>
          </h1>
          <p className="text-sm text-gray-300 mb-8 font-normal max-w-sm leading-relaxed">
            Verified owners · Transparent pricing · Safari 4x4s, luxury sedans &amp; executive vans.
          </p>
          
          {/* Search bar */}
          <div className="bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm rounded-2xl p-2 flex items-center w-full max-w-xl shadow-2xl gap-2 transition-colors duration-300">
            <div className="flex-1 flex items-center px-3 gap-2.5">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/cars?q=${search}`)}
                placeholder="Search by make, model or city…" 
                className="w-full bg-transparent outline-none text-gray-800 dark:text-white text-sm placeholder-gray-400 font-normal"
              />
            </div>
            <button 
              onClick={() => navigate(`/cars?q=${search}`)}
              className="bg-gray-900 dark:bg-green-600 hover:bg-gray-800 dark:hover:bg-green-500 text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold text-sm active:scale-95 shrink-0"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap px-4 md:px-0">
        {trustPoints.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-gray-500 text-xs font-medium">
            <Icon className="w-4 h-4 text-green-500" />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Category Chips — centered ── */}
      <section className="px-4 md:px-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3 text-center">
          Browse by class
        </p>
        <div className="flex flex-wrap gap-2.5 justify-center">
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              to={`/cars?category=${cat.key}`} 
              className="px-5 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 hover:border-gray-500 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-[#222] rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white shadow-sm transition-all duration-200"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Fleet — full-width grid ── */}
      <section className="px-4 md:px-0">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Featured Fleet</h2>
            <p className="text-gray-400 text-xs mt-0.5">Highly rated vehicles available now</p>
          </div>
          <Link 
            to="/cars" 
            className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition"
          >
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2-row grid, 3 columns — all 6 cars fill it evenly */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      {/* ── Trust Banner ── */}
      <section className="px-4 md:px-0">
        <div className="bg-gray-900 rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch">
          <div className="flex-1 p-8 md:p-10 flex flex-col justify-center gap-4">
            <span className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit">
              Verified Platform
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug max-w-xs">
              Rent with Confidence. Every Time.
            </h2>
            <p className="text-gray-400 text-sm font-normal leading-relaxed max-w-sm">
              Every renter is ID-verified. Security deposits are held before release. You&apos;re always covered.
            </p>
            <Link 
              to="/cars" 
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all duration-200 active:scale-95 w-fit"
            >
              Explore Fleet <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="hidden md:block w-72 shrink-0 relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=600"
              alt="Premium 4x4"
              className="absolute inset-0 w-full h-full object-cover opacity-25"
            />
          </div>
        </div>
      </section>

    </div>
  );
}

function CarCard({ car }) {
  return (
    <Link 
      to={`/cars/${car.id}`} 
      className="bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 flex flex-col group"
    >
      {/* Image */}
      <div className="h-44 overflow-hidden relative bg-gray-50 dark:bg-[#222]">
        <img 
          src={car.photos[0]} 
          alt={`${car.make} ${car.model}`} 
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" 
        />
        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#111]/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-transparent dark:border-gray-700">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">{car.rating_avg}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">
            {car.make} {car.model}
          </h3>
          <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-gray-300 dark:text-gray-600" />
            {car.pickup_location}
          </p>
        </div>

        <div className="flex items-baseline justify-between pt-3 border-t border-gray-100 dark:border-gray-800 mt-auto">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Daily rate</span>
          <div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">UGX {car.daily_price_ugx.toLocaleString()}</span>
            <span className="text-gray-400 text-[11px]"> / day</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
