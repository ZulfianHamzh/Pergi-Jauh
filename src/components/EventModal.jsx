'use client';

export default function EventModal({ isOpen, event, onClose }) {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white w-full h-full md:max-w-3xl md:h-auto md:rounded-lg shadow-xl overflow-y-auto relative">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-red-500"
        >
          &times;
        </button>

        <div className="p-6">
          {/* Judul */}
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            {event.title || 'Tanpa Judul'}
          </h2>

          {/* Gambar */}
          <div className="w-full h-60 md:h-80 overflow-hidden rounded-md mb-4">
            <img
              src={event.image || '/images/no-image.png'}
              alt={event.title || 'Gambar Event'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Deskripsi */}
          <p className="text-gray-700 whitespace-pre-line mb-6">
            {event.detailEvent || 'Tidak ada deskripsi.'}
          </p>

          {/* Link Pendaftaran */}
          {event.linkPendaftaran && (
            <div className="text-center mt-6">
              <a
                href={event.linkPendaftaran}
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
  );
}
