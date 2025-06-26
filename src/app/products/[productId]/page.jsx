// src/app/products/[productId]/page.jsx
import Image from 'next/image';
import { notFound } from 'next/navigation'; // Untuk menampilkan 404 jika produk tidak ditemukan

// Data dummy produk (sebaiknya diambil dari database/API sungguhan)
const productsData = [
  {
    id: '1',
    name: 'Affogato',
    price: 25000,
    availability: 'Stok Tersedia',
    image: '/images/affogato.png',
    storeName: 'HAKKEN',
    storeLocation: 'Kota Bekasi',
    weight: '100 gram',
    condition: 'Baru',
    category: 'Coffee',
  },
  {
    id: '2',
    name: 'Americano',
    price: 25000,
    availability: 'Stok Tersedia',
    image: '/images/americano.png',
    storeName: 'HAKKEN',
    storeLocation: 'Kota Bekasi',
    weight: '100 gram',
    condition: 'Baru',
    category: 'Coffee',
  },
  // Tambahkan produk lain di sini
];

// Fungsi untuk mengambil data produk berdasarkan ID (simulasi API call)
async function getProductById(id) {
  // Dalam aplikasi nyata, Anda akan melakukan fetch() ke API di sini
  // await new Promise(resolve => setTimeout(resolve, 500)); // Simulasi delay jaringan
  const product = productsData.find((p) => p.id === id);
  return product;
}

export default async function ProductDetailPage({ params }) {
  const { productId } = params; // Ambil productId dari URL

  const product = await getProductById(productId);

  if (!product) {
    notFound(); // Menampilkan halaman 404 jika produk tidak ditemukan
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header Statis atau bisa disesuaikan */}
      <header className="bg-white shadow-sm py-4 mb-6">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            {/* Kembali ke halaman sebelumnya - bisa pakai Link atau useRouter.back() */}
            {/* Menggunakan a tag biasa untuk navigasi kembali yang sederhana */}
            <a href="/" className="text-gray-600 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <span className="font-bold text-lg text-gray-700">{product.name}</span>
          </div>
          <button className="text-gray-600 hover:text-gray-800">
            {/* Share Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.882 13.118 9 12.842 9 12.5c0-.342-.118-.618-.316-.842l-4.708-4.708a1 1 0 010-1.414l.707-.707a1 1 0 011.414 0l4.708 4.708c.224.198.5.316.842.316s.618-.118.842-.316l4.708-4.708a1 1 0 011.414 0l.707.707a1 1 0 010 1.414l-4.708 4.708c-.198.224-.316.5-.316.842s.118.618.316.842l4.708 4.708a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414 0l-4.708-4.708c-.224-.198-.5-.316-.842-.316s-.618.118-.842.316l-4.708 4.708a1 1 0 01-1.414 0l-.707-.707a1 1 0 010-1.414l4.708-4.708z" />
            </svg>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4">
        {/* Gambar Produk */}
        <div className="bg-white rounded-lg shadow-md mb-4 flex justify-center items-center overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={500} // Sesuaikan lebar yang lebih besar untuk detail
            height={500} // Sesuaikan tinggi yang lebih besar untuk detail
            className="w-full h-auto object-contain max-h-[400px] sm:max-h-[500px]" // Sesuaikan tinggi maksimum
          />
        </div>


        {/* Nama Produk dan Harga */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-xl font-semibold text-gray-900 mt-2">
            Rp{product.price.toLocaleString('id-ID')}{' '}
            <span className="text-sm text-gray-500 font-normal ml-2">{product.availability}</span>
          </p>
        </div>

        {/* Detail Produk */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail Produk</h2>
          <div className="grid grid-cols-2 gap-y-2 text-gray-700">
            <div>Berat</div>
            <div className="font-medium text-right">{product.weight}</div>

            <div>Kondisi</div>
            <div className="font-medium text-right">{product.condition}</div>

            <div>Kategori</div>
            <div className="font-medium text-right">{product.category}</div>
          </div>
        </div>

        {/* Anda bisa menambahkan bagian lain seperti Deskripsi, Review, dll. */}
      </div>
    </div>
  );
}

// Untuk generate static params di build time (penting untuk SSG jika Anda menggunakannya)
export async function generateStaticParams() {
  // Dalam aplikasi nyata, Anda akan mengambil semua ID produk dari API/database
  const products = productsData; // Menggunakan data dummy kita
  return products.map((product) => ({
    productId: product.id,
  }));
}