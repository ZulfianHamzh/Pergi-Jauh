// src/components/ProductCard.jsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link dari next/link

export default function ProductCard({ id, imageSrc, name, price, availability }) {
  return (
    // Bungkus seluruh card dengan Link
    <Link href={`/products/${id}`} passHref>
      <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200">
        <Image
          src={imageSrc}
          alt={name}
          width={300}
          height={192}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-1">{name}</h3>
          <p className="text-gray-900 font-semibold mb-2">Rp{price.toLocaleString('id-ID')}</p>
          <p className="text-sm text-gray-500">{availability}</p>
        </div>
        <div className="px-4 pb-3 pt-1 text-center text-xs text-blue-600 font-medium border-t border-gray-100"> {/* Tambahkan border-t untuk pemisah visual */}
          Pilih Untuk Info Lebih Lanjut
        </div>
      </div>
    </Link>
  );
}