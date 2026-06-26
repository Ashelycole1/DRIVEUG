import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Star, MapPin, User, Settings, Droplets, X, Search } from 'lucide-react';
import cars from '../data/cars.json';

export default function CarListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQ = searchParams.get('q') || '';
  const searchCat = searchParams.get('category') || '';

  // Local filter states
  const [searchQuery, setSearchQuery] = useState(searchQ);
  const [selectedCategory, setSelectedCategory] = useState(searchCat);
  const [fuelType, setFuelType] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1200000);
  const [driverMode, setDriverMode] = useState({
    selfDrive: false,
    withDriver: false,
  });

  // Keep state in sync with query params if they change
  useEffect(() => {
    setSearchQuery(searchQ);
    setSelectedCategory(searchCat);
  }, [searchQ, searchCat]);

  // Categories mapping for UI
  const categoriesList = [
    { id: 'safari_4x4', name: 'Safari 4x4' },
    { id: 'luxury', name: 'Luxury' },
    { id: 'business', name: 'Business' },
    { id: 'budget', name: 'Budget' },
    { id: 'group_van', name: 'Group / Van' },
    { id: 'wedding', name: 'Wedding' },
  ];

  // Filtering logic
  const filteredCars = cars.filter((car) => {
    // 1. Search Query Match
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const makeModel = `${car.make} ${car.model}`.toLowerCase();
      const location = car.pickup_location.toLowerCase();
      const desc = car.description.toLowerCase();
      if (!makeModel.includes(query) && !location.includes(query) && !desc.includes(query)) {
        return false;
      }
    }

    // 2. Category Match
    if (selectedCategory) {
      // Check if the car's categories array contains the selected category
      if (!car.category.includes(selectedCategory.toLowerCase())) {
        return false;
      }
    }

    // 3. Fuel Type Match
    if (fuelType !== 'All') {
      if (car.fuel_type.toLowerCase() !== fuelType.toLowerCase()) {
        return false;
      }
    }

    // 4. Max Price Match
    if (car.daily_price_ugx > maxPrice) {
      return false;
    }

    // 5. Driver Mode Match
    // If selfDrive is checked, the car must support self drive
    if (driverMode.selfDrive) {
      if (car.driver_mode === 'driver_required') return false;
    }
    // If withDriver is checked, the car must support a driver
    if (driverMode.withDriver) {
      if (car.driver_mode === 'self_drive_only') return false;
    }

    return true;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setFuelType('All');
    setMaxPrice(1200000);
    setDriverMode({ selfDrive: false, withDriver: false });
    setSearchParams({});
  };

  return (
    <div className="flex flex-col gap-6 px-4 md:px-0">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Available Fleet</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Explore and filter premium rental cars in Uganda</p>
        </div>

        {/* Top Search Input */}
        <div className="relative max-w-md w-full">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by make, model or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 sticky top-24 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-green-600" /> Filters
              </h2>
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-gray-500 hover:text-green-600 transition"
              >
                Reset All
              </button>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Max Daily Rate</span>
                <span className="font-bold text-green-600">UGX {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="80000"
                max="1200000"
                step="20000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-green-600 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-medium text-gray-400">
                <span>UGX 80,000</span>
                <span>UGX 1,200,000+</span>
              </div>
            </div>

            {/* Fuel Type */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Fuel Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {['All', 'Petrol', 'Diesel'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFuelType(type)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border transition ${
                      fuelType === type
                        ? 'bg-gray-900 dark:bg-green-600 border-gray-900 dark:border-green-600 text-white shadow-sm'
                        : 'bg-white dark:bg-[#222] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Type (Category) */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Vehicle Class</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition ${
                    !selectedCategory
                      ? 'bg-green-600 border-green-600 text-white shadow-sm'
                      : 'bg-gray-50 dark:bg-[#222] border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  All Types
                </button>
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition ${
                      selectedCategory === cat.id
                        ? 'bg-green-600 border-green-600 text-white shadow-sm'
                        : 'bg-gray-50 dark:bg-[#222] border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Driver Options */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Driver Options</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  <input
                    type="checkbox"
                    checked={driverMode.selfDrive}
                    onChange={(e) =>
                      setDriverMode((prev) => ({ ...prev, selfDrive: e.target.checked }))
                    }
                    className="accent-green-600 rounded w-4 h-4 border-gray-300 focus:ring-green-500"
                  />
                  <span>Self Drive Available</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  <input
                    type="checkbox"
                    checked={driverMode.withDriver}
                    onChange={(e) =>
                      setDriverMode((prev) => ({ ...prev, withDriver: e.target.checked }))
                    }
                    className="accent-green-600 rounded w-4 h-4 border-gray-300 focus:ring-green-500"
                  />
                  <span>Chauffeur Service</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Cars Fleet Section */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between text-sm text-gray-500 font-medium">
            <span>Showing {filteredCars.length} vehicles</span>
          </div>

          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-12 border border-gray-100 dark:border-gray-800 text-center max-w-xl mx-auto space-y-4 shadow-sm mt-8 transition-colors duration-300">
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">No vehicles match your criteria</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Try loosening your filters, adjusting the pricing range, or searching for other keywords.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-gray-900 dark:bg-green-600 hover:bg-gray-800 dark:hover:bg-green-500 text-white rounded-full text-sm font-semibold transition"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CarCard({ car }) {
  return (
    <Link
      to={`/cars/${car.id}`}
      className="bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col group hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300"
    >
      {/* Image */}
      <div className="h-44 overflow-hidden relative bg-gray-50 dark:bg-[#222]">
        <img
          src={car.photos[0]}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#111]/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-transparent dark:border-gray-700">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">{car.rating_avg}</span>
        </div>
        <div className="absolute bottom-3 left-3 bg-black/55 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5 text-green-400" />
          <span className="text-[10px] font-medium text-white">{car.pickup_location}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3">
        {/* Title row */}
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">
              {car.make} {car.model}
            </h3>
            <span className="text-[11px] text-gray-400 shrink-0">{car.year}</span>
          </div>
          <p className="text-gray-400 text-[11px] mt-0.5 capitalize">
            {car.category.join(' · ').replace(/_/g, ' ')}
          </p>
        </div>

        {/* Driver badge — compact */}
        {car.driver_mode === 'driver_required' && (
          <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-lg px-3 py-1.5">
            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-500">Chauffeur included</span>
            <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-400">+UGX {car.driver_fee_ugx?.toLocaleString()}/d</span>
          </div>
        )}
        {car.driver_mode === 'driver_available' && (
          <div className="flex items-center justify-between bg-gray-50 dark:bg-[#222] border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-1.5">
            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">Chauffeur optional</span>
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-500">+UGX {car.driver_fee_ugx?.toLocaleString()}/d</span>
          </div>
        )}
        {car.driver_mode === 'self_drive_only' && (
          <div className="bg-gray-50 dark:bg-[#222] border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-1.5">
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Self Drive Only</span>
          </div>
        )}

        {/* Specs row */}
        <div className="flex items-center justify-between text-gray-400 text-[11px] pt-1 border-t border-gray-100 dark:border-gray-800">
          <span className="flex items-center gap-1"><User className="w-3 h-3" />{car.seats} seats</span>
          <span className="flex items-center gap-1"><Settings className="w-3 h-3" />{car.transmission}</span>
          <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{car.fuel_type}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline justify-between pt-1 border-t border-gray-100 dark:border-gray-800">
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
