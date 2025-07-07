import React from 'react';
import { Link } from 'react-router-dom';

const CSAEPolicy: React.FC = () => {
  return (
    <div className="bg-[#121212] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#B83280]">Child Safety Policy</h1>
        <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
          <p className="mb-4">
            At Convoo, we are committed to ensuring the safety of all users, with a particular focus on protecting children from sexual abuse and exploitation. This policy outlines our approach to preventing, detecting, and addressing Child Sexual Abuse and Exploitation (CSAE).
          </p>

          <p className="mb-4">Effective Date: July 6, 2025</p>

          <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">1. Zero Tolerance Policy</h2>
          <p className="mb-4">
            Convoo has a zero-tolerance policy for any content or behavior that sexually exploits, abuses, or endangers children. This includes, but is not limited to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Grooming children for sexual exploitation</li>
            <li>Sexual extortion (sextortion) of children</li>
            <li>Trafficking of children for sexual purposes</li>
            <li>Sharing, soliciting, or distributing child sexual abuse material (CSAM)</li>
            <li>Any other form of child sexual exploitation or abuse</li>
          </ul>

          <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">2. Age Verification</h2>
          <p className="mb-4">
            Convoo is strictly for users 18 years of age and older. We implement the following measures to prevent minors from accessing our platform:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Age verification during registration</li>
            <li>Periodic age verification checks</li>
            <li>Monitoring for indicators of underage users</li>
          </ul>
          <p className="mb-4">
            If we discover that a user is under 18 years of age, their account will be immediately terminated, and all associated data will be deleted.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">3. Reporting Mechanisms</h2>
          <p className="mb-4">
            We provide multiple channels for reporting suspected CSAE:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>In-app reporting feature accessible from all conversations and profiles</li>
            <li>Dedicated email address: <span className="text-[#B83280]">support@convoo.app</span></li>
            <li>Emergency reporting option for immediate threats</li>
          </ul>
          <p className="mb-4">
            All reports are treated with the highest priority and investigated immediately.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">4. Detection and Prevention</h2>
          <p className="mb-4">
            We employ multiple layers of protection to detect and prevent CSAE:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Automated content scanning using industry-standard tools</li>
            <li>Human moderation of flagged content</li>
            <li>Proactive monitoring of conversations for indicators of grooming or exploitation</li>
            <li>Collaboration with law enforcement and industry partners</li>
          </ul>

          <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">5. Reporting to Authorities</h2>
          <p className="mb-4">
            We comply with all legal obligations to report CSAE to relevant authorities:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Immediate reporting of CSAM to the National Center for Missing & Exploited Children (NCMEC)</li>
            <li>Cooperation with law enforcement investigations</li>
            <li>Preservation of evidence as required by law</li>
          </ul>

          <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">6. Education and Awareness</h2>
          <p className="mb-4">
            We are committed to raising awareness about online child safety:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Regular safety tips and resources within the app</li>
            <li>Partnerships with child safety organizations</li>
            <li>Training for our staff on identifying and addressing CSAE</li>
          </ul>

          <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">7. Account Termination</h2>
          <p className="mb-4">
            Any account found to be involved in CSAE will be immediately and permanently terminated. We will:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Preserve evidence for law enforcement</li>
            <li>Ban all associated devices and identifiers</li>
            <li>Report the incident to appropriate authorities</li>
          </ul>

          <h2 className="text-xl font-bold mt-6 mb-3 text-[#B83280]">8. Contact Information</h2>
          <p className="mb-4">
            For questions about this policy or to report concerns:
          </p>
          <p className="mb-4">
            Email: <span className="text-[#B83280]">convoapp@gmail.com</span><br />
            Emergency Reports: <span className="text-[#B83280]">convoapp@gmail.com</span>
          </p>

          <div className="mt-8 text-center">
            <Link to="/" className="text-[#B83280] hover:underline mr-4">Return to Home</Link>
            <Link to="/terms" className="text-[#B83280] hover:underline mr-4">Terms of Service</Link>
            <Link to="/privacy" className="text-[#B83280] hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSAEPolicy;