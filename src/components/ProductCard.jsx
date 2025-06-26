// src/components/ProductCard.jsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ id, imageSrc, name, price, availability }) {
  return (
    <Link href={`/products/${id}`} passHref>
      <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
        <Image
          src={imageSrc}
          alt={name}
          width={300}
          height={192}
          className="w-full h-48 object-cover flex-shrink-0"
        />
        <div className="p-4 flex-grow">
          <h3 className="text-lg font-medium text-gray-800 mb-1">{name}</h3>
          <p className="text-gray-900 font-semibold mb-2">Rp{price.toLocaleString('id-ID')}</p>
          <p className="text-sm text-gray-500">{availability}</p>
        </div>
        <div className="px-4 pb-3 pt-1 text-center text-xs text-blue-600 font-medium border-t border-gray-100">
          Pilih Untuk Info Lebih Lanjut
        </div>
      </div>
    </Link>
  );
}