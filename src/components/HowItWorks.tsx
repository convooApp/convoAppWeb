import React from 'react';
import { UserPlus, Clock3, Smartphone, ThumbsUp } from 'lucide-react';

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ number, title, description, icon }) => (
  <div className="flex flex-col items-center text-center md:items-start md:text-left">
    <div className="relative">
      <div className="bg-pink-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
        {number}
      </div>
      <div className="absolute top-0 right-0 bg-white p-2 rounded-full shadow-md transform translate-x-1/3 -translate-y-1/3">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-600 max-w-xs">{description}</p>
  </div>
);

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Sign up and create your profile with your interests, preferences, and photos that will be revealed later.",
      icon: <UserPlus className="h-6 w-6 text-pink-600" />
    },
    {
      number: 2,
      title: "Get Matched",
      description: "We'll match you with compatible people based on your interests and preferences.",
      icon: <ThumbsUp className="h-6 w-6 text-pink-600" />
    },
    {
      number: 3,
      title: "Chat for 3 Minutes",
      description: "When matched, you get 3 minutes to chat before seeing each other's photos. Focus on the conversation!",
      icon: <Clock3 className="h-6 w-6 text-pink-600" />
    },
    {
      number: 4,
      title: "Decide to Continue",
      description: "After the timer expires, profiles are revealed, and you both decide if you want to continue the connection.",
      icon: <Smartphone className="h-6 w-6 text-pink-600" />
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-pink-600">Convoo</span> Works
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Our unique approach to dating helps you find genuine connections through conversation first.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {steps.map((step, index) => (
            <Step
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-gray-100 p-6 rounded-2xl inline-block">
            <div className="flex items-center justify-center">
              <div className="w-3 h-3 bg-pink-600 rounded-full animate-ping mr-2"></div>
              <p className="text-gray-600">
                Currently in private beta. <span className="text-pink-600 font-medium">Join the waitlist</span> to get early access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};