/*
* Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
* Licensed See LICENSE file in the project root for details.
*/

import Navbar from '@ui/containers/Navbar';
import { P, H1, H2, H3 } from '@ui/core/Text';
import { Container } from '@ui/core/Container';
import { Toggle } from '@ui/shared/Toggle';
import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    newsletter: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, newsletter: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Here you can add API call or form submission logic
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <Navbar />
      <Container className="mt-10 max-w-2xl px-4">
        <H1 className="text-4xl font-bold text-[var(--text)] mb-4 text-center">
          Contact Us
        </H1>
        <P className="text-lg text-[var(--text)] mb-8 text-center">
          We'd love to hear from you! Please fill out the form below to get in touch.
        </P>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[var(--text)] mb-1"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--text)] mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-[var(--text)] mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Write your message here..."
            />
          </div>

          {/* Newsletter Toggle */}
          <div className="flex items-center justify-between">
            <Toggle
              id="newsletter-toggle"
              checked={formData.newsletter}
              onChange={handleToggle}
              label="Subscribe to newsletter"
              size="md"
              colorVariant="primary"
            />
            <button
              type="submit"
              className="ml-4 rounded bg-blue-600 px-6 py-2 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Send
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default Contact;
