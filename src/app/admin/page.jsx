import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/data';
import { deleteProductAction } from './actions';
import LogoutButton from './LogoutButton';

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Produk</h1>
        <div className="flex space-x-4">
  <Link href="/" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
    Home
  </Link>
  <Link href="/admin/products/new" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
    Tambah Produk Baru
  </Link>
  <LogoutButton />
</div>

      </header>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gambar
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Produk
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Harga
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ketersediaan
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-sm text-gray-500 text-center">
                  Belum ada produk.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Image
                      src={product.image || '/images/no-image.png'}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="rounded object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Rp{product.price.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.availability}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Edit
                    </Link>
                    {/* <form action={deleteProductAction} method="POST" className="inline-block">
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-900"
                        onClick={(e) => {
                          if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Hapus
                      </button>
                    </form> */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
