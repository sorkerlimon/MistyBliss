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
  /** Customer-facing sell price (shown on storefront). */
  price: number;
  /** Internal purchase / cost price (admin only, never shown on storefront). */
  purchasePrice?: number;
  /** Original/list price when product is on discount (strikethrough on storefront). */
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

export type CategoryImageSource = 'url' | 'file';

export interface Category {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
  imageSource: CategoryImageSource;
  /** Display order on the storefront (1 = first). */
  sortOrder?: number;
}

export interface RoomCollection {
  id: string;
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
  paymentMethod: 'card' | 'cod' | 'bkash';
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
  paymentMethod: 'card' | 'cod' | 'bkash';
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

/** Delivery zone shown at checkout when delivery charges are enabled. */
export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  active: boolean;
}

/** Store-wide delivery + tax settings managed in admin. */
export interface ShopSettings {
  deliveryEnabled: boolean;
  deliveryZones: DeliveryZone[];
  taxEnabled: boolean;
  /** Sales tax as a percent of cart subtotal (e.g. 5 = 5%). */
  taxPercent: number;
}

export const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  deliveryEnabled: true,
  deliveryZones: [
    { id: 'zone-dhaka-city', name: 'Dhaka City', fee: 85, active: true },
    { id: 'zone-outside-dhaka', name: 'Outside Dhaka', fee: 180, active: true },
  ],
  taxEnabled: false,
  taxPercent: 5,
};

export type BlogCategory =
  | 'Studio Craft'
  | 'Interior Styling'
  | 'Material Studies'
  | 'Botanical Notes'
  | string;

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string[];
  category: BlogCategory;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedDate: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  featured?: boolean;
  relatedProductSlugs?: string[];
}

export const BLOG_CATEGORIES = [
  'Studio Craft',
  'Interior Styling',
  'Material Studies',
  'Botanical Notes',
] as const;

export interface NewsletterSubscriber {
  id: number | string;
  email: string;
  source: string;
  createdAt: string;
}

