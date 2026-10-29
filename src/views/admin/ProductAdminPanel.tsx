'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Package, Link2, Upload, Trash2, Pencil, X, Check, Plus, Star } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product, ProductColor, StockStatus } from '../../types';
import { slugify, uniqueSlug } from '../../lib/slug';

type ImageSource = 'url' | 'file';

const MAX_IMAGES = 5;
const MAX_COLORS = 8;
const MAX_FILE_BYTES = 900_000;

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  purchasePrice: '',
  price: '',
  onDiscount: false,
  compareAtPrice: '',
  categorySlug: '',
  material: '',
  dimensions: '',
  stockStatus: 'in_stock' as StockStatus,
  images: [] as string[],
  imageSource: 'url' as ImageSource,
  linkDraft: '',
  colors: [] as ProductColor[],
  colorNameDraft: '',
  colorHexDraft: '#EAE5DC',
  isNew: false,
  isBestseller: false,
  isFeatured: false,
};

export const ProductAdminPanel: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, addToast } = useShop();
  const [form, setForm] = useState(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const editing = useMemo(
    () => (editingId ? products.find((p) => p.id === editingId) : null),
    [products, editingId]
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
    setForm({
      ...emptyForm,
      categorySlug: categories[0]?.slug || '',
    });
    setSlugTouched(false);
    setEditingId(null);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      categorySlug: categories[0]?.slug || '',
    });
    setSlugTouched(false);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    const onDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      purchasePrice: product.purchasePrice != null ? String(product.purchasePrice) : '',
      price: String(product.price),
      onDiscount,
      compareAtPrice: product.compareAtPrice != null ? String(product.compareAtPrice) : '',
      categorySlug: product.categorySlug,
      material: product.material,
      dimensions: product.dimensions,
      stockStatus: product.stockStatus,
      images: (product.images || []).filter(Boolean).slice(0, MAX_IMAGES),
      imageSource: 'url',
      linkDraft: '',
      colors: (product.colors || []).slice(0, MAX_COLORS),
      colorNameDraft: '',
      colorHexDraft: '#EAE5DC',
      isNew: Boolean(product.isNew),
      isBestseller: Boolean(product.isBestseller),
      isFeatured: Boolean(product.isFeatured),
    });
    setSlugTouched(true);
    setFormOpen(true);
  };

  const setName = (name: string) => {
    setForm((prev) => {
      const next = { ...prev, name };
      if (!slugTouched) {
        next.slug = uniqueSlug(
          name,
          products.filter((p) => p.id !== editingId).map((p) => p.slug)
        );
      }
      return next;
    });
  };

  const canAddMore = form.images.length < MAX_IMAGES;

  const addImageUrl = () => {
    const url = form.linkDraft.trim();
    if (!url) return;
    if (!canAddMore) {
      addToast('Image limit', `Maximum ${MAX_IMAGES} images per product`, 'info');
      return;
    }
    if (form.images.includes(url)) {
      addToast('Duplicate image', 'That image is already added', 'info');
      return;
    }
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, url].slice(0, MAX_IMAGES),
      linkDraft: '',
      imageSource: 'url',
    }));
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const remaining = MAX_IMAGES - form.images.length;
    if (remaining <= 0) {
      addToast('Image limit', `Maximum ${MAX_IMAGES} images per product`, 'info');
      return;
    }

    const files = Array.from(fileList).slice(0, remaining);
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        addToast('Invalid file', `${file.name} is not an image`, 'info');
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        addToast('Image too large', `${file.name} must be under ~900KB`, 'info');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        if (!result) return;
        setForm((prev) => {
          if (prev.images.length >= MAX_IMAGES || prev.images.includes(result)) return prev;
          return {
            ...prev,
            images: [...prev.images, result].slice(0, MAX_IMAGES),
            imageSource: 'file',
          };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const makeMainImage = (index: number) => {
    if (index === 0) return;
    setForm((prev) => {
      const next = [...prev.images];
      const [picked] = next.splice(index, 1);
      next.unshift(picked);
      return { ...prev, images: next };
    });
  };

  const addColor = () => {
    const name = form.colorNameDraft.trim();
    let hex = form.colorHexDraft.trim() || '#EAE5DC';
    if (!name) {
      addToast('Color name required', 'Enter a color name', 'info');
      return;
    }
    if (!hex.startsWith('#')) hex = `#${hex}`;
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      addToast('Invalid hex', 'Use a hex like #EAE5DC', 'info');
      return;
    }
    if (form.colors.length >= MAX_COLORS) {
      addToast('Color limit', `Maximum ${MAX_COLORS} colors`, 'info');
      return;
    }
    if (form.colors.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      addToast('Duplicate color', 'That color name already exists', 'info');
      return;
    }
    setForm((prev) => ({
      ...prev,
      colors: [...prev.colors, { name, hex }],
      colorNameDraft: '',
    }));
  };

  const removeColor = (index: number) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const buildProduct = (): Product | null => {
    const name = form.name.trim();
    const images = form.images.filter(Boolean).slice(0, MAX_IMAGES);
    const price = Number(form.price);
    if (!name || images.length === 0 || !Number.isFinite(price) || price < 0) {
      addToast('Missing fields', 'Name, price, and at least 1 image are required', 'info');
      return null;
    }
    if (!form.categorySlug) {
      addToast('Category required', 'Select a category for this product', 'info');
      return null;
    }

    const slug = uniqueSlug(
      form.slug || name,
      products.filter((p) => p.id !== editingId).map((p) => p.slug)
    );
    const purchaseRaw = form.purchasePrice.trim() ? Number(form.purchasePrice) : undefined;
    const purchasePrice = Number.isFinite(purchaseRaw) ? purchaseRaw : undefined;
    let compareAtPrice: number | undefined;
    if (form.onDiscount) {
      const compareAt = form.compareAtPrice.trim() ? Number(form.compareAtPrice) : undefined;
      if (!Number.isFinite(compareAt) || (compareAt as number) <= price) {
        addToast('Discount price', 'Original price must be higher than sell price', 'info');
        return null;
      }
      compareAtPrice = compareAt;
    }
    const colors =
      form.colors.length > 0 ? form.colors.slice(0, MAX_COLORS) : [{ name: 'Natural', hex: '#EAE5DC' }];

    return {
      id: editing?.id || `mb-${Date.now().toString(36)}`,
      slug: slugify(slug) || slug,
      name,
      description: form.description.trim() || name,
      price,
      purchasePrice,
      compareAtPrice,
      categorySlug: form.categorySlug,
      collectionSlugs: editing?.collectionSlugs?.length ? editing.collectionSlugs : ['living-room'],
      images,
      material: form.material.trim() || 'Artisanal Material',
      colors,
      dimensions: form.dimensions.trim() || 'See product details',
      stockStatus: form.stockStatus,
      isNew: form.isNew,
      isBestseller: form.isBestseller,
      isFeatured: form.isFeatured,
      rating: editing?.rating ?? 4.9,
      reviewCount: editing?.reviewCount ?? 0,
      careInstructions: editing?.careInstructions || 'Wipe with a soft dry cloth.',
      roomTypes: editing?.roomTypes?.length ? editing.roomTypes : ['living-room'],
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = buildProduct();
    if (!product) return;
    if (editing) updateProduct(product);
    else addProduct(product);
    closeFormModal();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
  };

  const categoryName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name || slug;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#292522] flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#C77F79]" />
            Products
          </h2>
          <p className="text-[11px] text-[#77716C] mt-0.5">
            {products.length} products · up to {MAX_IMAGES} images each (first is main)
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E9E3DE] divide-y divide-[#E9E3DE] overflow-hidden">
        {products.length === 0 && (
          <p className="p-4 text-xs text-[#77716C]">No products yet. Click Add Product to create one.</p>
        )}
        {products.map((p) => (
          <div key={p.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={p.images[0]}
                alt=""
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded object-cover border border-[#E9E3DE] shrink-0 bg-[#FAF8F5]"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-semibold text-[#292522] truncate">{p.name}</h4>
                  {p.compareAtPrice && p.compareAtPrice > p.price && (
                    <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#A84940]/10 text-[#A84940]">
                      Sale
                    </span>
                  )}
                  {p.isBestseller && (
                    <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#C77F79]/15 text-[#C77F79]">
                      Bestseller
                    </span>
                  )}
                  {p.isNew && (
                    <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#89947D]/15 text-[#5E6B56]">
                      New
                    </span>
                  )}
                  {p.isFeatured && (
                    <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#EFECE6] text-[#77716C]">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#77716C] truncate mt-0.5">
                  {categoryName(p.categorySlug)}
                  {' · Sell $'}
                  {p.price.toFixed(2)}
                  {p.compareAtPrice && p.compareAtPrice > p.price ? (
                    <>
                      {' '}
                      <span className="line-through text-[#A89F97]">${p.compareAtPrice.toFixed(2)}</span>
                    </>
                  ) : null}
                  {p.purchasePrice != null ? ` · Buy $${p.purchasePrice.toFixed(2)}` : ''}
                  {' · '}
                  {p.images.length} img
                  {' · '}
                  {p.colors?.length || 0} colors
                </p>
                {p.colors?.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5">
                    {p.colors.slice(0, 6).map((c) => (
                      <span
                        key={`${p.id}-${c.name}`}
                        title={c.name}
                        className="w-3.5 h-3.5 rounded-full border border-[#E9E3DE] shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                    {p.colors.length > 6 && (
                      <span className="text-[10px] text-[#A89F97]">+{p.colors.length - 6}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline text-[10px] font-medium text-[#89947D] capitalize">
                {p.stockStatus.replace('_', ' ')}
              </span>
              <button
                type="button"
                onClick={() => openEdit(p)}
                className="p-1.5 rounded border border-[#E9E3DE] text-[#77716C] hover:text-[#292522] hover:bg-[#FAF8F5] cursor-pointer"
                title="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(p)}
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
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#E9E3DE] shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#E9E3DE] px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#292522]">
                {editing ? 'Edit Product' : 'Add Product'}
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
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Name *</label>
                  <input
                    required
                    autoFocus
                    value={form.name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product name"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
                <div className="sm:col-span-2">
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
                  <p className="text-[10px] text-[#A89F97] mt-1">URL: /products/{form.slug || '…'}</p>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">
                    Purchase price
                    <span className="ml-1 font-normal text-[#A89F97]">(admin only)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.purchasePrice}
                    onChange={(e) => setForm((prev) => ({ ...prev, purchasePrice: e.target.value }))}
                    placeholder="What you paid"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">
                    Sell price *
                    <span className="ml-1 font-normal text-[#A89F97]">(website)</span>
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="Customer price"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2 rounded-lg border border-[#E9E3DE] bg-[#FAF8F5] p-3">
                  <label className="inline-flex items-center gap-2 text-[11px] text-[#292522] font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.onDiscount}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          onDiscount: e.target.checked,
                          compareAtPrice: e.target.checked ? prev.compareAtPrice : '',
                        }))
                      }
                      className="rounded border-[#E9E3DE]"
                    />
                    On discount / sale
                  </label>
                  {form.onDiscount ? (
                    <div>
                      <label className="block text-[11px] font-medium text-[#77716C] mb-1">
                        Original price (before discount)
                      </label>
                      <input
                        required={form.onDiscount}
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.compareAtPrice}
                        onChange={(e) => setForm((prev) => ({ ...prev, compareAtPrice: e.target.value }))}
                        placeholder="Higher than sell price"
                        className="w-full px-3 py-2 bg-white border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                      />
                      <p className="text-[10px] text-[#A89F97] mt-1">
                        Website shows sell price with original struck through.
                      </p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#A89F97]">
                      Turn on to mark this product as discounted on the storefront.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Category *</label>
                  <select
                    required
                    value={form.categorySlug}
                    onChange={(e) => setForm((prev) => ({ ...prev, categorySlug: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Stock</label>
                  <select
                    value={form.stockStatus}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, stockStatus: e.target.value as StockStatus }))
                    }
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  >
                    <option value="in_stock">In stock</option>
                    <option value="low_stock">Low stock</option>
                    <option value="out_of_stock">Out of stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Material</label>
                  <input
                    value={form.material}
                    onChange={(e) => setForm((prev) => ({ ...prev, material: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Dimensions</label>
                  <input
                    value={form.dimensions}
                    onChange={(e) => setForm((prev) => ({ ...prev, dimensions: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] resize-y"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-[#77716C]">
                      Images * ({form.images.length}/{MAX_IMAGES})
                    </span>
                    <div className="flex rounded-md border border-[#E9E3DE] overflow-hidden text-[11px]">
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, imageSource: 'url' }))}
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
                  <span className="text-[10px] text-[#A89F97]">First image = main</span>
                </div>

                {form.imageSource === 'url' ? (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={form.linkDraft}
                      onChange={(e) => setForm((prev) => ({ ...prev, linkDraft: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addImageUrl();
                        }
                      }}
                      placeholder="https://…"
                      disabled={!canAddMore}
                      className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={addImageUrl}
                      disabled={!canAddMore || !form.linkDraft.trim()}
                      className="px-3 py-2 bg-[#EFECE6] hover:bg-[#E9E3DE] text-[#292522] text-[11px] font-semibold rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={!canAddMore}
                    onChange={(e) => {
                      handleFiles(e.target.files);
                      e.target.value = '';
                    }}
                    className="w-full text-[11px] text-[#77716C] file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-[#EFECE6] file:text-[#292522] file:text-[11px] file:font-medium file:cursor-pointer disabled:opacity-50"
                  />
                )}

                {form.images.length > 0 ? (
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {form.images.map((src, index) => (
                      <div
                        key={`${src.slice(0, 48)}-${index}`}
                        className={`relative rounded-md overflow-hidden border bg-[#FAF8F5] aspect-square ${
                          index === 0 ? 'border-[#C77F79] ring-1 ring-[#C77F79]/40' : 'border-[#E9E3DE]'
                        }`}
                      >
                        <img
                          src={src}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {index === 0 && (
                          <span className="absolute left-1 top-1 text-[9px] font-semibold bg-[#292522] text-white px-1 py-0.5 rounded">
                            Main
                          </span>
                        )}
                        <div className="absolute inset-x-0 bottom-0 flex gap-0.5 p-0.5 bg-black/45">
                          {index !== 0 && (
                            <button
                              type="button"
                              onClick={() => makeMainImage(index)}
                              className="flex-1 p-1 text-white hover:bg-white/20 rounded cursor-pointer"
                              title="Set as main"
                            >
                              <Star className="w-3 h-3 mx-auto" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="flex-1 p-1 text-white hover:bg-white/20 rounded cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3 mx-auto" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-[#A89F97]">Add 1–{MAX_IMAGES} images. The first one is shown as the main product image.</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#77716C]">
                    Colors ({form.colors.length}/{MAX_COLORS})
                  </span>
                  <span className="text-[10px] text-[#A89F97]">Shown on product page swatches</span>
                </div>
                <div className="flex flex-wrap gap-2 items-end">
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[10px] text-[#A89F97] mb-1">Name</label>
                    <input
                      value={form.colorNameDraft}
                      onChange={(e) => setForm((prev) => ({ ...prev, colorNameDraft: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addColor();
                        }
                      }}
                      placeholder="Warm Cream"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#A89F97] mb-1">Hex</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={/^#[0-9A-Fa-f]{6}$/.test(form.colorHexDraft) ? form.colorHexDraft : '#EAE5DC'}
                        onChange={(e) => setForm((prev) => ({ ...prev, colorHexDraft: e.target.value }))}
                        className="w-9 h-9 p-0.5 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md cursor-pointer"
                      />
                      <input
                        value={form.colorHexDraft}
                        onChange={(e) => setForm((prev) => ({ ...prev, colorHexDraft: e.target.value }))}
                        placeholder="#EAE5DC"
                        className="w-[88px] px-2 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addColor}
                    disabled={form.colors.length >= MAX_COLORS}
                    className="px-3 py-2 bg-[#EFECE6] hover:bg-[#E9E3DE] text-[#292522] text-[11px] font-semibold rounded-md cursor-pointer disabled:opacity-50"
                  >
                    Add color
                  </button>
                </div>
                {form.colors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {form.colors.map((c, index) => (
                      <div
                        key={`${c.name}-${c.hex}-${index}`}
                        className="inline-flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-full border border-[#E9E3DE] bg-[#FAF8F5]"
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-[#E9E3DE]"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-[11px] text-[#292522]">{c.name}</span>
                        <button
                          type="button"
                          onClick={() => removeColor(index)}
                          className="p-0.5 text-[#A89F97] hover:text-[#A84940] cursor-pointer"
                          title="Remove color"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-[#A89F97]">
                    No colors yet — defaults to “Natural” if left empty.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                {(
                  [
                    ['isNew', 'New'],
                    ['isBestseller', 'Bestseller'],
                    ['isFeatured', 'Featured'],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="inline-flex items-center gap-1.5 text-[11px] text-[#77716C] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.checked }))}
                      className="rounded border-[#E9E3DE]"
                    />
                    {label}
                  </label>
                ))}
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
                  {editing ? 'Save Changes' : 'Add Product'}
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
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F1E5E1] flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4 text-[#A84940]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#292522]">Delete product?</h3>
                <p className="text-xs text-[#77716C] mt-1 leading-relaxed">
                  “{deleteTarget.name}” will be removed from the storefront.
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
