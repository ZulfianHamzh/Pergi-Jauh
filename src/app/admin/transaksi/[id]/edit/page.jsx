// src/app/admin/transaksi/[id]/edit/page.jsx
import { redirect } from 'next/navigation';
import EditTransaksiClient from './EditTransaksiClient';
import { getTransaksiById } from '@/lib/data';

export default async function EditTransaksiPage({ params }) {
  // Jika Anda ingin menambahkan pengecekan autentikasi, tambahkan di sini
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) {
  //   redirect('/login');
  // }

  const transaksi = await getTransaksiById(params.id);

  if (!transaksi) {
    return <div>Transaksi tidak ditemukan</div>;
  }

  return <EditTransaksiClient transaksi={transaksi} />;
}