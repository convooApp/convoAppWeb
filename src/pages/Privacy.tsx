import React from 'react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
  return (
    <div className="bg-[#121212] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#B83280]">Convoo – Privacy Policy</h1>
        <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
          <p className="mb-4">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal data.
          </p>

          <p className="mb-4">Effective Date: June 1, 2025</p>

          <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide when creating an account, such as your phone number. We also collect device information for performance and analytics.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use your information to provide and improve our services, facilitate connections with other users, and ensure the security of our platform.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">3. Data Sharing</h2>
          <p className="mb-4">
            We do not sell your personal information. We may share data with service providers who help us operate our platform, or when required by law.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">4. Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">5. Your Rights</h2>
          <p className="mb-4">
            Depending on your location, you may have rights to access, correct, or delete your personal information. Contact us to exercise these rights.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">6. Changes to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">7. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at privacy@convoo.app.
          </p>

          <div className="mt-8 text-center">
            <Link to="/" className="text-[#B83280] hover:underline">Return to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;