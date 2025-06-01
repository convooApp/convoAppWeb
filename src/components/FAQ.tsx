import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, toggleOpen }) => (
  <div className="border-b border-gray-200 py-6">
    <button
      className="flex justify-between items-center w-full text-left focus:outline-none"
      onClick={toggleOpen}
    >
      <h3 className="text-lg font-semibold">{question}</h3>
      {isOpen ? (
        <ChevronUp className="h-5 w-5 text-pink-600" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-500" />
      )}
    </button>
    
    {isOpen && (
      <div className="mt-4 text-gray-600">
        <p>{answer}</p>
      </div>
    )}
  </div>
);

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState(0);
  
  const faqs = [
    {
      question: "How does the 3-minute timer work?",
      answer: "When you match with someone, a 3-minute timer starts for your conversation. During this time, you can chat freely, but neither of you can see each other's photos. After the timer expires, both profiles are revealed, and you can decide whether to continue the connection."
    },
    {
      question: "What happens if we both want to continue after the timer?",
      answer: "If both parties choose to continue after seeing each other's profiles, you'll be able to chat without time restrictions and explore your connection further."
    },
    {
      question: "Can I use Convoo in my area?",
      answer: "We're currently launching in select cities first. Join the waitlist to be notified when Convoo becomes available in your area."
    },
    {
      question: "Is Convoo free to use?",
      answer: "Convoo offers a free basic version with limited daily conversations. We also offer a premium subscription with additional features like unlimited conversations, advanced filters, and more."
    },
    {
      question: "How is Convoo different from other dating apps?",
      answer: "Unlike traditional dating apps that focus primarily on photos, Convoo prioritizes conversation and connection first. Our 3-minute timer ensures you get to know someone's personality before deciding based on appearance."
    }
  ];
  
  return (
    <section id="faq" className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked <span className="text-pink-600">Questions</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Everything you need to know about Convoo and how it works.
          </p>
        </div>
        
        <div>
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={index === openIndex}
              toggleOpen={() => setOpenIndex(index === openIndex ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};