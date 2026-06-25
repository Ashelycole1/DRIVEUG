import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Star, MapPin, CheckCircle, User, Settings, Droplets, ShieldCheck, ChevronLeft } from 'lucide-react';
import cars from '../data/cars.json';
import { getWhatsAppLink } from '../utils/whatsapp';

export default function CarDetail() {
  const { id } = useParams();
  const car = cars.find(c => c.id === id);
  const [days, setDays] = useState(1);
  const [withDriver, setWithDriver] = useState(false);

  if (!car) return <div className="p-8 text-center">Car not found.</div>;

  const driverFee = withDriver && car.driver_fee_ugx ? car.driver_fee_ugx * days : 0;
  const subtotal = (car.daily_price_ugx * days) + driverFee;
  
  // Platform fee is 10%
  const platformFee = subtotal * 0.10;
  const total = subtotal + platformFee;

  const handleBook = () => {
    const msg = `Hi DriveUG! I'd like to book the ${car.make} ${car.model} for ${days} days. \nTotal estimate: UGX ${total.toLocaleString()}.\nWith Driver: ${withDriver ? 'Yes' : 'No'}.\nMy name is: `;
    window.location.href = getWhatsAppLink(msg);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0">
      <Link to="/cars" className="inline-flex items-center gap-1 text-gray-500 hover:text-primary mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to cars
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <div className="rounded-2xl overflow-hidden h-[300px] md:h-[450px] relative bg-gray-100">
            <img src={car.photos[0]} alt={car.model} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {car.photos.map((p, i) => (
              <img key={i} src={p} alt="" className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover cursor-pointer border border-gray-200 hover:border-primary" />
            ))}
          </div>

          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{car.make} {car.model} <span className="text-gray-400 font-medium">{car.year}</span></h1>
                <p className="text-gray-500 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {car.pickup_location}
                </p>
              </div>
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full flex items-center gap-1 font-semibold text-sm">
                <Star className="w-4 h-4 fill-green-700" /> {car.rating_avg} ({car.trip_count} trips)
              </div>
            </div>

            {/* Quick Specs */}
            <div className="flex flex-wrap gap-4 py-6 border-y border-gray-100 my-6">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                <User className="text-gray-500 w-5 h-5" /> 
                <span className="font-medium">{car.seats} Seats</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                <Settings className="text-gray-500 w-5 h-5" /> 
                <span className="font-medium">{car.transmission}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                <Droplets className="text-gray-500 w-5 h-5" /> 
                <span className="font-medium">{car.fuel_type}</span>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed mb-8">{car.description}</p>

            {/* Owner Profile */}
            <div className="bg-accent-amber p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {car.owner.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold flex items-center gap-1">
                    {car.owner.name}
                    {car.owner.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </h3>
                  <p className="text-sm text-gray-600">Typically replies in {car.owner.response_time}</p>
                </div>
              </div>
              <button 
                onClick={() => window.location.href = getWhatsAppLink(`Hi DriveUG, I have a question about ${car.owner.name}'s ${car.make} ${car.model}.`)}
                className="px-4 py-2 bg-white rounded-full font-medium text-sm hover:bg-gray-50 shadow-sm"
              >
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 sticky top-24">
            <div className="mb-6">
              <span className="text-3xl font-bold">UGX {car.daily_price_ugx.toLocaleString()}</span>
              <span className="text-gray-500 font-medium"> / day</span>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Duration (Days)</label>
                <input 
                  type="number" 
                  min="1" 
                  value={days} 
                  onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-primary"
                />
              </div>

              {car.driver_mode !== 'self_drive_only' && (
                <div className="p-3 border border-gray-200 rounded-lg flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="driver" 
                    checked={withDriver || car.driver_mode === 'driver_required'} 
                    disabled={car.driver_mode === 'driver_required'}
                    onChange={(e) => setWithDriver(e.target.checked)}
                    className="mt-1 accent-primary w-4 h-4"
                  />
                  <div>
                    <label htmlFor="driver" className="font-semibold block cursor-pointer">
                      Add a driver
                    </label>
                    <p className="text-sm text-gray-500">
                      {car.driver_mode === 'driver_required' ? 'Required for this vehicle' : `Optional (+UGX ${car.driver_fee_ugx?.toLocaleString()}/day)`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 pt-4 border-t border-gray-100 text-gray-600">
              <div className="flex justify-between">
                <span>UGX {car.daily_price_ugx.toLocaleString()} x {days} days</span>
                <span>UGX {(car.daily_price_ugx * days).toLocaleString()}</span>
              </div>
              {withDriver && car.driver_fee_ugx && (
                <div className="flex justify-between">
                  <span>Driver fee</span>
                  <span>UGX {driverFee.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="flex items-center gap-1 underline decoration-dotted cursor-pointer">
                  Platform fee (10%)
                </span>
                <span>UGX {platformFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center font-bold text-xl mb-6 pt-4 border-t border-gray-100">
              <span>Total</span>
              <span>UGX {total.toLocaleString()}</span>
            </div>

            <button onClick={handleBook} className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition active:scale-95 flex items-center justify-center gap-2">
              Request to book
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-green-600" /> Secure via WhatsApp (Phase 0)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
