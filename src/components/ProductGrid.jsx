import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const products = [
    {
      id: 1,
      name: 'Affogato',
      price: 25000,
      availability: 'Stok Tersedia',
      image: '/images/small_AFFOGATO.png', // Path relatif ke folder public
    },
    {
      id: 2,
      name: 'Americano',
      price: 25000,
      availability: 'Stok Tersedia',
      image: '/images/small_Americano.png', // Path relatif ke folder public
    },
    // Tambahkan lebih banyak produk di sini
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          imageSrc={product.image}
          name={product.name}
          price={product.price}
          availability={product.availability}
        />
      ))}
    </div>
  );
}