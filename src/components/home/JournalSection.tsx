'use client';

import React, { useMemo, useState } from 'react';
import { BlogPost, BLOG_CATEGORIES } from '../../types';
import { BookOpen, Clock, Calendar, ArrowRight, X, Sparkles, Tag, ChevronRight, User } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { useShop } from '../../context/ShopContext';

export const JournalSection: React.FC = () => {
  const { navigate } = useRouter();
  const { blogPosts } = useShop();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  const categories = useMemo(() => {
    const fromPosts = Array.from(new Set(blogPosts.map((p) => p.category).filter(Boolean)));
    const known = BLOG_CATEGORIES.filter((c) => fromPosts.includes(c));
    const extras = fromPosts.filter((c) => !(BLOG_CATEGORIES as readonly string[]).includes(c));
    return ['All', ...known, ...extras];
  }, [blogPosts]);

  const filteredPosts =
    selectedCategory === 'All'
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];
  const listPosts = filteredPosts.filter(
    (p) => p.id !== (selectedCategory === 'All' ? featuredPost?.id : '')
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#E9E3DE] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C77F79]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C77F79]">
              The Misty Bliss Journal
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#292522]">
            Stories of Craft, Materials & Slow Living
          </h2>
          <p className="text-xs sm:text-sm text-[#77716C] mt-1 max-w-xl leading-relaxed">
            Curated essays from our studio kilns, European weavers, and architectural stone quarries.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#292522] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#77716C] hover:text-[#292522] border border-[#E9E3DE] hover:border-[#C77F79]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Featured Hero Post + Companion List */}
      <div className="mt-8 space-y-8">
        {blogPosts.length === 0 && (
          <p className="text-xs text-[#77716C] py-8 text-center border border-dashed border-[#E9E3DE] rounded-xl">
            Journal stories will appear here once published from the admin panel.
          </p>
        )}
        {selectedCategory === 'All' && featuredPost && (
          <div className="relative rounded-2xl overflow-hidden bg-white border border-[#E9E3DE] shadow-xs group hover:border-[#C77F79] transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Image Side */}
              <div className="lg:col-span-7 h-72 sm:h-96 lg:h-[420px] overflow-hidden relative bg-[#FAF8F5]">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-[#292522]/90 backdrop-blur-xs text-white text-[11px] font-semibold uppercase tracking-wider rounded-md">
                    Featured Story
                  </span>
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-xs text-[#292522] text-[11px] font-semibold rounded-md shadow-xs">
                    {featuredPost.category}
                  </span>
                </div>
              </div>

              {/* Text Side */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-[#77716C]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C77F79]" />
                      <span>{featuredPost.publishedDate}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C77F79]" />
                      <span>{featuredPost.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#292522] group-hover:text-[#C77F79] transition-colors leading-snug">
                    {featuredPost.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#77716C] leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E9E3DE] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-[#E9E3DE]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#292522]">{featuredPost.author.name}</p>
                      <p className="text-[10px] text-[#77716C]">{featuredPost.author.role}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setReadingPost(featuredPost)}
                    className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#F1E5E1] text-[#292522] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-[#E9E3DE]"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C77F79]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3-Column Companion Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setReadingPost(post)}
              className="group bg-white rounded-xl border border-[#E9E3DE] hover:border-[#C77F79] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Thumbnail */}
                <div className="h-48 sm:h-52 w-full overflow-hidden bg-[#FAF8F5] relative">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 bg-white/95 backdrop-blur-xs text-[#292522] text-[10px] font-bold uppercase tracking-wider rounded-md border border-[#E9E3DE] shadow-xs">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Article Header & Excerpt */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-[#77716C]">
                    <span>{post.publishedDate}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C77F79]" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h4 className="text-base font-bold font-heading text-[#292522] group-hover:text-[#C77F79] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h4>

                  <p className="text-xs text-[#77716C] leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Author Footer */}
              <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-[#FAF8F5]">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover border border-[#E9E3DE]"
                  />
                  <span className="text-[11px] font-medium text-[#292522]">{post.author.name}</span>
                </div>
                <span className="text-xs font-semibold text-[#C77F79] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE ARTICLE READING MODAL */}
      {/* ======================================================== */}
      {readingPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setReadingPost(null)}
          />

          <div className="relative bg-white w-full max-w-3xl rounded-2xl border border-[#E9E3DE] shadow-2xl p-6 sm:p-10 z-10 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Header Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E9E3DE]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#E9E3DE] text-[#C77F79] text-xs font-bold uppercase tracking-wider rounded-md">
                  {readingPost.category}
                </span>
                <span className="text-xs text-[#77716C]">
                  {readingPost.publishedDate} · {readingPost.readTime}
                </span>
              </div>

              <button
                onClick={() => setReadingPost(null)}
                className="p-1.5 text-[#77716C] hover:text-[#292522] rounded-lg hover:bg-[#FAF8F5] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Title & Cover */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#292522] leading-tight">
                {readingPost.title}
              </h2>
              {readingPost.subtitle && (
                <p className="text-sm sm:text-base text-[#77716C] font-light leading-relaxed">
                  {readingPost.subtitle}
                </p>
              )}

              {/* Author Row */}
              <div className="flex items-center gap-3 py-2">
                <img
                  src={readingPost.author.avatar}
                  alt={readingPost.author.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-[#E9E3DE]"
                />
                <div>
                  <p className="text-xs font-bold text-[#292522]">{readingPost.author.name}</p>
                  <p className="text-[11px] text-[#77716C]">{readingPost.author.role}</p>
                </div>
              </div>

              <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden bg-[#FAF8F5]">
                <img
                  src={readingPost.coverImage}
                  alt={readingPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-4 text-xs sm:text-sm text-[#4A423B] leading-relaxed font-normal">
              {readingPost.content.map((paragraph, idx) => (
                <p key={idx} className="first-letter:text-2xl first-letter:font-heading first-letter:font-bold first-letter:text-[#C77F79]">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags */}
            <div className="pt-4 border-t border-[#E9E3DE] flex flex-wrap gap-2 items-center">
              <Tag className="w-3.5 h-3.5 text-[#77716C]" />
              {readingPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-[#FAF8F5] text-[#77716C] rounded-md text-[11px] font-medium border border-[#E9E3DE]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Footer Call to Action */}
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E9E3DE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#292522]">Explore the Studio Collection</p>
                <p className="text-[11px] text-[#77716C]">Discover hand-thrown stoneware, lighting, and textiles mentioned in this journal.</p>
              </div>
              <button
                onClick={() => {
                  setReadingPost(null);
                  navigate('/shop');
                }}
                className="px-4 py-2 bg-[#292522] hover:bg-[#3D3834] text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
              >
                Browse Shop
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
