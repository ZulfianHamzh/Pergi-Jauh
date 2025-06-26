import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import Section1 from '@/components/Section1';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        </div>
        <Section1 />
        <h2 className="text-black text-xl font-semibold mb-4">Coffee</h2>
        <ProductGrid />
      </main>
    </div>
  );
}