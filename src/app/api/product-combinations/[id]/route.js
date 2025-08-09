// src/app/api/product-combinations/[id]/route.js
import { NextResponse } from 'next/server';
import { getProductCombinationById } from '@/lib/data'; // Fungsi yang sudah ada di lib/data.js

// Handler untuk GET request berdasarkan ID
export async function GET(request, { params }) {
  const { id } = params;

  // Validasi ID
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    // Panggil fungsi dari lib/data.js
    const combination = await getProductCombinationById(id);
    
    // Cek jika data tidak ditemukan
    if (!combination) {
      return NextResponse.json({ error: "Combination not found" }, { status: 404 });
    }
    
    // Kembalikan data kombinasi
    return NextResponse.json({ combination }, { status: 200 });
  } catch (error) {
    console.error(`API Error fetching product combination ${id}:`, error);
    // Kembalikan pesan error umum
    return NextResponse.json({ error: "Failed to fetch product combination" }, { status: 500 });
  }
}