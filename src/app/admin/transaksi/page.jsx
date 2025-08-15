// src/app/admin/transaksi/page.jsx

import { redirect } from 'next/navigation';
import TransaksiClient from './TransaksiClient';
import { getTransaksi, getTransaksiById } from '@/lib/data';

export default async function TransaksiPage() {
   const transaksiData = await getTransaksi();

  return <TransaksiClient initialTransaksi={transaksiData || []} />;
}