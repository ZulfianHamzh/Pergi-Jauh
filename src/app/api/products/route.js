// src/app/api/products/route.js
import { NextResponse } from 'next/server';
import { getProductListForSelector } from '@/lib/data'; // Kita akan buat fungsi ini

// Handler untuk GET request
export async function GET() {
  try {
    // Panggil fungsi dari lib/data.js untuk mendapatkan data
    const products = await getProductListForSelector();
    // Kembalikan data dalam format JSON
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("API Error fetching products:", error);
    // Kembalikan pesan error jika terjadi kesalahan
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// Non-aktifkan body parsing untuk route API ini jika tidak diperlukan
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };