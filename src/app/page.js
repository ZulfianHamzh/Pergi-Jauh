// app/page.jsx atau src/app/page.jsx
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import Section1 from '@/components/Section1';
import { getProducts, getEvents } from '@/lib/data'; // Pastikan ini benar

export default async function Home() {
  const products = await getProducts();

  const categories = ['Coffee', 'Beverages', 'Tea', 'Snack'];

  const categorizedProducts = categories.map((category) => ({
    category,
    items: products.filter((p) => p.category?.toLowerCase() === category.toLowerCase()),
  }));



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-1 py-6">
        <Section1 />
        {categorizedProducts.map(({ category, items }) => (
          <div key={category} className="mb-10">
            <h2 className="text-black text-xl font-semibold mb-4">{category}</h2>
            <ProductGrid products={items} />
          </div>
        ))}
      </main>
    </div>
  );
}
