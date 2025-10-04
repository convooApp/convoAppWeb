import { useState } from 'react';
import { Clock, EyeOff, Heart, MessageCircle, Zap, Shield } from 'lucide-react';
import { WaitlistForm } from '../components/WaitlistForm';
import { BetaForm } from '../components/BetaForm';
import styles from '../App.module.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showBetaForm, setShowBetaForm] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-[#121212] text-white">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className={styles.thinHeading}>
            Convoo<span className={styles.dots}>
              <span className={styles.firstDot}>.</span>
              <span className={styles.secondDot}>.</span>
            </span>
          </h1>
          <p className="font-inter text-2xl text-[#aaaaaa] max-w-2xl mx-auto mb-8">
            The dating app that puts conversation first
          </p>
          <p className="font-inter text-lg text-white/80 max-w-3xl mx-auto mb-12">
            Tired of endless swiping and superficial matches? Convoo flips dating upside down. 
            Talk first, see faces later, and discover real connections.
          </p>
          
          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
            <a 
              href="https://apps.apple.com/app/convoo" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.button} ${styles.primaryButton} flex items-center justify-center gap-3 text-lg px-8 py-4`}
            >
              <span>📱 Download for iOS</span>
            </a>
            <a 
              href="https://play.google.com/store/apps/details?id=com.convoo.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.button} ${styles.secondaryButton} flex items-center justify-center gap-3 text-lg px-8 py-4`}
            >
              <span>🤖 Download for Android</span>
            </a>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-poppins text-4xl md:text-5xl font-light text-center mb-4 text-white">
            What Makes Us Different
          </h2>
          <p className="text-center text-[#aaaaaa] text-xl mb-16 max-w-3xl mx-auto">
            We're not just another dating app. We're revolutionizing how people connect.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Conversation First */}
            <div className="bg-gradient-to-br from-[#B83280]/20 to-[#B83280]/5 p-8 rounded-2xl border border-[#B83280]/20 hover:border-[#B83280]/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-[#B83280]/20 rounded-full mb-6 mx-auto">
                <MessageCircle size={32} color="#B83280" />
              </div>
              <h3 className="font-nunito text-2xl font-bold text-[#B83280] mb-4 text-center">Talk First, See Later</h3>
              <p className="text-white/90 text-center mb-4 font-semibold">No photos until you connect</p>
              <p className="text-white/70 text-center">
                Start with a 3-minute blind conversation. If you both feel the spark, then you see each other. 
                Chemistry comes before looks.
              </p>
            </div>

            {/* Daily Events */}
            <div className="bg-gradient-to-br from-[#B83280]/20 to-[#B83280]/5 p-8 rounded-2xl border border-[#B83280]/20 hover:border-[#B83280]/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-[#B83280]/20 rounded-full mb-6 mx-auto">
                <Clock size={32} color="#B83280" />
              </div>
              <h3 className="font-nunito text-2xl font-bold text-[#B83280] mb-4 text-center">Daily Matching Events</h3>
              <p className="text-white/90 text-center mb-4 font-semibold">Show up at the right time</p>
              <p className="text-white/70 text-center">
                No endless scrolling. Join daily events at specific times. One person, one conversation, 
                one chance to connect.
              </p>
            </div>

            {/* No Swiping */}
            <div className="bg-gradient-to-br from-[#B83280]/20 to-[#B83280]/5 p-8 rounded-2xl border border-[#B83280]/20 hover:border-[#B83280]/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-[#B83280]/20 rounded-full mb-6 mx-auto">
                <EyeOff size={32} color="#B83280" />
              </div>
              <h3 className="font-nunito text-2xl font-bold text-[#B83280] mb-4 text-center">Zero Swiping</h3>
              <p className="text-white/90 text-center mb-4 font-semibold">No more dating fatigue</p>
              <p className="text-white/70 text-center">
                Forget the endless parade of faces. We match you with one person at a time based on 
                compatibility, not just looks.
              </p>
            </div>

            {/* Mutual Choice */}
            <div className="bg-gradient-to-br from-[#B83280]/20 to-[#B83280]/5 p-8 rounded-2xl border border-[#B83280]/20 hover:border-[#B83280]/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-[#B83280]/20 rounded-full mb-6 mx-auto">
                <Heart size={32} color="#B83280" />
              </div>
              <h3 className="font-nunito text-2xl font-bold text-[#B83280] mb-4 text-center">Double Opt-In</h3>
              <p className="text-white/90 text-center mb-4 font-semibold">Both must choose to continue</p>
              <p className="text-white/70 text-center">
                After your conversation, you both decide if you want to see each other and continue. 
                No awkward rejections.
              </p>
            </div>

            {/* Real-Time Connection */}
            <div className="bg-gradient-to-br from-[#B83280]/20 to-[#B83280]/5 p-8 rounded-2xl border border-[#B83280]/20 hover:border-[#B83280]/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-[#B83280]/20 rounded-full mb-6 mx-auto">
                <Zap size={32} color="#B83280" />
              </div>
              <h3 className="font-nunito text-2xl font-bold text-[#B83280] mb-4 text-center">Live Connections</h3>
              <p className="text-white/90 text-center mb-4 font-semibold">Real-time, authentic moments</p>
              <p className="text-white/70 text-center">
                No ghosting, no delayed responses. When you match, you talk immediately. 
                Authentic connections happen in real-time.
              </p>
            </div>

            {/* Safe & Respectful */}
            <div className="bg-gradient-to-br from-[#B83280]/20 to-[#B83280]/5 p-8 rounded-2xl border border-[#B83280]/20 hover:border-[#B83280]/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-[#B83280]/20 rounded-full mb-6 mx-auto">
                <Shield size={32} color="#B83280" />
              </div>
              <h3 className="font-nunito text-2xl font-bold text-[#B83280] mb-4 text-center">Safe Environment</h3>
              <p className="text-white/90 text-center mb-4 font-semibold">Respectful conversations only</p>
              <p className="text-white/70 text-center">
                Built-in safety features and community guidelines ensure every conversation is 
                respectful and meaningful.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works - Simplified */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-poppins text-4xl md:text-5xl font-light text-center mb-16 text-white">
            How It Works
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#B83280] rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="font-nunito text-xl font-bold text-white mb-2">Join Daily Event</h3>
              <p className="text-white/70">Show up at the right time</p>
            </div>
            
            <div className="hidden md:block w-16 h-0.5 bg-[#B83280]/30"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#B83280] rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="font-nunito text-xl font-bold text-white mb-2">Talk Blind</h3>
              <p className="text-white/70">3-minute conversation</p>
            </div>
            
            <div className="hidden md:block w-16 h-0.5 bg-[#B83280]/30"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#B83280] rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="font-nunito text-xl font-bold text-white mb-2">Decide Together</h3>
              <p className="text-white/70">Both choose to continue</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="font-poppins text-4xl md:text-5xl font-light mb-6 text-white">
            Ready for Real Connections?
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Join thousands who've discovered that the best relationships start with conversation.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
            <a 
              href="https://apps.apple.com/app/convoo" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.button} ${styles.primaryButton} flex items-center justify-center gap-3 text-lg px-8 py-4`}
            >
              <span>📱 Download for iOS</span>
            </a>
            <a 
              href="https://play.google.com/store/apps/details?id=com.convoo.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.button} ${styles.secondaryButton} flex items-center justify-center gap-3 text-lg px-8 py-4`}
            >
              <span>🤖 Download for Android</span>
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-center mb-16">
            <div>
              <div className="text-3xl font-bold text-[#B83280] mb-2">50K+</div>
              <div className="text-white/70">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#B83280] mb-2">4.8★</div>
              <div className="text-white/70">App Store Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#B83280] mb-2">12 min</div>
              <div className="text-white/70">Avg. Conversation</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="text-[#aaaaaa] text-sm mb-4">
              <Link to="/terms" className="text-[#B83280] hover:underline mx-2">Terms of Service</Link>
              <span className="mx-1">|</span>
              <Link to="/privacy" className="text-[#B83280] hover:underline mx-2">Privacy Policy</Link>
              <span className="mx-1">|</span>
              <Link to="/support" className="text-[#B83280] hover:underline mx-2">Support</Link>  
            </div>
            <div className="text-[#666666] text-xs">
              &copy; {new Date().getFullYear()} Convoo. All rights reserved.
            </div>
          </div>
        </footer>
      </div>

      {showWaitlist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <WaitlistForm onClose={() => setShowWaitlist(false)} />
          </div>
        </div>
      )}
      {showBetaForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <BetaForm onClose={() => setShowBetaForm(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;