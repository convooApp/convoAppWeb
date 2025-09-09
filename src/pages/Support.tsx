import React from 'react';
import { Link } from 'react-router-dom';

const Support: React.FC = () => {
  return (
    <div className="bg-[#121212] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-[#B83280]">Convoo..</span>
        
          </h1>
          <h2 className="text-3xl font-bold text-[#B83280] mb-4">Support Center</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Need help? Find answers to common questions or get in touch with our support team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Terms of Service */}
          <Link 
            to="/terms" 
            className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg hover:bg-[#222222] transition-all duration-300 hover:transform hover:-translate-y-1 hover:border-[#B83280] border border-transparent group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-[#B83280] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-opacity-30 transition-all duration-300">
                <svg className="w-8 h-8 text-[#B83280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#B83280] mb-2">Terms of Service</h3>
              <p className="text-gray-300 text-sm">
                Read our terms and conditions for using Convoo
              </p>
            </div>
          </Link>

          {/* Privacy Policy */}
          <Link 
            to="/privacy" 
            className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg hover:bg-[#222222] transition-all duration-300 hover:transform hover:-translate-y-1 hover:border-[#B83280] border border-transparent group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-[#B83280] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-opacity-30 transition-all duration-300">
                <svg className="w-8 h-8 text-[#B83280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#B83280] mb-2">Privacy Policy</h3>
              <p className="text-gray-300 text-sm">
                Learn how we protect and handle your personal data
              </p>
            </div>
          </Link>

          {/* Delete Account */}
          <Link 
            to="/delete-account" 
            className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg hover:bg-[#222222] transition-all duration-300 hover:transform hover:-translate-y-1 hover:border-[#B83280] border border-transparent group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-[#B83280] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-opacity-30 transition-all duration-300">
                <svg className="w-8 h-8 text-[#B83280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#B83280] mb-2">Delete Account</h3>
              <p className="text-gray-300 text-sm">
                Permanently remove your account and all associated data
              </p>
            </div>
          </Link>

          {/* Child Safety */}
          <Link 
            to="/child-safety" 
            className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg hover:bg-[#222222] transition-all duration-300 hover:transform hover:-translate-y-1 hover:border-[#B83280] border border-transparent group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-[#B83280] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-opacity-30 transition-all duration-300">
                <svg className="w-8 h-8 text-[#B83280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#B83280] mb-2">Child Safety</h3>
              <p className="text-gray-300 text-sm">
                Our commitment to protecting minors and preventing abuse
              </p>
            </div>
          </Link>

          {/* Contact */}
          <Link 
            to="/contact" 
            className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg hover:bg-[#222222] transition-all duration-300 hover:transform hover:-translate-y-1 hover:border-[#B83280] border border-transparent group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-[#B83280] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-opacity-30 transition-all duration-300">
                <svg className="w-8 h-8 text-[#B83280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#B83280] mb-2">Contact Us</h3>
              <p className="text-gray-300 text-sm">
                Get in touch with our support team for assistance
              </p>
            </div>
          </Link>

          {/* FAQ Section */}
          <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg border border-transparent">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#B83280] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#B83280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#B83280] mb-2">FAQ</h3>
              <p className="text-gray-300 text-sm mb-4">
                Common questions about Convoo
              </p>
              <p className="text-sm text-gray-400">Coming Soon</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-[#B83280] text-white font-semibold rounded-lg hover:bg-[#9A2B6B] transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Support;
