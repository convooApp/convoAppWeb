import React, { useState } from 'react';
import { Button } from './common/Button';
import { Check, Instagram, Twitter, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface WaitlistFormProps {
  onClose: () => void;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!firstName.trim()) {
      setError('Please enter your first name');
      return;
    }
    
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!location.trim()) {
      setError('Please enter your city or zipcode');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send data to Supabase
      const { error: supabaseError } = await supabase
        .from('waitlist')
        .insert([
          { 
            first_name: firstName.trim(),
            email: email.trim().toLowerCase(),
            location: location.trim(),
            created_at: new Date().toISOString()
          }
        ]);
        
      if (supabaseError) {
        console.error('Error submitting to waitlist:', supabaseError);
        if (supabaseError.code === '23505') {
          setError('You are already on the waitlist.');
        } else {
          setError('Something went wrong. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }
      
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <div className="relative bg-white rounded-xl shadow-lg max-w-md w-full p-6 md:p-8">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold mb-4">You're on the list!</h3>
          <p className="text-gray-600 mb-6">
            We'll let you know the moment sparks are ready to fly.
            <br />
            In the meantime, follow us for sneak peeks.
          </p>
          
          <div className="flex justify-center space-x-6 mb-6">
            <a href="https://www.instagram.com/convooapp/" target="_blank" rel="noopener noreferrer" 
               className="text-pink-600 hover:text-pink-700 transition-colors">
              <Instagram size={28} />
            </a>
            <a href="https://x.com/convooapp" target="_blank" rel="noopener noreferrer"
               className="text-pink-600 hover:text-pink-700 transition-colors">
              <X size={28} />
            </a>
          </div>
          
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative bg-white rounded-xl shadow-lg max-w-md w-full p-6 md:p-8">
      <button 
        onClick={onClose} 
        className="absolute top-3 right-3 p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
        aria-label="Close"
      >
        <X size={24} />
      </button>
      <h3 className="text-2xl font-bold mb-2">Join the Waitlist</h3>
      <p className="text-gray-600 mb-6">
        Be among the first to experience meaningful connections through conversation.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-gray-700 mb-2">
            First Name <span className="text-pink-600">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email Address <span className="text-pink-600">*</span>
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="location" className="block text-gray-700 mb-2">
            <span className="flex items-center">
              <span>City or Zipcode</span>
              <span className="text-pink-600 ml-1">*</span>
            </span>
          </label>
          <input
            type="text"
            id="location"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Your city or zipcode"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        
        {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}
        
        <div className="flex justify-center">
          <Button 
            variant="primary" 
            type="submit"
            className="w-full text-lg font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Count Me In'}
          </Button>
        </div>
      </form>
    </div>
  );
};