// File: app/components/AuthProvider.tsx
'use client'; // Komponen ini harus berjalan di sisi klien

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// Tipe untuk props, menerima children
type Props = {
  children: React.ReactNode;
};

// Komponen wrapper untuk menyediakan konteks sesi ke seluruh aplikasi
export default function Providers({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
