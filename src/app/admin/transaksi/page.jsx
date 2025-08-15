// src/app/admin/transaksi/page.jsx
import { getTransaksi } from '@/lib/data';
import TransaksiClient from './TransaksiClient';

// Supaya halaman selalu dirender secara dinamis
export const dynamic = 'force-dynamic';

export default async function TransaksiPage({ searchParams }) {
  // Ambil data transaksi di server
  const transaksiData = await getTransaksi();

  // Ambil sort dan order dari searchParams (default kalau tidak ada)
  const sortBy = searchParams.sort || 'created_at';
  const sortOrder = searchParams.order || 'desc';

  return (
    <TransaksiClient
      initialTransaksi={transaksiData || []}
      sortBy={sortBy}
      sortOrder={sortOrder}
    />
  );
}
