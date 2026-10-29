'use client';

import React from 'react';
import Link from 'next/link';
import { MistyBlissIcon } from '../components/common/MistyBlissIcon';
import { Sparkles, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Hero */}
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#C77F79] font-semibold">
          Our Philosophy
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#292522]">
          Quiet Beauty for Everyday Living
        </h1>
        <p className="text-sm text-[#77716C] max-w-xl mx-auto leading-relaxed">
          Misty Bliss was founded on the belief that a home should be a tactile, calming sanctuary. We curate objects crafted with natural materials, honesty, and quiet dignity.
        </p>
      </div>

      {/* Image Banner */}
      <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-[#FAF8F5] border border-[#E9E3DE]">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80"
          alt="Misty Bliss ceramics studio and warm textures"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 bg-white rounded-xl border border-[#E9E3DE] space-y-2">
          <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#C77F79]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-base text-[#292522]">Artisan Craft</h3>
          <p className="text-xs text-[#77716C] leading-relaxed">
            Every piece is selected for tactile warmth, subtle imperfections, and enduring quality over disposable trends.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-[#E9E3DE] space-y-2">
          <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#89947D]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-base text-[#292522]">Natural Raw Materials</h3>
          <p className="text-xs text-[#77716C] leading-relaxed">
            From coarse grogged stoneware and honed travertine to heavyweight Belgian linens and pure soy wax.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-[#E9E3DE] space-y-2">
          <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#C77F79]">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-base text-[#292522]">Mindful Spaces</h3>
          <p className="text-xs text-[#77716C] leading-relaxed">
            We curate harmonious room settings that help bring peace, balance, and intentionality to daily life.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-[#E9E3DE] text-center space-y-4">
        <MistyBlissIcon size={48} className="mx-auto ring-1 ring-[#E9E3DE]" />
        <h3 className="text-xl font-bold text-[#292522]">Discover the Spring Sanctuary</h3>
        <p className="text-xs text-[#77716C] max-w-md mx-auto">
          Explore our newest stoneware vases, diffuse linen table lights, and botanicals.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md transition-colors"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
