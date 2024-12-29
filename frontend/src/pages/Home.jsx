import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const stats = [
    { label: 'Podcasts Analyzed', value: 5000 },
    { label: 'Active Users', value: 1200 },
    { label: 'Countries Supported', value: 75 },
  ];

  const faqs = [
    { question: 'What is Data Waves?', answer: 'It’s a platform for podcast analytics.' },
    { question: 'How much does it cost?', answer: 'We offer a free plan and premium tiers.' },
    { question: 'How can I start?', answer: 'Sign up and explore our features today.' },
  ];

  return (
    <div>
      {/* Header Section */}
      <section className="bg-blue-100 text-center py-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Data Waves</h1>
        <p className="text-lg text-gray-600">Your ultimate platform for podcast analytics and marketing.</p>
      </section>

      {/* Dynamic Stats Section */}
      <section className="bg-white py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Our Achievements</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="p-4 border rounded shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.3 }}
            >
              <h2 className="text-3xl font-bold">{stat.value}</h2>
              <p className="text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-100 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">FAQs</h2>
        </div>
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border-b pb-2">
              <button
                onClick={() => setOpenIndex(index === openIndex ? null : index)}
                className="w-full text-left font-bold text-lg"
              >
                {faq.question}
              </button>
              {openIndex === index && <p className="mt-2 text-gray-700">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Subscription Form */}
      <section className="bg-white py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-4">Subscribe to our newsletter for the latest updates.</p>
          <form className="flex justify-center space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 border rounded w-full max-w-sm"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Social Media Integration */}
      <section className="bg-gray-100 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Follow Us</h2>
          <div className="flex justify-center space-x-4">
            <Link to="#" className="text-blue-500">Twitter</Link>
            <Link to="https://www.linkedin.com/in/badrinatha/" className="text-blue-500">LinkedIn</Link>
            <Link to="#" className="text-blue-500">Facebook</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
