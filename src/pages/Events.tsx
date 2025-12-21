import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type DeviceType = 'ios' | 'android' | 'desktop' | 'unknown';

const Events: React.FC = () => {
  const [device, setDevice] = useState<DeviceType>('unknown');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // App Store URLs - UPDATE THESE WITH YOUR ACTUAL URLs
  const APP_STORE_URLS = {
    ios: 'https://apps.apple.com/app/convoo-dating-app/id123456789',
    android: 'https://play.google.com/store/apps/details?id=com.convoo.app',
  };

  useEffect(() => {
    const detectDevice = (): DeviceType => {
      const userAgent = navigator.userAgent.toLowerCase();

      if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
      if (/android/.test(userAgent)) return 'android';
      if (/mobile/.test(userAgent)) return 'android';
      return 'desktop';
    };

    const detectedDevice = detectDevice();
    setDevice(detectedDevice);

    // Auto-redirect after 3 seconds for mobile devices
    if (detectedDevice === 'ios' || detectedDevice === 'android') {
      const timer = setTimeout(() => {
        setIsRedirecting(true);
        window.location.href = APP_STORE_URLS[detectedDevice];
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDownloadClick = () => {
    if (device === 'ios' || device === 'android') {
      setIsRedirecting(true);
      window.location.href = APP_STORE_URLS[device];
    }
  };

  const handleManualDownload = (deviceType: 'ios' | 'android') => {
    setIsRedirecting(true);
    window.location.href = APP_STORE_URLS[deviceType];
  };

  return (
    <div className="bg-gradient-to-br from-[#121212] via-[#1A1A1A] to-[#121212] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#B83280] via-[#B83280]/10 to-transparent opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B83280]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B83280]/10 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#B83280] rounded-2xl mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <span className="text-3xl font-bold">📱</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get the <span className="text-[#B83280]">Convoo</span> App
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join our community and start matching with amazing people
            </p>
          </div>

          {isRedirecting ? (
            <div className="py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#B83280] mx-auto mb-6"></div>
              <p className="text-xl text-gray-300">Redirecting you to the app store...</p>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              {(device === 'ios' || device === 'android') && (
                <button
                  onClick={handleDownloadClick}
                  className="w-full py-4 px-6 bg-[#B83280] text-white text-xl font-semibold rounded-lg hover:bg-[#9A2B6B] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#B83280]/50 mb-6"
                >
                  Download for {device === 'ios' ? 'iPhone' : 'Android'}
                </button>
              )}

              {device === 'desktop' && (
                <div className="space-y-4">
                  <button
                    onClick={() => handleManualDownload('ios')}
                    className="w-full py-4 px-6 bg-[#B83280] text-white text-xl font-semibold rounded-lg hover:bg-[#9A2B6B] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#B83280]/50 flex items-center justify-center"
                  >
                    <span className="mr-3">🍎</span> Download for iOS
                  </button>
                  <button
                    onClick={() => handleManualDownload('android')}
                    className="w-full py-4 px-6 bg-[#B83280] text-white text-xl font-semibold rounded-lg hover:bg-[#9A2B6B] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#B83280]/50 flex items-center justify-center"
                  >
                    <span className="mr-3">🤖</span> Download for Android
                  </button>
                </div>
              )}

              <p className="text-gray-400 mt-8">
                You'll be redirected automatically in{' '}
                {device === 'desktop' ? 'a moment' : '3 seconds'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <Link to="/" className="text-[#B83280] hover:text-[#9A2B6B] font-semibold">
            ← Back to Home
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            © {new Date().getFullYear()} Convoo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Events;
