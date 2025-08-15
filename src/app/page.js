// src/app/page.jsx
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import Section1 from '@/components/Section1';
import Location from '@/components/Location';
// --- PERUBAHAN: Impor fungsi untuk mengambil kombinasi ---
import { getProducts, getEvents, getProductCombinations } from '@/lib/data';
// --- AKHIR PERUBAHAN ---
import EventModal from '@/components/EventModal';

export default async function Home() {
  // --- PERUBAHAN: Ambil data kombinasi secara paralel ---
  // Gunakan Promise.all untuk efisiensi
  const [products, events, combinations] = await Promise.all([
    getProducts(),
    getEvents(),
    getProductCombinations(), // Tambahkan ini
  ]);
  // --- AKHIR PERUBAHAN ---

  const categories = ['Coffee', 'NonCoffee', 'Foods', 'Snacks', 'Paket'];

  // Objek untuk memetakan nama kategori asli ke nama yang ingin ditampilkan di UI
  const categoryDisplayNames = {
    'Coffee': 'Kopi-kopian',
    'NonCoffee': 'Non Kopi',
    'Foods': 'Makanan',
    'Snacks': 'Camilan',
    'Paket': 'Paket Hemat',
  };

  const categorizedProducts = categories.map((category) => ({
    category,
    items: products.filter((p) => p.category?.toLowerCase() === category.toLowerCase()),
  }));

  return (
    <div className="min-h-screen bg-[#679CBC]">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Section1 />
        <EventModal />
        
        {/* --- PERUBAHAN: Tampilkan Produk Kombinasi (di atas kategori jika diinginkan) --- */}
        {/* Tampilkan hanya jika ada kombinasi */}
        {combinations && combinations.length > 0 && (
          <div className="mb-10">
            <h2 className="text-white text-xl font-semibold mb-4">Paket Istimewa</h2>
            {/* Asumsikan ProductGrid bisa menangani data kombinasi dengan struktur yang mirip */}
            {/* Anda mungkin perlu membuat komponen terpisah jika struktur data sangat berbeda */}
            <ProductGrid products={combinations} isCombination={true} /> {/* Tambahkan flag isCombination jika perlu */}
          </div>
        )}
        {/* --- AKHIR PERUBAHAN --- */}

        {/* Daftar Produk Berdasarkan Kategori */}
        {categorizedProducts.map(({ category, items }) => (
          <div key={category} className="mb-10">
            {/* Menggunakan categoryDisplayNames untuk menampilkan nama yang baru */}
            <h2 className="text-white text-xl font-semibold mb-4">{categoryDisplayNames[category]}</h2>
            <ProductGrid products={items} />
          </div>
        ))}
        <Location />
      </main>
      <div className='flex flex-col bg-black text-[bisque] text-center font-semibold p-4'>
        <p>Copyright Pergi Jauh©2025</p>
      </div>
    </div>
  );
}