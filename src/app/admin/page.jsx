import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getEvents } from '@/lib/data';
import LogoutButton from './LogoutButton';

export default async function AdminPage() {
  const [products, events] = await Promise.all([getProducts(), getEvents()]);

  return (
    <div className="min-h-screen bg-[#679CBC] p-6">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md">
            Home
          </Link>
          <Link href="/admin/products/new" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
            Tambah Produk
          </Link>
          <Link href="/admin/events/new" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
            Tambah Event
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* PRODUK SECTION */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Daftar Produk</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ketersediaan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-sm text-center text-white">Belum ada produk.</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4">
                        <Image
                          src={product.image || '/images/no-image.png'}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="rounded object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Rp{product.price.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.availability}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <Link href={`/admin/products/${product.id}/edit`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* EVENT SECTION */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4">Daftar Event</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[400px] w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-sm text-center text-gray-500">Belum ada event.</td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4">
                        <Image
                          src={event.image || '/images/no-image.png'}
                          alt={event.title}
                          width={64}
                          height={64}
                          className="rounded object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs">{event.title}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <Link href={`/admin/events/${event.id}/edit`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
