import React, { useState } from 'react';
import { Button } from './common/Button';
import { Check, Instagram, Twitter } from 'lucide-react';
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
        setError('Something went wrong. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      setSubmitted(true);
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold mb-4">You're on the list! 💘</h3>
        <p className="text-gray-600 mb-6">
          We'll let you know the moment sparks are ready to fly.
          <br />
          In the meantime, follow us for sneak peeks.
        </p>
        
        <div className="flex justify-center space-x-6 mb-6">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
             className="text-pink-600 hover:text-pink-700 transition-colors">
            <Instagram size={28} />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
             className="text-pink-600 hover:text-pink-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.321 5.562a5.124 5.124 0 0 1-3.035-2.49 5.124 5.124 0 0 1-.32-1.009h-3.48v11.99c0 .86-.398 1.625-1.02 2.128a2.916 2.916 0 0 1-1.98.686c-1.62 0-2.93-1.322-2.93-2.95 0-1.63 1.31-2.95 2.93-2.95.323 0 .636.053.93.152v-3.563a6.492 6.492 0 0 0-.93-.067c-3.58 0-6.48 2.95-6.48 6.587 0 3.638 2.9 6.587 6.48 6.587 3.58 0 6.48-2.95 6.48-6.587V8.45a8.74 8.74 0 0 0 4.956 1.54v-3.473a5.116 5.116 0 0 1-1.6-.955Z"/>
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
             className="text-pink-600 hover:text-pink-700 transition-colors">
            <Twitter size={28} />
          </a>
        </div>
        
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }
  
  return (
    <div>
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
              <span>📍 City or Zipcode</span>
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
            {isSubmitting ? 'Submitting...' : 'Count Me In 💌'}
          </Button>
        </div>
      </form>
    </div>
  );
};