import { useState, useEffect, useRef } from 'react';
import { Clock, EyeOff, UserSearch, ChevronDown, Heart } from 'lucide-react';
import { WaitlistForm } from '../components/WaitlistForm';
import { BetaForm } from '../components/BetaForm';
import { Link } from 'react-router-dom';
import styles from '../App.module.css';

const Home = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showBetaForm, setShowBetaForm] = useState(false);
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
          } else if (entry.target.classList.contains(styles.sectionHeading)) {
            entry.target.classList.add(styles.sectionHeadingVisible);
          } else if (entry.target.classList.contains(styles.teaserBox)) {
            entry.target.classList.add(styles.teaserBoxVisible);
          } else {
            entry.target.classList.add(styles.fadeInVisible);
          }
        }
      });
    }, observerOptions);

    // Observe sections
    if (howItWorksSectionRef.current) {
      (howItWorksSectionRef.current as any).classList.add(styles.sectionEnter);
      sectionObserver.observe(howItWorksSectionRef.current as any);
    }

    if (joinSectionRef.current) {
      (joinSectionRef.current as any).classList.add(styles.sectionEnter);
      sectionObserver.observe(joinSectionRef.current as any);
    }

    // Observe content elements
    if (howItWorksHeadingRef.current) {
      contentObserver.observe(howItWorksHeadingRef.current);
    }

    if (howItWorksContentRef.current) {
      contentObserver.observe(howItWorksContentRef.current);
    }

    if (teaserBoxRef.current) {
      contentObserver.observe(teaserBoxRef.current);
    }

    if (joinHeadingRef.current) {
      contentObserver.observe(joinHeadingRef.current);
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
      <section id="home" className="scroll-section h-screen bg-[#121212] flex items-center justify-center relative">
        <div className="text-center px-4">
          <h1 className={styles.thinHeading}>
            Convoo<span className={styles.dots}>
              <span className={styles.firstDot}>.</span>
              <span className={styles.secondDot}>.</span>
            </span>
          </h1>
          <p className="font-inter-regular text-1xl text-[#aaaaaa] max-w-lg mx-auto mb-8">
            Its not a Dating App, Its a Connection App.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 mt-8 sm:mt-12">
            <button
              onClick={() => setShowWaitlist(true)}
              className={`${styles.button} ${styles.primaryButton} w-full max-w-[200px] sm:w-auto`}
            >
              Join Waitlist
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`${styles.button} ${styles.secondaryButton} w-full max-w-[200px] sm:w-auto`}
            >
              Learn More
            </button>
          </div>
          <p className="text-[#aaaaaa] text-sm italic pt-6">Want early access? <span className="text-[#B83280] cursor-pointer hover:underline" onClick={() => setShowBetaForm(true)}>Sign up as a beta tester</span></p>
          <div className={styles.scrollDown} onClick={() => scrollToSection('how-it-works')}>
            <span>Scroll Down</span>
            <ChevronDown size={24} />
          </div>
        </div>
      </section>  

      <section 
        id="how-it-works" 
        ref={howItWorksSectionRef}
        className={`${styles.section} scroll-section min-h-screen bg-[#FFFFFF] flex items-center justify-center py-16 md:py-20`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <h2 ref={howItWorksHeadingRef} className={`${styles.sectionHeading} text-center mb-10 md:mb-16`}>How It Works</h2>
          <div 
            ref={howItWorksContentRef} 
            className={`${styles.staggered} grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto`}
          >
            {/* Card 1 - Secret Daily Drops */}
            <div className={`${styles.howItWorksCard} ${styles.cardSecret}`}>
              <div className={styles.howItWorksIcon}>
                <Clock size={36} color="#B83280"/>
              </div>
              <h3 className="font-nunito text-xl md:text-2xl font-bold mb-3 text-gray-800 relative z-1">Secret Daily Drops</h3>
              <p className="font-inter text-gray-600 relative z-1">Come back at just the right time — connections open when the stars align. Only those who show up know what's inside.</p>
            </div>
            
            {/* Card 2 - Blind Chats First */}
            <div className={`${styles.howItWorksCard} ${styles.cardBlind}`}>
              <div className={styles.howItWorksIcon}>
                <EyeOff size={36} color="#B83280"/>
              </div>
              <h3 className="font-nunito text-xl md:text-2xl font-bold mb-3 text-gray-800 relative z-1">Blind Chats First</h3>
              <p className="font-inter text-gray-600 relative z-1">You'll talk first. Faces later. We're flipping dating upside down.</p>
            </div>
            
            {/* Card 3 - Double Opt-In */}
            <div className={`${styles.howItWorksCard} ${styles.cardOptIn}`}>
              <div className={styles.howItWorksIcon}>
                <Heart size={36} color="#B83280"/>
              </div>
              <h3 className="font-nunito text-xl md:text-2xl font-bold mb-3 text-gray-800 relative z-1">Double Opt-In</h3>
              <p className="font-inter text-gray-600 relative z-1">When it feels right, you both decide. If not, the moment disappears.</p>
            </div>
          </div>
          
          <div ref={teaserBoxRef} className={`${styles.teaserBox} ${styles.fadeIn} mt-12 md:mt-16 p-6 md:p-8 max-w-4xl mx-auto text-center`}>
            
            <h3 className="text-center font-nunito text-2xl font-bold text-[#B83280] mb-4">Want In?</h3>
            <p className="text-center font-inter text-gray-700 mb-6">
              We're testing this with a small group. Want to be among the first to experience it?
            </p>
            <div className="text-center">
              <button
                onClick={() => setShowWaitlist(true)}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                Join the Waitlist
              </button>
            </div>
            <p className="text-center font-inter text-gray-500 text-sm mt-4">
              No previews. No filters. Just real connection.
            </p>
          </div>
        </div>
      </section>

      <section id="why-convoo" className="scroll-section min-h-screen bg-[#121212] flex items-center justify-center py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 ref={howItWorksHeadingRef} className={`${styles.sectionHeading} text-center mb-10 md:mb-16 text-white`}>Why Convoo?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Card 1 - Gradient effect */}
            <div className={`${styles.cardGradient1} p-4 md:p-6 rounded-xl`}>
              <div className="flex items-center mb-3 md:mb-4">
                <div className={`${styles.iconContainer} mr-3`}>
                  <Heart size={24} color="#B83280" />
                </div>
                <h3 className="font-nunito text-xl md:text-2xl font-bold text-[#B83280]">Looks aren't everything</h3>
              </div>
              <p className="font-inter text-white/90 font-bold mb-2 md:mb-3 text-base md:text-lg">Talk first. Feel the spark.</p>
              <p className="font-inter italic text-[#FFFFFF]/80 text-sm md:text-base">Before you see each other, you feel each other. Chemistry comes first — looks come later.</p>
            </div>
            
            {/* Card 2 - Glass effect */}
            <div className={`${styles.cardGradient1} p-4 md:p-6 rounded-xl`}>
              <div className="flex items-center mb-3 md:mb-4">
                <div className={`${styles.iconContainer} mr-3`}>
                  <UserSearch size={24} color="#B83280" />
                </div>
                <h3 className="font-nunito text-xl md:text-2xl font-semibold text-[#B83280]">Tired of endless scrolling?</h3>
              </div>
              <p className="font-inter text-white/90 font-bold mb-2 md:mb-3 text-base md:text-lg">Say goodbye to dating fatigue.</p>
              <p className="font-inter italic text-[#FFFFFF]/80 text-sm md:text-base">No more comparing bios and filters. Just one honest convo at a time.</p>
            </div>
            
            {/* Card 3 - Dark with highlight border */}
            <div className={`${styles.cardGradient1} p-4 md:p-6 rounded-xl`}>
              <div className="flex items-center mb-3 md:mb-4">
                <div className={`${styles.iconContainer} mr-3`}>
                  <EyeOff size={24} color="#B83280" />
                </div>
                <h3 className="font-nunito text-xl md:text-2xl font-semibold text-[#B83280]">Swiping is exhausting</h3>
              </div>
              <p className="font-inter text-white/90 font-bold mb-2 md:mb-3 text-base md:text-lg">We don't do that here.</p>
              <p className="font-inter italic text-[#FFFFFF]/80 text-sm md:text-base">Show up at the right time, meet one person, and actually talk.</p>
            </div>
            
            {/* Card 4 - Minimal with dashed border */}
            <div className={`${styles.cardGradient1} p-4 md:p-6 rounded-xl`}>
              <div className="flex items-center mb-3 md:mb-4">
                <div className={`${styles.iconContainer} mr-3`}>
                  <Clock size={24} color="#B83280" />
                </div>
                <h3 className="font-nunito text-xl md:text-2xl font-semibold text-[#B83280]">Too many choices?</h3>
              </div>
              <p className="font-inter  text-white/90 font-bold mb-2 md:mb-3 text-base md:text-lg">One person. One convo.</p>
              <p className="font-inter italic text-[#FFFFFF]/80 text-sm md:text-base">No buffet of faces. Just a single, meaningful match — live and in the moment.</p>
            </div>
            
            {/* Card 5 - Gradient with glow */}
            <div className={`${styles.cardGradient1} p-4 md:p-6 rounded-xl`}>
              <div className="flex items-center mb-3 md:mb-4">
                <div className={`${styles.iconContainer} mr-3`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B83280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14l6-6"/><circle cx="14" cy="9" r="1"/><circle cx="10" cy="14" r="1"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2"/></svg>
                </div>
                <h3 className="font-nunito text-xl md:text-2xl font-semibold text-[#B83280]">Something feels off?</h3>
              </div>
              <p className="font-inter text-white/90 font-bold mb-2 md:mb-3 text-base md:text-lg">Just dip. No hard feelings.</p>
              <p className="font-inter italic text-[#FFFFFF]/80 text-sm md:text-base">It's okay. Not every convo clicks. Exit anytime, no drama.</p>
            </div>
            
            {/* Card 6 - Floating with glow circle */}
            <div className={`${styles.cardGradient1} p-4 md:p-6 rounded-xl`}>
              <div className={styles.cardContent}>
                <div className="flex items-center mb-3 md:mb-4">
                  <div className={`${styles.iconContainer} mr-3`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B83280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  </div>
                  <h3 className="font-nunito text-xl md:text-2xl font-semibold text-[#B83280]">Real-time magic</h3>
                </div>
                <p className="font-inter text-white/90 font-bold mb-2 md:mb-3 text-base md:text-lg">It's now or never.</p>
                <p className="font-inter italic text-[#FFFFFF]/80 text-sm md:text-base">Daily events. Timed chats. A little mystery. A lot of potential.</p>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      <section id="join" className={`${styles.section} scroll-section min-h-screen bg-[#FFFFFF] flex items-center justify-center py-16 md:py-20`} ref={joinSectionRef}>
        <div className="container mx-auto px-4 md:px-6">
          <h2 ref={joinHeadingRef} className={`${styles.sectionHeading} text-center mb-10 md:mb-16`}>
            Ready to Change How You Date?
          </h2>
          <div ref={joinContentRef} className={`${styles.fadeIn} max-w-2xl mx-auto text-center`}>
            <p className="font-inter text-xl text-gray-600 mb-10 max-w-xl mx-auto">
              Join thousands of others who are tired of superficial dating apps and ready for meaningful connections.
            </p>
            <div className={`${styles.enhancedTeaserBox} p-8 rounded-2xl mb-10`}>
              <h3 className="font-nunito text-2xl font-bold text-[#B83280] mb-4">The Future of Dating is Here</h3>
              <p className="font-inter text-gray-700 mb-6">
                No more endless swiping. No more shallow connections.
                <br />
                <span className="font-bold">Just real conversations that matter.</span>
              </p>
              <div ref={joinButtonRef} className={`${styles.staggered}`}>
                <button
                  onClick={() => setShowWaitlist(true)}
                  className={`${styles.button} ${styles.primaryButton} text-lg px-8 py-4`}
                >
                  Join Waitlist Now
                </button>
                <p className="text-center font-inter text-gray-500 text-sm mt-4">
                  Limited spots available for early access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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