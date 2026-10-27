'use client';

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addToast } = useShop();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Message Dispatched', 'Thank you! Our studio concierge will reply within 24 hours.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#C77F79] font-semibold">
          Studio Concierge
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#292522]">
          We’d Love to Hear From You
        </h1>
        <p className="text-xs sm:text-sm text-[#77716C] max-w-md mx-auto">
          Have an inquiry about an artisanal piece, custom orders, or trade accounts? Reach out below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info */}
        <div className="md:col-span-5 space-y-6 bg-white p-6 rounded-xl border border-[#E9E3DE]">
          <h3 className="font-semibold text-base text-[#292522]">Studio Showroom</h3>
          
          <div className="space-y-4 text-xs text-[#77716C]">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#C77F79] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#292522]">Misty Bliss Studio & Workshop</p>
                <p>418 Mercer Walk</p>
                <p>Portland, OR 97201</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#C77F79] shrink-0" />
              <p>concierge@mistybliss.com</p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#C77F79] shrink-0" />
              <p>+1 (503) 555-0192</p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E9E3DE] text-xs text-[#77716C]">
            <p className="font-semibold text-[#292522]">Concierge Hours</p>
            <p className="mt-1">Monday – Friday: 9:00 AM – 6:00 PM PST</p>
            <p>Saturday: 10:00 AM – 4:00 PM PST</p>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-[#E9E3DE]">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#89947D]/15 text-[#5E6B56] flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#292522]">Message Received</h3>
              <p className="text-xs text-[#77716C] max-w-xs mx-auto">
                Thank you for contacting Misty Bliss. Our design team has received your message and will be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  placeholder="Order question, custom styling, trade..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  placeholder="How can we assist you with your space?"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
