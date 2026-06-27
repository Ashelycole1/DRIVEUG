import { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if the app is already installed / running in standalone mode
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(isStandaloneMode);

    if (isStandaloneMode) {
      return; // Already installed, don't show prompt
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // If it's iOS and not standalone, we can show a custom instruction prompt
    if (isIOSDevice) {
      // Small delay so it doesn't instantly pop up
      setTimeout(() => setShowPrompt(true), 3000);
    }

    // Handle Android / Chrome PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowPrompt(false);
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-gray-800 z-[100] transition-all animate-in slide-in-from-bottom-5">
      <button 
        onClick={handleClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex gap-4 items-start pr-6">
        <div className="w-12 h-12 bg-gray-100 dark:bg-[#222] rounded-xl flex items-center justify-center shrink-0">
          <img src="/pwa-192x192.png" alt="DriveUG App Icon" className="w-8 h-8 object-contain drop-shadow-sm" />
        </div>
        
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Install DriveUG App</h3>
          
          {isIOS ? (
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
              <p>Install our app for a faster, better experience.</p>
              <p className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                Tap <Share className="w-4 h-4 text-blue-500" /> then <PlusSquare className="w-4 h-4" /> Add to Home Screen
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Install our app for a faster, better experience.
              </p>
              <button 
                onClick={handleInstallClick}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Install Now</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
