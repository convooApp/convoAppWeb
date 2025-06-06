import React from 'react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <>
      <div className="bg-[#121212] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-[#B83280]">Terms of Service</h1>
          <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
            <p className="mb-4">Welcome to Convoo! These Terms of Service govern your use of our website and mobile application.</p>
            
            <p className="mb-4">Effective Date: June 1, 2025</p>
            
            <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">1. Eligibility</h2>
            <p className="mb-4">You must be at least 18 years old to use Convoo. By using our services, you represent and warrant that you are at least 18 years of age.</p>
            
            <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">2. Account Registration</h2>
            <p className="mb-4">When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account and password.</p>
            
            <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">3. User Conduct</h2>
            <p className="mb-4">You agree not to use Convoo for any unlawful purpose or in any way that could damage, disable, or impair our services. Prohibited activities include harassment, hate speech, and sharing explicit content without consent.</p>
            
            <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">4. Messaging</h2>
            <p className="mb-4">Convoo facilitates connections through blind conversations. You understand that all communications should be respectful and appropriate. We reserve the right to terminate accounts that violate these standards.</p>
            
            <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">5. Privacy</h2>
            <p className="mb-4">Your privacy is important to us. Please review our <Link to="/privacy" className="text-[#B83280] hover:underline">Privacy Policy</Link> to understand how we collect, use, and share your information.</p>
            
            <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">6. Termination</h2>
            <p className="mb-4">We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or us.</p>
            
            <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">7. Changes to Terms</h2>
            <p className="mb-4">We may modify these Terms at any time. Your continued use of Convoo after any changes indicates your acceptance of the modified Terms.</p>
            
            <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">8. Contact Us</h2>
            <p className="mb-4">If you have any questions about these Terms, please contact us at support@convoo.app.</p>
            
            <div className="mt-8 text-center">
              <Link to="/" className="text-[#B83280] hover:underline">Return to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;