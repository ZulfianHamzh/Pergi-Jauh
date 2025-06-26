import React from 'react';
import Image from 'next/image';

export default function ProductCard({ imageSrc, name, price, availability }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image
        src={imageSrc}
        alt={name}
        width={300} // Sesuaikan lebar yang sesuai dengan desain
        height={192} // Sesuaikan tinggi (h-48 = 192px)
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-1">{name}</h3>
        <p className="text-gray-900 font-semibold mb-2">Rp{price.toLocaleString('id-ID')}</p>
        <p className="text-sm text-gray-500">{availability}</p>
      </div>
    </div>
  );
}