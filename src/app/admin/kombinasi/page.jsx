// src/app/admin/kombinasi/page.jsx
import Link from 'next/link';
import { getProductCombinations } from '@/lib/data';
import { deleteProductCombinationAction } from '@/app/admin/actions'; // Sesuaikan path

export default async function ProductCombinationsPage() {
  const combinations = await getProductCombinations();

  return (
    <div className="min-h-screen bg-[#679CBC] p-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">Produk Kombinasi</h1>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md">
            Kembali ke Admin
          </Link>
          <Link href="/admin/kombinasi/new" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
            Tambah Kombinasi
          </Link>
        </div>
      </header>

      <section>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Kombinasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Komponen</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {combinations.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-sm text-center text-gray-500">Belum ada kombinasi produk.</td>
                  </tr>
                ) : (
                  combinations.map((combo) => (
                    <tr key={combo.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{combo.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Rp{combo.price.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <ul className="list-disc pl-5">
                          {combo.items.map(item => (
                            <li key={`${combo.id}-${item.productId}`}>
                              {item.product?.name || 'Produk Tidak Ditemukan'} (x{item.quantity})
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <Link href={`/admin/kombinasi/${combo.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</Link>
                        <form action={deleteProductCombinationAction} className="inline">
                            <input type="hidden" name="id" value={combo.id} />
                            <button
                                type="submit"
                                className="text-red-600 hover:text-red-900"
                                onClick={(e) => {
                                    if (!confirm('Yakin hapus kombinasi ini?')) e.preventDefault();
                                }}
                            >
                                Hapus
                            </button>
                        </form>
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