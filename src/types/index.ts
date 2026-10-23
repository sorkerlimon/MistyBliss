export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ProductColor {
  name: string;
  hex: string;
}

export type RoomType = 'living-room' | 'bedroom' | 'dining-room' | 'entryway';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categorySlug: string;
  collectionSlugs: string[];
  images: string[];
  material: string;
  colors: ProductColor[];
  dimensions: string;
  stockStatus: StockStatus;
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  careInstructions: string;
  roomTypes: RoomType[];
}

export interface Category {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
}

export interface RoomCollection {
  slug: RoomType;
  name: string;
  description: string;
  image: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedColor?: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: number;
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'cod';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
}

export interface FilterState {
  category: string;
  room: string;
  minPrice: number;
  maxPrice: number;
  colors: string[];
  materials: string[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
  newArrivalsOnly: boolean;
  searchQuery: string;
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'name-asc';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'sale';
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  image?: string;
}

export interface Order {
  id: string;
  date: string;
  createdAt: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'card' | 'cod';
  shippingSpeed: 'standard' | 'express';
  notes?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  minSpend?: number;
  status: 'active' | 'inactive';
  usageCount: number;
  expiryDate: string;
}

