import React, { useState } from 'react';
import { Clock, Heart } from 'lucide-react';
import { Button } from './common/Button';
import { WaitlistForm } from './WaitlistForm';

export const Hero: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-white to-pink-50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="block">Connect Through</span>
              <span className="text-pink-600">Conversation First</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
              Convoo gives you 3 minutes to connect through conversation before revealing photos.
              Because real connections start with words, not looks.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => setShowForm(true)}
              >
                Join Waitlist
              </Button>
              
              <a href="#how-it-works" className="text-gray-700 flex items-center hover:text-pink-600 transition-colors">
                <span>How it works</span>
                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="relative w-full max-w-md mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white">
                <div className="bg-gray-900 p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-pink-500 mr-2" />
                    <span className="text-white font-medium">02:34</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gray-800 border-4 border-gray-700"></div>
                </div>
                <div className="p-4 h-80 flex flex-col justify-between bg-gray-100">
                  <div>
                    <div className="bg-pink-500 text-white p-3 rounded-2xl rounded-bl-none max-w-[80%] mb-4">
                      Hi there! What's something you're passionate about?
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-br-none max-w-[80%] ml-auto">
                      I love hiking and exploring nature. There's something magical about being outdoors!
                    </div>
                  </div>
                  <div className="bg-white rounded-full p-3 flex items-center">
                    <input 
                      type="text" 
                      placeholder="Type your message..." 
                      className="flex-1 bg-transparent focus:outline-none"
                      disabled
                    />
                    <button className="bg-pink-500 text-white rounded-full p-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg flex items-center transform rotate-6">
                <Heart className="h-6 w-6 text-pink-500 mr-2" />
                <span className="text-gray-800 font-medium">Talk first, see later</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showForm && (
        <div id="waitlist" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowForm(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <WaitlistForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </section>
  );
};