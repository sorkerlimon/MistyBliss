import React from 'react';
import { useRouter } from '../context/RouterContext';
import { ArrowRight, Sparkles, Shield, HeartHandshake, Compass } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Hero Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C77F79]">
          Our Craft & Origin
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold text-[#292522] leading-tight">
          Thoughtful objects for spaces of quiet beauty
        </h1>
        <p className="text-sm text-[#77716C] leading-relaxed">
          Founded on the principle that the smallest details in a home evoke the greatest sense of calm and belonging.
        </p>
      </div>

      {/* Narrative Section with Lifestyle Photo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white rounded-2xl border border-[#E9E3DE] p-6 sm:p-10">
        <div className="lg:col-span-6 space-y-4 text-xs sm:text-sm text-[#77716C] leading-relaxed">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C77F79]">
            The Misty Bliss Story
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#292522]">
            Bridging natural materials with contemporary geometry
          </h2>
          <p>
            Misty Bliss began in 2022 as an independent ceramic and botanical studio in the Pacific Northwest. We were drawn to the quiet textures of unglazed stoneware, tactile raw linens, and the warm, golden diffusion of shaded lamps.
          </p>
          <p>
            Rather than chasing rapid trend cycles, every piece in our catalog is developed to endure: heavyweight Belgian flax cushions that soften with age, travertine catchalls carved from solid Italian stone slabs, and botanical stems painted with botanic precision so they bring organic freshness without seasonal wilting.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/shop')}
              className="px-5 py-2.5 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-2"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 h-80 sm:h-96 rounded-xl overflow-hidden bg-[#FAF8F5]">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80"
            alt="Artisanal ceramics and tableware styling"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Core Principles */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#292522]">
            Our Sourcing Philosophy
          </h2>
          <p className="text-xs text-[#77716C]">
            Every material is selected for tactile longevity and environmental responsibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#E9E3DE] space-y-3 text-xs">
            <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#C77F79] border border-[#E9E3DE]">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-[#292522]">Natural Raw Materials</h3>
            <p className="text-[#77716C] leading-relaxed">
              We exclusively specify solid travertine, cast grogged stoneware, pure European flax, and FSC-certified white oak. No artificial veneers or hollow plastics.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E9E3DE] space-y-3 text-xs">
            <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#89947D] border border-[#E9E3DE]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-[#292522]">Enduring Restraint</h3>
            <p className="text-[#77716C] leading-relaxed">
              Our silhouettes emphasize quiet archetypes: softly undulating arches, gentle micro-fluting, and earthy mineral hues that blend into varied room settings.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E9E3DE] space-y-3 text-xs">
            <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#C77F79] border border-[#E9E3DE]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-[#292522]">Low-Impact Packaging</h3>
            <p className="text-[#77716C] leading-relaxed">
              Every parcel leaves our fulfillment center in 100% plastic-free, recyclable corrugated boxes with biodegradable paper cushioning.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
