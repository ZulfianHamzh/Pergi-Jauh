'use client';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { createEventAction } from '../../actions';
import Link from 'next/link';

const initialState = { message: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
      disabled={pending}
    >
      {pending ? 'Menyimpan...' : 'Tambah Event'}
    </button>
  );
}

export default function NewEventPage() {
  const [state, formAction] = useActionState(createEventAction, initialState);

  return (
    <div className="min-h-screen flex justify-center items-start bg-[#679CBC] p-6">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Tambah Event Baru</h1>

        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Event</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700"
            />
          </div>

          <div>
            <label htmlFor="detailEvent" className="block text-sm font-medium text-gray-700">Detail Event</label>
            <textarea
              id="detailEvent"
              name="detailEvent"
              rows="4"
              placeholder="Masukkan informasi detail, seperti link pendaftaran atau deskripsi singkat event..."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700"
            ></textarea>
          </div>
          <div>
  <label htmlFor="linkPendaftaran" className="block text-sm font-medium text-gray-700">Link Pendaftaran</label>
  <input
    type="url"
    id="linkPendaftaran"
    name="linkPendaftaran"
    placeholder="https://..."
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700"
  />
</div>


          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Gambar Event</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-gray-700"
            />
            <p className="mt-1 text-xs text-gray-500">Maksimal Ukuran Gambar 1MB.</p>
          </div>

          {state?.message && <p className="text-red-500 text-sm">{state.message}</p>}

          <SubmitButton />

          <Link href="/admin" className="block text-center text-blue-600 hover:underline mt-4">
            Kembali ke Admin
          </Link>
        </form>
      </div>
    </div>
  );
}
