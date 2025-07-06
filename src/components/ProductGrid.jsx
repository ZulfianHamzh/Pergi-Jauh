// src/components/ProductGrid.jsx
'use client'; // Hanya jika ada interaktivitas

import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return <p className="text-gray-500">Tidak ada produk di kategori ini.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          imageSrc={product.image || '/images/no-image.png'}
          name={product.name}
          price={product.price}
          availability={product.availability}
        />
      ))}
    </div>
  );
}
