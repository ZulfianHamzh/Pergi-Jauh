'use client';

import { useState } from 'react';
import Carousel from './Carousel';

export default function CarouselClientWrapper({ items }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const withClickItems = items.map((item) => ({
    ...item,
    onClick: () => setSelectedEvent(item),
  }));

  return (
    <>
      {/* MODAL (fullscreen di luar carousel) */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl relative mx-4">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-3xl font-bold text-gray-600 hover:text-red-500"
            >
              &times;
            </button>

            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                {selectedEvent.title || 'Tanpa Judul'}
              </h2>

              <div className="w-full h-60 md:h-80 overflow-hidden rounded-md">
                <img
                  src={selectedEvent.image || '/images/no-image.png'}
                  alt={selectedEvent.title || 'Gambar Event'}
                  className="w-fit h-fit object-cover rounded-xl"
                />
              </div>
                <h2 className="text-2xl mb-1 font-bold text-center text-gray-800"> Tentang Event</h2>
              <p className="bg-gray-200 p-4 rounded-xl text-gray-700 whitespace-pre-line mb-6">
                {selectedEvent.detailEvent || 'Tidak ada deskripsi.'}
              </p>

              {selectedEvent.linkPendaftaran && (
                <div className="text-center">
                  <a
                    href={selectedEvent.linkPendaftaran}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
                  >
                    Daftar Sekarang
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CAROUSEL */}
      <div className="flex flex-col items-center relative z-10">
        <Carousel
          items={withClickItems}
          baseWidth={450}
          autoplay={true}
          autoplayDelay={4000}
          pauseOnHover={true}
          loop={true}
          round={false}
        />
      </div>
    </>
  );
}
