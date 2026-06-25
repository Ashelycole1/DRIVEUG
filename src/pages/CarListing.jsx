import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Star, MapPin, ChevronDown, User, Settings, Droplets } from 'lucide-react';
import cars from '../data/cars.json';

export default function CarListing() {
  const [view, setView] = useState('grid'); // 'grid' | 'list'

  return (
    <div className="flex flex-col md:flex-row gap-8 px-4 md:px-0">
      {/* Sidebar Filters (Desktop) */}
      <aside className="hidden md:block w-64 flex-shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
          <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Filter className="w-5 h-5" /> Filters
          </h2>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Price Range</h3>
            <input type="range" className="w-full accent-primary" />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>80k</span>
              <span>1.2M+</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3">Fuel Type</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200">Petrol</button>
              <button className="px-3 py-1.5 bg-primary text-white rounded-full text-sm">Diesel</button>
              <button className="px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200">Hybrid</button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3">Driver Options</h3>
            <label className="flex items-center gap-2 mb-2 text-sm text-gray-700">
              <input type="checkbox" className="accent-primary" /> Self Drive
            </label>
            <label className="flex items-center gap-2 mb-2 text-sm text-gray-700">
              <input type="checkbox" className="accent-primary" /> With Driver
            </label>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">In Stock ({cars.length})</h1>
            <p className="text-gray-500">Available vehicles in Uganda</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg font-medium text-sm w-full sm:w-auto justify-center">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm w-full sm:w-auto justify-center cursor-pointer">
              Recommended <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car, idx) => (
            <CarCard key={car.id} car={car} featured={idx === 0} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CarCard({ car, featured }) {
  return (
    <Link to={`/cars/${car.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group h-full">
      <div className={`h-48 overflow-hidden relative ${featured ? 'bg-accent-green' : 'bg-gray-100'}`}>
        <img src={car.photos[0]} alt={car.model} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition duration-500" />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
          UGX {car.daily_price_ugx.toLocaleString()}/d
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg">{car.make} {car.model}</h3>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {car.rating_avg}
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-4">{car.category.join(' • ').replace(/_/g, ' ')}</p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-gray-500 text-sm">
          <div className="flex items-center gap-1"><User className="w-4 h-4" /> {car.seats}</div>
          <div className="flex items-center gap-1"><Settings className="w-4 h-4" /> {car.transmission.substring(0,4)}</div>
          <div className="flex items-center gap-1"><Droplets className="w-4 h-4" /> {car.fuel_type.substring(0,3)}</div>
        </div>
      </div>
    </Link>
  );
}
