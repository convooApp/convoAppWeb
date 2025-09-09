import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error: supabaseError } = await supabase.from('tech_support').insert({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    })
    
    if (supabaseError) {
      console.error('Error submitting to tech support:', supabaseError);
      return;
    }
    
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#121212] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-[#1A1A1A] p-8 rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-[#B83280] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#B83280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#B83280] mb-4">Message Sent!</h2>
            <p className="text-gray-300 mb-6">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <div className="space-y-4">
              <Link 
                to="/support" 
                className="inline-block px-6 py-3 bg-[#B83280] text-white font-semibold rounded-lg hover:bg-[#9A2B6B] transition-colors duration-300 mr-4"
              >
                Back to Support
              </Link>
              <Link 
                to="/" 
                className="inline-block px-6 py-3 border border-[#B83280] text-[#B83280] font-semibold rounded-lg hover:bg-[#B83280] hover:text-white transition-colors duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#B83280] mb-4">Contact Us</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Have a question, concern, or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-[#B83280] mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#B83280] bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-[#B83280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-300">support@support.convoo.app</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#B83280] bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-[#B83280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Response Time</p>
                    <p className="text-gray-300">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-[#B83280] mb-4">Common Topics</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#B83280] rounded-full mr-3"></span>
                  Account issues and technical support
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#B83280] rounded-full mr-3"></span>
                  Privacy and safety concerns
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#B83280] rounded-full mr-3"></span>
                  Feature requests and feedback
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#B83280] rounded-full mr-3"></span>
                  Beta testing and app access
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#B83280] rounded-full mr-3"></span>
                  Partnership and business inquiries
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-[#B83280] mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#121212] border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#B83280] focus:border-transparent text-white"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#121212] border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#B83280] focus:border-transparent text-white"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#121212] border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#B83280] focus:border-transparent text-white"
                >
                  <option value="">Select a topic</option>
                  <option value="technical">Technical Support</option>
                  <option value="account">Account Issues</option>
                  <option value="privacy">Privacy & Safety</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="beta">Beta Testing</option>
                  <option value="business">Business Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#121212] border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#B83280] focus:border-transparent text-white resize-vertical"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#B83280] text-white font-semibold rounded-lg hover:bg-[#9A2B6B] transition-colors duration-300 focus:ring-2 focus:ring-[#B83280] focus:ring-offset-2 focus:ring-offset-[#121212]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/support" 
            className="inline-flex items-center px-6 py-3 border border-[#B83280] text-[#B83280] font-semibold rounded-lg hover:bg-[#B83280] hover:text-white transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Support Center
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
