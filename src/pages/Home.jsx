import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star } from 'lucide-react';
import cars from '../data/cars.json';

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const categories = ['Safari 4x4', 'Luxury', 'Business', 'Budget', 'With driver', 'Group/van', 'Wedding'];

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Hero Section */}
      <section className="relative -mt-6 md:-mt-0 rounded-b-3xl md:rounded-3xl overflow-hidden h-[400px]">
        <img 
          src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200" 
          alt="DriveUG Hero" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Hello, Traveller</h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">Search for destinations? Anywhere · Anytime</p>
          
          <div className="bg-white rounded-full p-2 flex items-center w-full max-w-xl shadow-lg">
            <div className="flex-1 flex items-center px-4 gap-2 text-gray-600">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/cars?q=${search}`)}
                placeholder="Where to?" 
                className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-500"
              />
            </div>
            <button 
              onClick={() => navigate(`/cars?q=${search}`)}
              className="bg-primary text-white px-6 py-3 rounded-full hover:bg-gray-800 transition font-medium"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Category Chips */}
      <section className="px-4 md:px-0">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat, i) => (
            <Link key={i} to={`/cars?category=${cat.toLowerCase()}`} className="whitespace-nowrap px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-primary transition">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Vehicles */}
      <section className="px-4 md:px-0">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-2xl font-bold">Popular vehicles</h2>
          <Link to="/cars" className="text-primary font-medium hover:underline text-sm">See all</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      {/* Promo Section */}
      <section className="px-4 md:px-0">
        <div className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-sm">
            <h2 className="text-3xl font-bold mb-2">10% OFF</h2>
            <p className="text-gray-300 mb-6">On your first booking with DriveUG.</p>
            <Link to="/cars" className="inline-block bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
              View Details
            </Link>
          </div>
          <div className="absolute top-0 right-0 bottom-0 w-1/2 opacity-20 bg-[url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center" />
        </div>
      </section>
    </div>
  );
}

function CarCard({ car }) {
  return (
    <Link to={`/cars/${car.id}`} className="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 block group">
      <div className="h-48 overflow-hidden relative">
        <img src={car.photos[0]} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          {car.rating_avg}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{car.make} {car.model}</h3>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {car.pickup_location}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className="font-bold text-lg">UGX {car.daily_price_ugx.toLocaleString()}</span>
            <span className="text-gray-500 text-sm"> / day</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
