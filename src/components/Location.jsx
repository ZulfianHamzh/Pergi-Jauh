'use client';
import React from 'react';

export default function Location() {
  return (
    <div className="flex flex-col items-center justify-center min-h-fit rounded-xl inset-0 bg-gradient-to-b from-white to-gray-100 p-2">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 mt-6">Lokasi Warkop Kami</h2>
      
      <div className="w-full max-w-3xl rounded-[24px] bg-white/10 backdrop-blur-lg border border-white/30 shadow-lg overflow-hidden">
        <iframe
          title="Lokasi Warkop"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247.85111255288675!2d106.9766504821177!3d-6.313834289011009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6993456f8981b7%3A0xf67d690fc57b4ffb!2sWarkop%20Masa%20Gitu%20%3F!5e0!3m2!1sid!2sid!4v1751450380294!5m2!1sid!2sid"
          width="100%"
          height="400"
          allowFullScreen=""
          loading="lazy"
          className="border-none"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
