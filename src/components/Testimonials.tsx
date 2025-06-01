import React from 'react';

interface TestimonialProps {
  quote: string;
  name: string;
  location: string;
  imgUrl: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, name, location, imgUrl }) => (
  <div className="bg-white rounded-3xl p-8 shadow-lg">
    <div className="flex items-center mb-4">
      <img 
        src={imgUrl} 
        alt={name} 
        className="w-14 h-14 rounded-full object-cover mr-4"
      />
      <div>
        <h4 className="font-bold">{name}</h4>
        <p className="text-gray-500 text-sm">{location}</p>
      </div>
    </div>
    <p className="text-gray-700 italic">"{quote}"</p>
    <div className="mt-4 flex">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  </div>
);

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "I was tired of the superficial swipe culture. Convoo let me connect with someone based on conversation first, and we're still dating 3 months later!",
      name: "Sarah M.",
      location: "New York",
      imgUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      quote: "The 3-minute timer really takes the pressure off and makes you focus on having a real conversation. It's refreshing!",
      name: "David L.",
      location: "Los Angeles",
      imgUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      quote: "I love that I can get to know someone's personality before seeing what they look like. It's led to more meaningful connections.",
      name: "Emma T.",
      location: "Chicago",
      imgUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ];

  return (
    <section id="testimonials" className="py-20 px-4 bg-gradient-to-b from-white to-pink-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Love Stories <span className="text-pink-600">Start With Words</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Hear from people who found meaningful connections through conversation first.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              location={testimonial.location}
              imgUrl={testimonial.imgUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};