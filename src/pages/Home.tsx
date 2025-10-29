import { useState, useEffect, useRef } from 'react';
import { WaitlistForm } from '../components/WaitlistForm';
import { BetaForm } from '../components/BetaForm';
import { EventsModal } from '../components/EventsModal';
import styles from '../App.module.css';
import { Link } from 'react-router-dom';
import { AppStoreButtons } from '../components/AppStoreButtons';

const Home = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showBetaForm, setShowBetaForm] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);
  const howItWorksSectionRef = useRef(null);
  const howItWorksHeadingRef = useRef(null);
  const howItWorksContentRef = useRef(null);
  const teaserBoxRef = useRef(null);
  const joinSectionRef = useRef(null);
  const joinHeadingRef = useRef(null);
  const joinContentRef = useRef(null);
  const joinButtonRef = useRef(null);
  const scrolling = useRef(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    // Use more sensitive options for headings to ensure they're detected earlier
    const headingObserverOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // Trigger slightly before the element enters the viewport
      threshold: 0.01,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.sectionVisible);
        }
      });
    }, observerOptions);

    const contentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains(styles.staggered)) {
            entry.target.classList.add(styles.staggeredVisible);
          } else if (entry.target.classList.contains(styles.teaserBox)) {
            entry.target.classList.add(styles.teaserBoxVisible);
          } else {
            entry.target.classList.add(styles.fadeInVisible);
          }
        }
      });
    }, observerOptions);
    
    // Separate observer for headings with more sensitive detection
    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.sectionHeadingVisible);
        }
      });
    }, headingObserverOptions);

    // Observe sections
    if (howItWorksSectionRef.current) {
      (howItWorksSectionRef.current as any).classList.add(styles.sectionEnter);
      sectionObserver.observe(howItWorksSectionRef.current as any);
    }

    if (joinSectionRef.current) {
      (joinSectionRef.current as any).classList.add(styles.sectionEnter);
      sectionObserver.observe(joinSectionRef.current as any);
    }

    // Observe content elementsw
    if (howItWorksHeadingRef.current) {
      headingObserver.observe(howItWorksHeadingRef.current);
    }

    if (howItWorksContentRef.current) {
      contentObserver.observe(howItWorksContentRef.current);
    }
    
    if (teaserBoxRef.current) {
      contentObserver.observe(teaserBoxRef.current);
    }

    if (joinHeadingRef.current) {
      headingObserver.observe(joinHeadingRef.current);
    }

    if (joinContentRef.current) {
      contentObserver.observe(joinContentRef.current);
    }

    if (joinButtonRef.current) {
      contentObserver.observe(joinButtonRef.current);
    }

    // Handle wheel events for smoother scrolling
    const handleWheel = (e: WheelEvent) => {
      if (scrolling.current) return;
      
      const sections = document.querySelectorAll('.scroll-section');
      const currentSection = Array.from(sections).findIndex(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      });
      
      if (currentSection !== -1) {
        e.preventDefault();
        scrolling.current = true;
        
        const nextSection = e.deltaY > 0 
          ? Math.min(currentSection + 1, sections.length - 1)
          : Math.max(currentSection - 1, 0);
          
        if (nextSection !== currentSection) {
          sections[nextSection].scrollIntoView({ behavior: 'smooth' });
          
          // Reset scrolling lock after animation completes
          setTimeout(() => {
            scrolling.current = false;
          }, 1000);
        } else {
          scrolling.current = false;
        }
      }
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      sectionObserver.disconnect();
      contentObserver.disconnect();
      headingObserver.disconnect();
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      scrolling.current = true;
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Reset scrolling lock after animation completes
      setTimeout(() => {
        scrolling.current = false;
      }, 1000);
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col justify-between relative overflow-hidden">
      <div 
       className="absolute inset-0 bg-center bg-no-repeat opacity-40"
       style={{ 
         backgroundImage: 'url(/assets/1.png)', 
         backgroundPosition: 'center 30%',
         backgroundSize: 'cover'
       }}
      ></div>
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="absolute top-6 right-6 z-20">
        <button 
        onClick={() => setShowEventsModal(true)}
        className="px-4 py-2 text-white font-medium opacity-60 hover:opacity-80 transition-opacity duration-300">
          Events
        </button>
      </div>
      
      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-4 relative z-10">
          <h1 className={styles.thinHeading}>
            Convoo<span className={styles.dots}>
              <span className={styles.firstDot}>.</span>
              <span className={styles.secondDot}>.</span>
            </span>
          </h1>
          <p className="font-inter-regular text-2xl text-[#aaaaaa] max-w-lg mx-auto mb-4">
            Everybody needs somebody.
          </p>
          <p className="font-inter-regular text-1xl italic text-[#8b8b8b] max-w-lg mx-auto mb-4 pt-2">
            Find yours through real conversation.
          </p>
          
          <AppStoreButtons onAndroidClick={() => setShowWaitlist(true)} />
        </div>
      </div>
      
      {/* Footer Content */}
      <div className="w-full py-8 text-center relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-[#aaaaaa] text-sm">
            <Link to="/terms" className="text-[#B83280] hover:underline mx-2 font-bold">Terms of Service</Link>
            <span className="mx-1">|</span>
            <Link to="/privacy" className="text-[#B83280] hover:underline mx-2 font-bold">Privacy Policy</Link>
            <span className="mx-1">|</span>
            <Link to="/support" className="text-[#B83280] hover:underline mx-2 font-bold">Support</Link>
            <span className="mx-1">|</span>
            <Link to="/business" className="text-[#B83280] hover:underline mx-2 font-bold">Be a Matchmaker</Link>
          </div>
          <div className="text-[#666666] text-xs mt-2">
            &copy; {new Date().getFullYear()} Convoo. All rights reserved.
          </div>
        </div>
      </div>
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

      <EventsModal 
        isOpen={showEventsModal} 
        onClose={() => setShowEventsModal(false)} 
      />    
    </>
  );
};

export default Home;