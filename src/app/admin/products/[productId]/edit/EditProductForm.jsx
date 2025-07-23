'use client';

import React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateProductAction, deleteProductAction } from '@/app/admin/actions';
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
      {pending ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
    </button>
  );
}

export default function EditProductForm({ product }) {
  const [state, formAction] = useActionState(updateProductAction, initialState);

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Edit Produk: {product.name}
      </h1>

      {/* FORM EDIT */}
      <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="currentImage" value={product.image} />

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nama Produk
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={product.name}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Harga (Rp)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            min="0"
            defaultValue={product.price}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700"
          />
        </div>

        <div>
          <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
            Ketersediaan
          </label>
          <select
            id="availability"
            name="availability"
            defaultValue={product.availability}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700"
          >
            <option value="Tersedia">Tersedia</option>
            <option value="Habis">Habis</option>
          </select>
        </div>

        <div>
  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
    Gambar Produk (Pilih Baru)
  </label>
  <input
    type="file"
    id="image"
    name="image"
    accept="image/*"
    className="mt-1 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
  />
  {product.image && (
    <img
      src={product.image}
      alt="Gambar saat ini"
      className="mt-2 w-32 h-32 object-cover rounded-md border"
    />
  )}
</div>


        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            Berat
          </label>
          <input
            type="text"
            id="weight"
            name="weight"
            defaultValue={product.weight}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700"
          />
        </div>

        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
            Kondisi
          </label>
          <input
            type="text"
            id="condition"
            name="condition"
            defaultValue={product.condition}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Kategori
          </label>
          <select
            id="category"
            name="category"
            defaultValue={product.category}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700"
          >
            <option value="Coffee">Coffee</option>
            <option value="Beverages">Beverages</option>
            <option value="Tea">Tea</option>
            <option value="Snack">Snack</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="productDetail" className="block text-sm font-medium text-gray-700">
            Detail Produk
          </label>
          <textarea
            id="productDetail"
            name="productDetail"
            rows="4"
            defaultValue={product.productDetail || ''}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700"
          />
        </div>

        {state?.message && (
          <p className="text-red-500 text-sm mt-2 md:col-span-2">{state.message}</p>
        )}

        <div className="md:col-span-2">
          <SubmitButton />
        </div>
      </form>

      {/* FORM HAPUS PRODUK */}
      <form action={deleteProductAction} className="mt-4">
        <input type="hidden" name="id" value={product.id} />
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
          onClick={(e) => {
            if (!confirm('Yakin ingin menghapus produk ini?')) {
              e.preventDefault();
            }
          }}
        >
          Hapus Produk
        </button>
      </form>

      <Link href="/admin" className="block text-center text-blue-600 hover:underline mt-4">
        Kembali ke Admin
      </Link>
    </div>
  );
}
