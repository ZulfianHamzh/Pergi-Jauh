// app/page.jsx atau src/app/page.jsx
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import Section1 from '@/components/Section1';
import Location from '@/components/Location';
import { getProducts, getEvents } from '@/lib/data'; // Pastikan ini benar
import EventModal from '@/components/EventModal';

export default async function Home() {
  const products = await getProducts();

  const categories = ['Coffee', 'Beverages', 'Tea', 'Snack'];

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
        {categorizedProducts.map(({ category, items }) => (
          <div key={category} className="mb-10">
            <h2 className="text-white text-xl font-semibold mb-4">{category}</h2>
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
