import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addToast } = useShop();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Inquiries & Sizing');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    addToast('Message Sent', 'Our concierge will get back to you within 24 hours.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="max-w-xl mx-auto text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C77F79]">
          Client Concierge
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#292522]">
          We’re Here to Help
        </h1>
        <p className="text-xs sm:text-sm text-[#77716C]">
          Questions regarding dimension specifics, custom trade orders, or order status? Send our team a note.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-5xl mx-auto">
        
        {/* Info Column (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#E9E3DE] space-y-6 text-xs">
          <div>
            <h2 className="text-sm font-semibold text-[#292522] mb-1">Misty Bliss Studio</h2>
            <p className="text-[#77716C] leading-relaxed">
              Showroom visits and trade consultations are welcome by advance appointment.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#E9E3DE]">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#C77F79] mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-[#292522]">Studio Showroom</p>
                <p className="text-[#77716C]">418 Mercer Walk, Suite 200</p>
                <p className="text-[#77716C]">Portland, OR 97201</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#C77F79] mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-[#292522]">Direct Email</p>
                <p className="text-[#77716C]">care@mistyblisshome.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#C77F79] mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-[#292522]">Telephone Support</p>
                <p className="text-[#77716C]">+1 (503) 555-0192</p>
                <p className="text-[11px] text-[#A89F97]">Mon–Fri, 9am–5pm PST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-[#E9E3DE]">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#89947D]/15 text-[#5E6B56] flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[#292522]">Thank you, {name}!</h3>
              <p className="text-xs text-[#77716C] max-w-sm mx-auto">
                Your inquiry has been received. One of our design associates will reply to {email} shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded text-xs font-medium text-[#292522]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                >
                  <option>Product Inquiries & Sizing</option>
                  <option>Order Delivery & Status</option>
                  <option>Interior Designer Trade Program</option>
                  <option>Returns & Exchanges</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  placeholder="How may our studio assist your space?"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2"
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
