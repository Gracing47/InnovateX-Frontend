import React, { useState } from 'react';
import Link from 'next/link';
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    try {
      // Implement newsletter signup logic here
      // Placeholder for actual signup logic
      console.log(`Attempting to sign up email: ${email}`);
      // Simulate successful signup
      console.log('Signup successful');
    } catch (error) {
      console.error('Signup failed:', error);
    }
    setEmail('');
  };

  return (
    <footer className="bg-gray-100 text-gray-600 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sitemap Links */}
          <div>
            <h3 className="font-bold mb-4">Sitemap</h3>
            <ul className="space-y-2">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">Über uns</Link></li>
              <li><Link href="/solutions">Lösungen</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/digitalization-score">Digitalisierungs-Score</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/career">Karriere</Link></li>
              <li><Link href="/events">Events</Link></li>
              <li><Link href="/meetups">Meetups</Link></li>
              <li><Link href="/support">Support</Link></li>
            </ul>
          </div>

          {/* Legal Information */}
          <div>
            <h3 className="font-bold mb-4">Rechtliches</h3>
            <ul className="space-y-2">
              <li><Link href="/imprint">Impressum</Link></li>
              <li><Link href="/privacy">Datenschutzerklärung</Link></li>
              <li><Link href="/terms">Nutzungsbedingungen</Link></li>
              <li><Link href="/cookies">Cookie-Richtlinie</Link></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="font-bold mb-4">Newsletter</h3>
            <p className="mb-4">Melden Sie sich für unseren Newsletter an und bleiben Sie über Neuigkeiten und Events informiert.</p>
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ihre E-Mail-Adresse"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Abonnieren
              </button>
            </form>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 flex justify-center space-x-4">
          <a href="#" className="text-gray-400 hover:text-gray-600"><FaFacebook size={24} /></a>
          <a href="#" className="text-gray-400 hover:text-gray-600"><FaLinkedin size={24} /></a>
          <a href="#" className="text-gray-400 hover:text-gray-600"><FaTwitter size={24} /></a>
          <a href="#" className="text-gray-400 hover:text-gray-600"><FaInstagram size={24} /></a>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p>&copy; 2024 InnovateX. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;