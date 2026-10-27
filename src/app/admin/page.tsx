import React from 'react';
import { AdminPortal } from '../../views/admin/AdminPortal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Operations Portal | Misty Bliss',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminPortal />;
}
