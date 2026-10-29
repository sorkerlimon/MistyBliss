'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Trash2, Pencil, X, Check, Plus, Link2, Star } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { BlogPost, BLOG_CATEGORIES } from '../../types';
import { slugify, uniqueSlug } from '../../lib/slug';

const emptyForm = {
  title: '',
  slug: '',
  subtitle: '',
  excerpt: '',
  contentText: '',
  category: BLOG_CATEGORIES[0] as string,
  authorName: 'Misty Bliss Studio',
  authorRole: 'Editor',
  authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  publishedDate: '',
  readTime: '3 min read',
  coverImage: '',
  tagsText: '',
  featured: false,
};

export const BlogAdminPanel: React.FC = () => {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost, addToast } = useShop();
  const [form, setForm] = useState(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const editing = useMemo(
    () => (editingId ? blogPosts.find((p) => p.id === editingId) : null),
    [blogPosts, editingId]
  );

  useEffect(() => {
    if (!formOpen && !deleteTarget) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deleteTarget) setDeleteTarget(null);
        else closeFormModal();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [formOpen, deleteTarget]);

  const closeFormModal = () => {
    setFormOpen(false);
    setForm(emptyForm);
    setSlugTouched(false);
    setEditingId(null);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      publishedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    });
    setSlugTouched(false);
    setFormOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      subtitle: post.subtitle || '',
      excerpt: post.excerpt,
      contentText: (post.content || []).join('\n\n'),
      category: post.category,
      authorName: post.author.name,
      authorRole: post.author.role,
      authorAvatar: post.author.avatar,
      publishedDate: post.publishedDate,
      readTime: post.readTime,
      coverImage: post.coverImage,
      tagsText: (post.tags || []).join(', '),
      featured: Boolean(post.featured),
    });
    setSlugTouched(true);
    setFormOpen(true);
  };

  const setTitle = (title: string) => {
    setForm((prev) => {
      const next = { ...prev, title };
      if (!slugTouched) {
        next.slug = uniqueSlug(
          title,
          blogPosts.filter((p) => p.id !== editingId).map((p) => p.slug)
        );
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = form.contentText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    const tags = form.tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (!form.title.trim() || !form.coverImage.trim()) {
      addToast('Missing fields', 'Title and cover image are required', 'info');
      return;
    }
    if (content.length === 0) {
      addToast('Content required', 'Add at least one paragraph (blank line separates paragraphs)', 'info');
      return;
    }

    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      excerpt: form.excerpt.trim() || form.title.trim(),
      content,
      category: form.category,
      author: {
        name: form.authorName.trim() || 'Misty Bliss Studio',
        role: form.authorRole.trim() || 'Editor',
        avatar: form.authorAvatar.trim(),
      },
      publishedDate: form.publishedDate.trim(),
      readTime: form.readTime.trim() || '3 min read',
      coverImage: form.coverImage.trim(),
      tags,
      featured: form.featured,
      slug: slugify(form.slug || form.title),
    };

    if (editing) {
      updateBlogPost({ ...editing, ...payload });
      closeFormModal();
      return;
    }

    const created = addBlogPost(payload);
    if (created) closeFormModal();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#292522] flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#C77F79]" />
            Journal / Blog
          </h2>
          <p className="text-[11px] text-[#77716C] mt-0.5">
            {blogPosts.length} posts · shown on the homepage Journal section
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Post
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E9E3DE] divide-y divide-[#E9E3DE] overflow-hidden">
        {blogPosts.length === 0 && (
          <p className="p-4 text-xs text-[#77716C]">No posts yet. Click Add Post to create one.</p>
        )}
        {blogPosts.map((post) => (
          <div key={post.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={post.coverImage}
                alt=""
                referrerPolicy="no-referrer"
                className="w-14 h-11 rounded object-cover border border-[#E9E3DE] shrink-0 bg-[#FAF8F5]"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-semibold text-[#292522] truncate">{post.title}</h4>
                  {post.featured && (
                    <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#C77F79]/15 text-[#C77F79]">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#77716C] truncate mt-0.5">
                  {post.category} · {post.publishedDate} · {post.readTime} ·{' '}
                  <span className="font-mono">/{post.slug}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => openEdit(post)}
                className="p-1.5 rounded border border-[#E9E3DE] text-[#77716C] hover:text-[#292522] hover:bg-[#FAF8F5] cursor-pointer"
                title="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(post)}
                className="p-1.5 rounded border border-[#E9E3DE] text-[#A84940] hover:bg-[#F1E5E1] cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={closeFormModal} />
          <div className="relative w-full max-w-xl bg-white rounded-2xl border border-[#E9E3DE] shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#E9E3DE] px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#292522]">
                {editing ? 'Edit Blog Post' : 'Add Blog Post'}
              </h3>
              <button type="button" onClick={closeFormModal} className="p-1.5 text-[#77716C] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Title *</label>
                <input
                  required
                  autoFocus
                  value={form.title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Slug *</label>
                <input
                  required
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }));
                  }}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Subtitle</label>
                <input
                  value={form.subtitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  >
                    {BLOG_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Read time</label>
                  <input
                    value={form.readTime}
                    onChange={(e) => setForm((prev) => ({ ...prev, readTime: e.target.value }))}
                    placeholder="4 min read"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Published date</label>
                  <input
                    value={form.publishedDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, publishedDate: e.target.value }))}
                    placeholder="Oct 18, 2026"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Tags</label>
                  <input
                    value={form.tagsText}
                    onChange={(e) => setForm((prev) => ({ ...prev, tagsText: e.target.value }))}
                    placeholder="Ceramics, Slow Living"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] resize-y"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">
                  Body * <span className="font-normal text-[#A89F97]">(blank line = new paragraph)</span>
                </label>
                <textarea
                  required
                  value={form.contentText}
                  onChange={(e) => setForm((prev) => ({ ...prev, contentText: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] resize-y"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1 flex items-center gap-1">
                  <Link2 className="w-3 h-3" />
                  Cover image URL *
                </label>
                <input
                  required
                  type="url"
                  value={form.coverImage}
                  onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
                  placeholder="https://…"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                />
                {form.coverImage && (
                  <img
                    src={form.coverImage}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="mt-2 h-24 w-full object-cover rounded-md border border-[#E9E3DE]"
                  />
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Author name</label>
                  <input
                    value={form.authorName}
                    onChange={(e) => setForm((prev) => ({ ...prev, authorName: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Author role</label>
                  <input
                    value={form.authorRole}
                    onChange={(e) => setForm((prev) => ({ ...prev, authorRole: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-[11px] text-[#292522] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="rounded border-[#E9E3DE]"
                />
                <Star className="w-3.5 h-3.5 text-[#C77F79]" />
                Featured story (homepage hero)
              </label>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E9E3DE]">
                <button type="button" onClick={closeFormModal} className="px-3.5 py-2 text-xs text-[#77716C] cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#292522] text-white text-xs font-semibold rounded-md cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  {editing ? 'Save Changes' : 'Add Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-[#E9E3DE] shadow-2xl z-10 p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#292522]">Delete blog post?</h3>
              <p className="text-xs text-[#77716C] mt-1 leading-relaxed">
                “{deleteTarget.title}” will be removed from the Journal.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 text-xs text-[#77716C] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteBlogPost(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 bg-[#A84940] text-white text-xs font-semibold rounded-md cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
