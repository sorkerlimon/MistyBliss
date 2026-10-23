import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { ShopProvider } from './context/ShopContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AccountModal } from './components/common/AccountModal';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { SearchPage } from './pages/SearchPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ShippingReturnsPage } from './pages/ShippingReturnsPage';
import { AdminPortal } from './pages/admin/AdminPortal';

const AppContent: React.FC = () => {
  const { route, navigate } = useRouter();

  if (route.type === 'admin') {
    return (
      <div className="min-h-screen bg-[#F6F4F0] text-[#292522]">
        <AdminPortal />
        <ToastContainer />
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (route.type) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'category':
        return <ShopPage initialCategory={route.slug} />;
      case 'collection':
        return <ShopPage initialCollection={route.slug} />;
      case 'product':
        return <ProductDetailsPage slug={route.slug || ''} />;
      case 'search':
        return <SearchPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'shipping-returns':
        return <ShippingReturnsPage />;
      default:
        return (
          <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
            <h1 className="text-3xl font-bold text-[#292522]">Page Not Found</h1>
            <p className="text-xs text-[#77716C]">
              We couldn't locate the décor page you were looking for.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-[#292522] text-white text-xs font-semibold rounded-md hover:bg-[#3D3834] transition-colors"
            >
              Return Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#292522]">
      <AnnouncementBar />
      <Header />
      <div className="flex-1">
        {renderCurrentPage()}
      </div>
      <Footer />

      {/* Global Overlays */}
      <CartDrawer />
      <AccountModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <ShopProvider>
        <AppContent />
      </ShopProvider>
    </RouterProvider>
  );
}
