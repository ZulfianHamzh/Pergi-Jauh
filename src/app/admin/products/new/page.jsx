'use client';

import React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createProductAction } from '../../actions'; // Sesuaikan path jika perlu
import Link from 'next/link';

const initialState = {
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
    >
      {pending ? 'Menyimpan...' : 'Tambah Produk'}
    </button>
  );
}

export default function NewProductPage() {
  const [state, formAction] = useActionState(createProductAction, initialState);

  return (
    <div className="min-h-screen bg-[#679CBC] p-6 flex justify-center items-start">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tambah Produk Baru</h1>

        <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Produk</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
            <input
              type="number"
              id="price"
              name="price"
              required
              min="0"
              step="any"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
          </div>

          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Ketersediaan</label>
            <select
              id="availability"
              name="availability"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            >
              <option value="Tersedia">Tersedia</option>
              <option value="Habis">Habis</option>
            </select>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Gambar Produk</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-gray-700"
            />
            <p className="mt-1 text-xs text-gray-500">Catatan: Untuk demo ini, gambar akan menggunakan placeholder.</p>
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Berat</label>
            <input
              type="text"
              id="weight"
              name="weight"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Kondisi</label>
            <input
              type="text"
              id="condition"
              name="condition"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategori</label>
            <select
              id="category"
              name="category"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              defaultValue=""
            >
              <option value="" disabled>Pilih Kategori</option>
              <option value="Coffe">Coffe</option>
              <option value="Non-Coffe">Non-Coffe</option>
              <option value="Foods">Foods</option>
              <option value="Snacks">Snacks</option>
              <option value="Bingung Mau Apa?">Paket</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="productDetail" className="block text-sm font-medium text-gray-700">Detail Produk</label>
            <textarea
              id="productDetail"
              name="productDetail"
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="Masukkan deskripsi detail produk di sini..."
            ></textarea>
          </div>

          {state?.message && (
            <p className="text-red-500 text-sm mt-2 md:col-span-2">{state.message}</p>
          )}

          <div className="md:col-span-2">
            <SubmitButton />
          </div>
        </form>

        <Link href="/admin" className="block text-center text-blue-600 hover:underline mt-6">
          Kembali ke Admin
        </Link>
      </div>
    </div>
  );
}
