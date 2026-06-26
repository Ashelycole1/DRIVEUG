import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Star, MapPin, CheckCircle, User, Settings, Droplets, ShieldCheck, ChevronLeft, Calendar, Clock } from 'lucide-react';
import cars from '../data/cars.json';
import { getWhatsAppLink } from '../utils/whatsapp';
import WhatsAppIcon from '../components/WhatsAppIcon';

// ── Lightweight click tracker ─────────────────────────────────────────────────
function trackEvent(eventName, props = {}) {
  try {
    if (!window.__driveugEvents) window.__driveugEvents = [];
    const entry = { event: eventName, ts: new Date().toISOString(), ...props };
    window.__driveugEvents.push(entry);
    console.log('[DriveUG Analytics]', entry);
  } catch { /* silent — analytics must never break the UI */ }
}

// ── Date helpers ──────────────────────────────────────────────────────────────
function today() {
  return new Date().toISOString().split('T')[0];
}

function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function daysBetween(startStr, endStr) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(1, Math.round((new Date(endStr) - new Date(startStr)) / msPerDay));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-UG', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });
}

export default function CarDetail() {
  const { id } = useParams();
  const car = cars.find(c => c.id === id);

  const defaultPickup = addDays(today(), 1);
  const defaultReturn = addDays(today(), 3);

  const [pickupDate, setPickupDate] = useState(defaultPickup);
  const [returnDate, setReturnDate] = useState(defaultReturn);
  const [withDriver, setWithDriver] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  if (!car) return <div className="p-8 text-center text-gray-500 font-medium">Vehicle not found.</div>;

  const days = daysBetween(pickupDate, returnDate);
  const driverFee = (withDriver || car.driver_mode === 'driver_required') && car.driver_fee_ugx ? car.driver_fee_ugx * days : 0;
  const subtotal = (car.daily_price_ugx * days) + driverFee;
  const platformFee = subtotal * 0.10;
  const total = subtotal + platformFee;

  const handlePickupChange = (e) => {
    const newPickup = e.target.value;
    setPickupDate(newPickup);
    if (returnDate <= newPickup) {
      setReturnDate(addDays(newPickup, 1));
    }
  };

  const handleBook = () => {
    trackEvent('request_to_book', {
      car: `${car.make} ${car.model}`,
      pickup: pickupDate,
      return: returnDate,
      days,
      total,
    });
    
    const msg = `Hi DriveUG! I would like to request a booking for the ${car.make} ${car.model}.
- Pickup Date: ${formatDate(pickupDate)}
- Return Date: ${formatDate(returnDate)}
- Duration: ${days} day${days !== 1 ? 's' : ''}
- Chauffeur Service: ${withDriver || car.driver_mode === 'driver_required' ? 'Yes' : 'No'}
- Estimated Total: UGX ${total.toLocaleString()}

Full Name: `;

    window.location.href = getWhatsAppLink(msg);
  };

  const handleMessageOwner = () => {
    trackEvent('message_owner_whatsapp', {
      car: `${car.make} ${car.model}`,
      owner: car.owner.name,
    });
    window.location.href = getWhatsAppLink(
      `Hi DriveUG, I would like to inquire about ${car.owner.name}'s ${car.make} ${car.model} listed on your platform.`
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0">
      {/* Back button */}
      <Link to="/cars" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold mb-6 transition">
        <ChevronLeft className="w-4 h-4" /> Back to browse fleet
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Gallery Frame */}
          <div className="rounded-2xl overflow-hidden h-[300px] md:h-[460px] relative bg-gray-50 dark:bg-[#222] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
            <img 
              key={selectedPhoto}
              src={car.photos[selectedPhoto]} 
              alt={`${car.make} ${car.model}`} 
              className="w-full h-full object-cover transition-opacity duration-300" 
            />
          </div>
          
          {/* Thumbnails Row */}
          {car.photos.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {car.photos.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPhoto(i)}
                  className={`shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 shadow-sm focus:outline-none ${
                    selectedPhoto === i
                      ? 'border-green-500 scale-[1.04] shadow-md'
                      : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={p} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Heading and Specifications */}
          <div className="bg-white dark:bg-[#1a1a1a] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-baseline gap-2">
                  {car.make} {car.model}
                  <span className="text-gray-400 font-semibold text-xl">{car.year}</span>
                </h1>
                <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1 font-medium">
                  <MapPin className="w-4 h-4 text-green-600" /> {car.pickup_location}, Uganda
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-150 dark:border-green-900/50 text-green-700 dark:text-green-500 px-4 py-2 rounded-2xl flex items-center gap-1.5 font-bold text-sm shadow-sm shrink-0">
                <Star className="w-4 h-4 fill-green-600 text-green-600" />
                <span>{car.rating_avg}</span>
                <span className="text-green-400 font-normal">|</span>
                <span className="text-xs font-semibold">{car.trip_count} trips completed</span>
              </div>
            </div>

            {/* Quick Spec Pills */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100 dark:border-gray-800 my-4 text-center">
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50/60 dark:bg-[#222]/60 rounded-2xl border border-gray-100/50 dark:border-gray-800/50">
                <User className="text-gray-500 dark:text-gray-400 w-5 h-5 mb-1" /> 
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Seats</span>
                <span className="font-extrabold text-sm text-gray-900 dark:text-white mt-0.5">{car.seats} Passenger</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50/60 dark:bg-[#222]/60 rounded-2xl border border-gray-100/50 dark:border-gray-800/50">
                <Settings className="text-gray-500 dark:text-gray-400 w-5 h-5 mb-1" /> 
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gearbox</span>
                <span className="font-extrabold text-sm text-gray-900 dark:text-white mt-0.5">{car.transmission}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50/60 dark:bg-[#222]/60 rounded-2xl border border-gray-100/50 dark:border-gray-800/50">
                <Droplets className="text-gray-500 dark:text-gray-400 w-5 h-5 mb-1" /> 
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Engine</span>
                <span className="font-extrabold text-sm text-gray-900 dark:text-white mt-0.5">{car.fuel_type}</span>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Description</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{car.description}</p>
            </div>

            {/* Owner Profile Panel */}
            <div className="bg-[#fff9f0] dark:bg-amber-900/10 border border-orange-100 dark:border-amber-900/30 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                  {car.owner.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span>{car.owner.name}</span>
                    {car.owner.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Partner • Average response: {car.owner.response_time}</p>
                </div>
              </div>
              <button 
                id="btn-message-owner"
                onClick={handleMessageOwner}
                className="w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-2xl font-bold text-xs hover:bg-gray-50 dark:hover:bg-[#333] hover:border-gray-300 shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-green-600" />
                <span>Inquire About Car</span>
              </button>
            </div>
          </div>
        </div>

        {/* Booking Card Column */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#1a1a1a] p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24 space-y-6 transition-colors duration-300">
            <div>
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">UGX {car.daily_price_ugx.toLocaleString()}</span>
              <span className="text-gray-500 dark:text-gray-400 font-semibold text-sm"> / day</span>
            </div>

            <div className="space-y-4">
              {/* Pickup Date Picker */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span>Pickup Date</span>
                </label>
                <input 
                  type="date" 
                  min={today()}
                  value={pickupDate} 
                  onChange={handlePickupChange}
                  className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#222] text-gray-900 dark:text-white rounded-xl p-3 outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:border-green-600 text-sm font-semibold transition-all [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>

              {/* Return Date Picker */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span>Return Date</span>
                </label>
                <input 
                  type="date" 
                  min={addDays(pickupDate, 1)}
                  value={returnDate} 
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#222] text-gray-900 dark:text-white rounded-xl p-3 outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:border-green-600 text-sm font-semibold transition-all [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>

              {/* Total Duration Badge */}
              <div className="bg-green-50/50 border border-green-100 text-green-800 rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-green-600" />
                  <span>Rental Period</span>
                </span>
                <span>{days} Day{days !== 1 ? 's' : ''}</span>
              </div>

              {/* Driver Option Selector */}
              {car.driver_mode !== 'self_drive_only' && (
                <div className="p-4 border border-gray-150 dark:border-gray-800 rounded-2xl bg-gray-50/20 dark:bg-[#222]/20 space-y-2">
                  <label htmlFor="driver" className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      id="driver" 
                      checked={withDriver || car.driver_mode === 'driver_required'} 
                      disabled={car.driver_mode === 'driver_required'}
                      onChange={(e) => setWithDriver(e.target.checked)}
                      className="mt-1 accent-green-600 w-4 h-4 rounded border-gray-300 dark:border-gray-700 focus:ring-green-500"
                    />
                    <div>
                      <span className="font-bold text-sm text-gray-900 dark:text-white block">Add Chauffeur Driver</span>
                      <span className="text-xs text-gray-400 block mt-0.5">
                        {car.driver_mode === 'driver_required' ? 'Required for this class' : `Optional support (+UGX ${car.driver_fee_ugx?.toLocaleString()}/day)`}
                      </span>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Receipt Summary */}
            <div className="space-y-3 pt-4 border-t border-gray-150 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between items-center">
                <span>Daily rate × {days} days</span>
                <span className="font-semibold text-gray-900 dark:text-white">UGX {(car.daily_price_ugx * days).toLocaleString()}</span>
              </div>
              
              {(withDriver || car.driver_mode === 'driver_required') && car.driver_fee_ugx && (
                <div className="flex justify-between items-center text-amber-700 dark:text-amber-500 bg-amber-50/50 dark:bg-amber-900/20 p-2 rounded-xl border border-amber-100/55 dark:border-amber-900/50">
                  <span>Chauffeur driver fee</span>
                  <span className="font-semibold">UGX {driverFee.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="underline decoration-dotted cursor-help text-gray-400">Platform Booking Fee (10%)</span>
                <span className="font-semibold text-gray-900 dark:text-white">UGX {platformFee.toLocaleString()}</span>
              </div>
            </div>

            {/* Total price billing */}
            <div className="flex justify-between items-center font-black text-xl pt-4 border-t border-gray-150 dark:border-gray-800 text-gray-900 dark:text-white">
              <span>Total Price</span>
              <span>UGX {total.toLocaleString()}</span>
            </div>

            {/* CTA Request Action */}
            <button
              id="btn-request-to-book"
              onClick={handleBook}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-4 rounded-full font-bold text-md shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5"
            >
              <WhatsAppIcon className="w-5 h-5 text-white" />
              <span>Book via WhatsApp</span>
            </button>

            {/* Trust Copy */}
            <div className="flex items-start justify-center gap-2 text-xs text-gray-400 font-semibold text-center leading-normal">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <span>Request and date configuration are verified directly with support staff.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
