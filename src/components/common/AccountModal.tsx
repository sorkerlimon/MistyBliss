import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { useRouter } from '../../context/RouterContext';
import { X, User, Package, MapPin, Heart, LogOut, Check } from 'lucide-react';

export const AccountModal: React.FC = () => {
  const { isAccountModalOpen, closeAccountModal, wishlistCount } = useShop();
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('orders');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isAccountModalOpen) return null;

  const mockOrders = [
    {
      id: 'MB-8921',
      date: 'Oct 14, 2026',
      status: 'Delivered',
      items: 'Sculptural Fluted Stoneware Vase, Belgian Linen Cushion',
      total: 116.0,
    },
    {
      id: 'MB-8734',
      date: 'Sep 29, 2026',
      status: 'Delivered',
      items: 'Aurelia Fluted Linen Table Lamp',
      total: 135.0,
    },
  ];

  const handleCopy = (id: string) => {
    navigator.clipboard?.writeText?.(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={closeAccountModal} />
      
      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl border border-[#E9E3DE] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E9E3DE] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F1E5E1] flex items-center justify-center text-[#C77F79]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#292522]">Customer Account</h3>
              <p className="text-[11px] text-[#77716C]">Elena Rostova · elena.rostova@example.com</p>
            </div>
          </div>
          <button
            onClick={closeAccountModal}
            className="p-1.5 text-[#77716C] hover:text-[#292522] rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#E9E3DE] text-xs font-medium px-4 bg-white">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'orders'
                ? 'border-[#C77F79] text-[#292522] font-semibold'
                : 'border-transparent text-[#77716C] hover:text-[#292522]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders ({mockOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'addresses'
                ? 'border-[#C77F79] text-[#292522] font-semibold'
                : 'border-transparent text-[#77716C] hover:text-[#292522]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Saved Addresses</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'profile'
                ? 'border-[#C77F79] text-[#292522] font-semibold'
                : 'border-transparent text-[#77716C] hover:text-[#292522]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 max-h-[380px] overflow-y-auto">
          {activeTab === 'orders' && (
            <div className="space-y-3">
              <p className="text-xs text-[#77716C] mb-2">Track your past purchases and delivery history.</p>
              {mockOrders.map((ord) => (
                <div key={ord.id} className="p-3 rounded-lg border border-[#E9E3DE] bg-[#FAF8F5] text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#292522]">Order #{ord.id}</span>
                      <button
                        onClick={() => handleCopy(ord.id)}
                        className="text-[10px] text-[#77716C] hover:text-[#292522] underline"
                      >
                        {copiedId === ord.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <span className="bg-[#89947D]/15 text-[#5E6B56] px-2 py-0.5 rounded text-[10px] font-semibold">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-[#77716C] text-[11px]">{ord.items}</p>
                  <div className="flex justify-between items-center pt-1 border-t border-[#E9E3DE]/60 text-[11px]">
                    <span className="text-[#77716C]">{ord.date}</span>
                    <span className="font-semibold text-[#292522]">${ord.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-[#C77F79] bg-[#FAF8F5]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[#292522]">Default Delivery Address</span>
                  <span className="text-[10px] bg-[#C77F79]/15 text-[#C77F79] px-1.5 py-0.5 rounded font-medium">Default</span>
                </div>
                <p className="text-[#292522]">Elena Rostova</p>
                <p className="text-[#77716C]">742 Evergreen Terrace, Apt 3B</p>
                <p className="text-[#77716C]">Portland, OR 97201</p>
                <p className="text-[#77716C] mt-1">+1 (503) 555-0192</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#77716C]">Full Name</label>
                <input
                  type="text"
                  readOnly
                  value="Elena Rostova"
                  className="w-full px-3 py-1.5 rounded border border-[#E9E3DE] bg-[#FAF8F5] text-[#292522]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#77716C]">Email Address</label>
                <input
                  type="email"
                  readOnly
                  value="elena.rostova@example.com"
                  className="w-full px-3 py-1.5 rounded border border-[#E9E3DE] bg-[#FAF8F5] text-[#292522]"
                />
              </div>
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => {
                    closeAccountModal();
                    navigate('/wishlist');
                  }}
                  className="text-xs text-[#C77F79] font-medium hover:underline flex items-center gap-1"
                >
                  <Heart className="w-3.5 h-3.5" />
                  View Wishlist ({wishlistCount} items)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FAF8F5] border-t border-[#E9E3DE] flex justify-between items-center">
          <button
            onClick={() => {
              closeAccountModal();
              navigate('/admin');
            }}
            className="text-xs text-[#C77F79] hover:underline flex items-center gap-1 font-medium"
          >
            Switch to Admin Panel →
          </button>
          <button
            onClick={closeAccountModal}
            className="px-4 py-1.5 text-xs font-semibold bg-[#292522] text-white rounded hover:bg-[#3D3834] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
