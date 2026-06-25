import { ShieldCheck, CheckCircle } from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';

export default function ListCar() {
  const handleListCar = () => {
    const msg = `Hi DriveUG! I would like to list my car on your platform. What details do you need?`;
    window.location.href = getWhatsAppLink(msg);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-0 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Earn money renting out your car</h1>
        <p className="text-xl text-gray-500">Join the DriveUG platform today and turn your idle vehicle into extra income.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-amber rounded-full blur-3xl -ml-16 -mb-16 opacity-50" />
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Ready to list?</h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            We are currently onboarding early partners. Message our team directly on WhatsApp to get your car listed today.
          </p>
          <button 
            onClick={handleListCar}
            className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition active:scale-95"
          >
            Message us on WhatsApp
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-green-600" /> Trust & Safety
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              All renters are verified with National ID and Driving Permit.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              We collect and hold a security deposit before every trip.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              You set your own daily pricing and availability.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">What you'll need</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm shrink-0">1</span>
              At least 4 clear photos of the car.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm shrink-0">2</span>
              Copy of the logbook for verification.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm shrink-0">3</span>
              Valid comprehensive insurance.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
