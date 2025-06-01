import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from './common/Button';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <MessageSquare className="h-8 w-8 text-pink-600" />
          <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-pink-500">
            Convoo
          </span>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-800 hover:text-pink-600 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-800 hover:text-pink-600 transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-gray-800 hover:text-pink-600 transition-colors">
            Testimonials
          </a>
          <a href="#faq" className="text-gray-800 hover:text-pink-600 transition-colors">
            FAQ
          </a>
        </nav>
        
        <Button
          variant="primary"
          size="sm"
          onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Join Waitlist
        </Button>
      </div>
    </header>
  );
};