// app/admin/products/[productId]/edit/page.jsx
import { getProductById } from '@/lib/data';
import EditProductForm from './EditProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }) {
  const { productId } = params;
  const product = await getProductById(productId);

  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <EditProductForm product={product} />
    </div>
  );
}
