// src/app/admin/page.jsx
// Ini adalah Server Component secara default

import { getProducts, getEvents, getProductCombinations } from '@/lib/data'; // Impor fungsi fetching
import AdminPageClient from './AdminPageClient'; // Impor Client Component

// Menetapkan halaman ini untuk selalu dirender secara dinamis di server
// Ini diperlukan karena halaman menggunakan `searchParams`, yang merupakan data dinamis.
export const dynamic = 'force-dynamic';

// Komponen utama (Sekarang Server Component)
export default async function AdminPage({ searchParams }) {
  // Ambil data di server menggunakan Promise.all untuk paralel fetching
  const [products, events, combinations] = await Promise.all([
    getProducts(),
    getEvents(),
    getProductCombinations(),
  ]);
  
  // Ekstrak properti sortBy dan sortOrder dari searchParams di Server Component
  // Tentukan nilai default jika tidak ada di URL
  const sortBy = searchParams.sort || '';
  const sortOrder = searchParams.order || 'asc';
  
  // Render Client Component dan kirim data serta properti yang sudah diekstrak
  return (
    <AdminPageClient
      initialProducts={products}
      initialEvents={events}
      initialCombinations={combinations}
      sortBy={sortBy} // Sekarang properti terpisah
      sortOrder={sortOrder} // Sekarang properti terpisah
    />
  );
}