import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BetaFormProps {
  onClose: () => void;
}

export const BetaForm: React.FC<BetaFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Please enter your name');
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
    
    if (!deviceType) {
      setError('Please select your preferred device');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send data to Supabase
      const { error: supabaseError } = await supabase
        .from('beta_testers')
        .insert([
          { 
            name: name.trim(),
            email: email.trim().toLowerCase(),
            device_type: deviceType,
            created_at: new Date().toISOString()
          }
        ]);
        
      if (supabaseError) {
        if (supabaseError.code === '23505') {
          setError('This email is already registered for beta testing.');
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
          <h3 className="text-2xl font-bold mb-4">You're on the beta list! 🚀</h3>
          <p className="text-gray-600 mb-6">
            Thanks for signing up as a beta tester. We'll reach out when we're ready for testing on your {deviceType === 'both' ? 'preferred devices' : deviceType} device.
          </p>
          
          <button
            onClick={onClose}
            className="bg-[#B83280] text-white px-8 py-2 rounded-full hover:bg-[#a02a70] transition-colors"
          >
            Close
          </button>
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
      
      <h2 className="text-2xl font-bold text-center mb-6">Join Our Beta Testing</h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-1 text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B83280] focus:border-transparent"
            placeholder="Your name"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-1 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B83280] focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-sm font-medium">
            Preferred Testing Device
          </label>
          <div className="flex flex-col space-y-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="device"
                value="ios"
                checked={deviceType === 'ios'}
                onChange={() => setDeviceType('ios')}
                className="text-[#B83280] focus:ring-[#B83280]"
              />
              <span className="ml-2">iOS</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="device"
                value="android"
                checked={deviceType === 'android'}
                onChange={() => setDeviceType('android')}
                className="text-[#B83280] focus:ring-[#B83280]"
              />
              <span className="ml-2">Android</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="device"
                value="both"
                checked={deviceType === 'both'}
                onChange={() => setDeviceType('both')}
                className="text-[#B83280] focus:ring-[#B83280]"
              />
              <span className="ml-2">Both</span>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-[#B83280] text-white py-2 rounded-md hover:bg-[#a02a70] transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Submitting...' : 'Join Beta Testing'}
        </button>
      </form>
    </div>
  );
};