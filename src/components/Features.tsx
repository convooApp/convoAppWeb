import React from 'react';
import { Clock, UserSearch, Lock, Heart } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <div className="bg-white rounded-3xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:translate-y-[-8px]">
    <div className="bg-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export const Features: React.FC = () => {
  const features = [
    {
      title: "3-Minute Timer",
      description: "Get to know someone through conversation first, with just 3 minutes daily before seeing each other.",
      icon: <Clock className="h-8 w-8 text-pink-600" />
    },
    {
      title: "Personality First",
      description: "Connect based on conversation and chemistry rather than just physical appearance.",
      icon: <UserSearch className="h-8 w-8 text-pink-600" />
    },
    {
      title: "Privacy Focused",
      description: "Your profile is only revealed after both parties have had a meaningful conversation.",
      icon: <Lock className="h-8 w-8 text-pink-600" />
    },
    {
      title: "Genuine Connections",
      description: "Find matches based on real compatibility, not just a quick swipe based on looks.",
      icon: <Heart className="h-8 w-8 text-pink-600" />
    }
  ];

  return (
    <section id="features" className="py-20 px-4 bg-pink-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Talk First, <span className="text-pink-600">See Later</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Convoo flips the dating app experience to prioritize conversation and chemistry over physical appearance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};