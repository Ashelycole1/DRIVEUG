import { useState } from 'react';
import { ShieldCheck, CheckCircle, Calculator, TrendingUp, Briefcase } from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';
import WhatsAppIcon from '../components/WhatsAppIcon';

function trackEvent(eventName, props = {}) {
  try {
    if (!window.__driveugEvents) window.__driveugEvents = [];
    const entry = { event: eventName, ts: new Date().toISOString(), ...props };
    window.__driveugEvents.push(entry);
    console.log('[DriveUG Analytics]', entry);
  } catch { /* silent — analytics must never break the UI */ }
}

export default function ListCar() {
  const [makeModel, setMakeModel] = useState('');
  const [dailyRate, setDailyRate] = useState(150000);

  const estimatedDays = 15;
  const monthlyEarnings = dailyRate * estimatedDays;
  const platformFeePerDay = dailyRate * 0.10;
  const renterDailyPrice = dailyRate + platformFeePerDay;

  const handleListCar = () => {
    trackEvent('message_us_whatsapp', {
      page: 'list-car',
      makeModel: makeModel || 'Not Specified',
      targetRate: dailyRate,
      projectedMonthly: monthlyEarnings,
    });
    const msg = `Hi DriveUG! I would like to list my vehicle on your platform.\n\nVehicle: ${makeModel || 'Not specified'}\nTarget Daily Rate: UGX ${dailyRate.toLocaleString()}\nProjected Monthly Earnings: UGX ${monthlyEarnings.toLocaleString()}\n\nPlease send me the onboarding steps. Thank you.`;
    window.location.href = getWhatsAppLink(msg);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0 py-8 space-y-12">

      {/* ── Page Header ── */}
      <div className="max-w-xl">
        <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-3">Partner Programme</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight mb-3">
          List Your Car &amp; Earn Monthly Revenue
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-normal">
          Turn your idle vehicle into a consistent income stream. Join verified owners earning on Uganda&apos;s premium rental platform.
        </p>
      </div>

      {/* ── 100% Payout Pitch ── */}
      <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl p-5 flex items-start gap-4 transition-colors duration-300">
        <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm mb-1">100% of your listed price goes directly to you</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-relaxed">
            You set your daily rate. Renters pay a separate 10% platform fee on top — it never comes out of your earnings.
          </p>
        </div>
      </div>

      {/* ── Calculator + Output ── */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Left — Inputs */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-6 space-y-6 transition-colors duration-300">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-gray-400" />
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Earnings Calculator</h2>
              <p className="text-xs text-gray-400 font-normal">Estimate your monthly payout</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Make / Model */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Vehicle Make &amp; Model
              </label>
              <input
                type="text"
                placeholder="e.g. Toyota Prado TX (2018)"
                value={makeModel}
                onChange={(e) => setMakeModel(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#222] text-gray-900 dark:text-white rounded-xl p-3 text-sm placeholder-gray-400 outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:border-green-600 transition"
              />
            </div>

            {/* Rate slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Target Daily Rate
                </label>
                <span className="text-sm font-bold text-gray-900 dark:text-white">UGX {dailyRate.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="1000000"
                step="10000"
                value={dailyRate}
                onChange={(e) => setDailyRate(parseInt(e.target.value))}
                className="w-full h-1.5 appearance-none bg-gray-100 dark:bg-gray-800 rounded-full cursor-pointer accent-gray-900 dark:accent-green-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-1.5">
                <span>UGX 50k</span>
                <span>UGX 1.0M</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            id="btn-message-us-whatsapp"
            onClick={handleListCar}
            className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white py-3.5 rounded-xl font-semibold text-sm shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <WhatsAppIcon className="w-4 h-4 text-white" />
            <span>Apply to List Vehicle</span>
          </button>
        </div>

        {/* Right — Earnings Output (matches site card style) */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-6 flex flex-col justify-between gap-6 transition-colors duration-300">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Monthly Payout</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              UGX {monthlyEarnings.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-1 font-normal">Based on {estimatedDays} active rental days / month</p>
          </div>

          <div className="space-y-3 pt-5 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Your daily payout</span>
              <span className="font-semibold text-gray-900 dark:text-gray-200">UGX {dailyRate.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Platform fee (charged to renter)</span>
              <span className="font-semibold text-gray-400">+ UGX {platformFeePerDay.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">Renter sees</span>
              <span className="font-bold text-gray-900 dark:text-white">UGX {renterDailyPrice.toLocaleString()} / day</span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-[#222] border border-gray-100 dark:border-gray-800 rounded-xl p-4 text-xs text-gray-400 leading-relaxed">
            Estimates assume standard Uganda premium fleet utilization. Actual results vary by vehicle specification, condition, and season.
          </div>
        </div>
      </div>

      {/* ── Info Grid ── */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-6 space-y-4 transition-colors duration-300">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Fleet Security &amp; Safety</h3>
          </div>
          <ul className="space-y-3">
            {[
              'Full identity verification — National ID and Driving Permit required for all renters.',
              'Mandatory security deposit collected and processed before every trip.',
              'You control your own calendar availability and rental guidelines.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-6 space-y-4 transition-colors duration-300">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-gray-400 shrink-0" />
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Listing Requirements</h3>
          </div>
          <ul className="space-y-3">
            {[
              'High-resolution photos — at least 4 clear interior and exterior shots.',
              'Valid vehicle registration and proof of logbook ownership.',
              'Comprehensive insurance documentation covering commercial rental use.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
