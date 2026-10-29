'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { FolderTree, Link2, Upload, Trash2, Pencil, X, Check, Plus } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Category, CategoryImageSource } from '../../types';
import { slugify, uniqueSlug } from '../../lib/slug';

const emptyForm = {
  name: '',
  shortName: '',
  slug: '',
  description: '',
  image: '',
  imageSource: 'url' as CategoryImageSource,
};

const MAX_FILE_BYTES = 900_000;

export const CategoryAdminPanel: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory, addToast } = useShop();

  const productCountFor = (slug: string) =>
    products.filter((p) => p.categorySlug === slug).length;
  const [form, setForm] = useState(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const editing = useMemo(
    () => (editingId ? categories.find((c) => c.id === editingId) : null),
    [categories, editingId]
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
    setFileName('');
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSlugTouched(false);
    setFileName('');
    setFormOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      shortName: cat.shortName,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      imageSource: cat.imageSource || 'url',
    });
    setSlugTouched(true);
    setFileName(cat.imageSource === 'file' ? 'Uploaded image' : '');
    setFormOpen(true);
  };

  const setName = (name: string) => {
    setForm((prev) => {
      const next = { ...prev, name };
      if (!slugTouched) {
        next.slug = uniqueSlug(
          name,
          categories.filter((c) => c.id !== editingId).map((c) => c.slug)
        );
      }
      if (!prev.shortName || prev.shortName === prev.name.slice(0, 24)) {
        next.shortName = name.slice(0, 24);
      }
      return next;
    });
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Invalid file', 'Please choose an image file', 'info');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      addToast('Image too large', 'Keep uploads under ~900KB', 'info');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setForm((prev) => ({ ...prev, image: result, imageSource: 'file' }));
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      shortName: (form.shortName || form.name).trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      imageSource: form.imageSource,
      slug: slugify(form.slug || form.name),
    };

    if (editing) {
      updateCategory({ ...editing, ...payload });
      closeFormModal();
      return;
    }

    const created = addCategory(payload);
    if (created) closeFormModal();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteCategory(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#292522] flex items-center gap-1.5">
            <FolderTree className="w-4 h-4 text-[#C77F79]" />
            Categories
          </h2>
          <p className="text-[11px] text-[#77716C] mt-0.5">
            Manage storefront category tiles and navigation.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E9E3DE] divide-y divide-[#E9E3DE] overflow-hidden">
        {categories.length === 0 && (
          <p className="p-4 text-xs text-[#77716C]">No categories yet. Click Add Category to create one.</p>
        )}
        {categories.map((cat) => {
          const count = productCountFor(cat.slug);
          return (
          <div key={cat.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={cat.image}
                alt=""
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded object-cover border border-[#E9E3DE] shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-semibold text-[#292522] truncate">{cat.name}</h4>
                <p className="text-[11px] text-[#77716C] truncate">
                  <span className="font-mono">/{cat.slug}</span>
                  {' · '}
                  {cat.imageSource === 'file' ? 'file' : 'link'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-semibold tabular-nums px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E9E3DE] text-[#77716C]">
                {count} {count === 1 ? 'product' : 'products'}
              </span>
              <button
                type="button"
                onClick={() => openEdit(cat)}
                className="p-1.5 rounded border border-[#E9E3DE] text-[#77716C] hover:text-[#292522] hover:bg-[#FAF8F5] cursor-pointer"
                title="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(cat)}
                className="p-1.5 rounded border border-[#E9E3DE] text-[#A84940] hover:bg-[#F1E5E1] cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          );
        })}
      </div>

      {/* Create / Edit modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={closeFormModal} />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#E9E3DE] shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#E9E3DE] px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#292522]">
                {editing ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                type="button"
                onClick={closeFormModal}
                className="p-1.5 text-[#77716C] hover:text-[#292522] rounded-md cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Name *</label>
                  <input
                    required
                    autoFocus
                    value={form.name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Wall Art & Mirrors"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Short name</label>
                  <input
                    value={form.shortName}
                    onChange={(e) => setForm((prev) => ({ ...prev, shortName: e.target.value }))}
                    placeholder="Shown under tiles"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
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
                  placeholder="wall-art-mirrors"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                />
                <p className="text-[10px] text-[#A89F97] mt-1">URL: /categories/{form.slug || '…'}</p>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  placeholder="Short collection summary"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] resize-y"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-[#77716C]">Image *</span>
                  <div className="flex rounded-md border border-[#E9E3DE] overflow-hidden text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          imageSource: 'url',
                          image: prev.imageSource === 'file' ? '' : prev.image,
                        }));
                        setFileName('');
                      }}
                      className={`px-2.5 py-1 flex items-center gap-1 cursor-pointer ${
                        form.imageSource === 'url' ? 'bg-[#292522] text-white' : 'bg-white text-[#77716C]'
                      }`}
                    >
                      <Link2 className="w-3 h-3" />
                      Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, imageSource: 'file' }))}
                      className={`px-2.5 py-1 flex items-center gap-1 cursor-pointer ${
                        form.imageSource === 'file' ? 'bg-[#292522] text-white' : 'bg-white text-[#77716C]'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      File
                    </button>
                  </div>
                </div>

                {form.imageSource === 'url' ? (
                  <input
                    required={!form.image}
                    type="url"
                    value={form.image.startsWith('data:') ? '' : form.image}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, image: e.target.value, imageSource: 'url' }))
                    }
                    placeholder="https://…"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                ) : (
                  <div className="space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFile(e.target.files?.[0])}
                      className="w-full text-[11px] text-[#77716C] file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-[#EFECE6] file:text-[#292522] file:text-[11px] file:font-medium file:cursor-pointer"
                    />
                    {fileName && <p className="text-[10px] text-[#89947D]">{fileName}</p>}
                  </div>
                )}

                {form.image && (
                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={form.image}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-md object-cover border border-[#E9E3DE]"
                    />
                    <span className="text-[10px] text-[#A89F97] line-clamp-2 break-all">
                      {form.imageSource === 'file' ? 'File image ready' : form.image}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E9E3DE]">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="px-3.5 py-2 text-xs font-medium text-[#77716C] hover:text-[#292522] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  {editing ? 'Save Changes' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-[#E9E3DE] shadow-2xl z-10 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F1E5E1] flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4 text-[#A84940]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#292522]">Delete category?</h3>
                <p className="text-xs text-[#77716C] mt-1 leading-relaxed">
                  “{deleteTarget.name}” will be removed from the storefront. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 text-xs font-medium text-[#77716C] hover:text-[#292522] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-[#A84940] hover:bg-[#8F3D36] text-white text-xs font-semibold rounded-md cursor-pointer"
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
