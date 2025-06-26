import React from 'react';
import Image from 'next/image'; // Menggunakan komponen Image dari Next.js


export default function Header() {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Image
            src="/images/PjLogo.png" // Path relatif ke folder public
            alt="PJ Logo"
            width={32} // Sesuaikan lebar
            height={32} // Sesuaikan tinggi
            className="h-8 w-auto" // Tailwind untuk tinggi dan lebar otomatis
          />
          <span className="font-bold text-lg text-gray-700">Pergi Jauh</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-800">
          <Image
            src="/images/whatsapp.png" // Path relatif ke folder public
            alt="WhatsApp"
            width={32} // Sesuaikan lebar
            height={32} // Sesuaikan tinggi
            className="h-8 w-auto" // Tailwind untuk tinggi dan lebar otomatis
          />
          </button>
        </div>
      </div>
    </header>
  );
}