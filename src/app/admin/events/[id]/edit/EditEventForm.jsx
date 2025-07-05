'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateEventAction, deleteEventAction } from '@/app/admin/actions';
import Link from 'next/link';
import Image from 'next/image';

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

export default function EditEventForm({ event }) {
  const [state, formAction] = useActionState(updateEventAction, initialState);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Event: {event.title}</h1>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={event.id} />
        <input type="hidden" name="currentImage" value={event.image} />

        {/* Judul Event */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Event</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={event.title}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Detail Event */}
        <div>
          <label htmlFor="detailEvent" className="block text-sm font-medium text-gray-700">Detail Event</label>
          <textarea
            id="detailEvent"
            name="detailEvent"
            required
            rows={4}
            defaultValue={event.detailEvent || ''}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Link Pendaftaran */}
        <div>
          <label htmlFor="linkPendaftaran" className="block text-sm font-medium text-gray-700">Link Pendaftaran</label>
          <input
            type="url"
            id="linkPendaftaran"
            name="linkPendaftaran"
            placeholder="https://contoh.com/daftar"
            defaultValue={event.linkPendaftaran || ''}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Gambar */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Gambar Event (Pilih Baru)</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {event.image && (
            <div className="mt-2">
              <Image
                src={event.image}
                alt={event.title}
                width={100}
                height={100}
                className="rounded"
              />
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500">Maksimal Ukuran Gambar 1MB.</p>
        </div>

        {state?.message && <p className="text-red-500 text-sm mt-2">{state.message}</p>}

        <SubmitButton />
      </form>

      {/* Tombol Hapus Event */}
      <form action={deleteEventAction} className="mt-4">
        <input type="hidden" name="id" value={event.id} />
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
          onClick={(e) => {
            if (!confirm('Yakin ingin menghapus event ini?')) {
              e.preventDefault();
            }
          }}
        >
          Hapus Event
        </button>
      </form>

      <Link href="/admin" className="block text-center text-blue-600 hover:underline mt-6">
        Kembali ke Admin
      </Link>
    </div>
  );
}
