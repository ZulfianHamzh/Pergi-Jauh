"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateTransaksiAction } from '@/app/admin/actions';
import { useRef } from 'react';

// A simple custom message box component to replace the native `alert()`
const MessageBox = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const ringColor = type === 'success' ? 'ring-green-500' : 'ring-red-500';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className={`p-6 rounded-lg shadow-xl ${bgColor} max-w-sm w-full mx-4`}>
        <div className="flex justify-between items-start">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
          <button onClick={onClose} className={`text-gray-400 hover:text-gray-600 ml-4`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Utility function to format currency
const formatCurrency = (amount) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num) || num === null || num === undefined) return 'Rp0';
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(num);
};

// Utility function to convert a value to a number
const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'string') return parseFloat(value) || 0;
  if (typeof value === 'number') return value;
  return 0;
};

export default function EditTransaksiClient({ transaksi }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    atas_nama: transaksi.atas_nama,
    notes: transaksi.notes || '',
    pembayaran: transaksi.pembayaran,
    status: transaksi.status,
    discount: toNumber(transaksi.discount || 0)
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // State to hold the dynamically calculated total and subtotal
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  // Effect to calculate subtotal and total whenever the component mounts or discount changes
  useEffect(() => {
    // Calculate the subtotal by summing up the prices of all menu items
    const calculatedSubtotal = transaksi.Menu_Transaksi.reduce((sum, item) => {
      return sum + (toNumber(item.harga_menu) * item.jumlah_menu);
    }, 0);
    setSubtotal(calculatedSubtotal);

    // Calculate the total by subtracting the discount from the subtotal
    const calculatedTotal = calculatedSubtotal - toNumber(formData.discount);
    setTotal(calculatedTotal);
  }, [formData.discount, transaksi.Menu_Transaksi]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discount' ? toNumber(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create the payload for the update request, including the newly calculated total
      const updatePayload = {
        ...formData,
        total: total // Use the dynamically calculated total
      };

      const result = await updateTransaksiAction(transaksi.id_transaksi, updatePayload);
      
      if (result) {
        setMessage({ text: 'Transaksi berhasil diperbarui.', type: 'success' });
        // Delay the navigation to allow the user to see the success message
        setTimeout(() => {
          router.push('/admin/transaksi');
          router.refresh();
        }, 1500); 
      } else {
        throw new Error('Gagal memperbarui transaksi');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      setMessage({ text: `Gagal memperbarui transaksi: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-inter antialiased">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Edit Transaksi</h1>
          <p className="text-gray-500 mt-1">ID: {transaksi.id_transaksi}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="col-span-1">
                <label htmlFor="atas_nama" className="block text-sm font-semibold text-gray-700 mb-2">
                  Atas Nama
                </label>
                <input
                  type="text"
                  id="atas_nama"
                  name="atas_nama"
                  value={formData.atas_nama}
                  onChange={handleChange}
                  className="w-full text-black rounded-lg border border-gray-300 shadow-sm px-4 py-2 focus-visible:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  required
                />
              </div>

              <div className="col-span-1">
                <label htmlFor="pembayaran" className="block text-sm font-semibold text-gray-700 mb-2">
                  Metode Pembayaran
                </label>
                <select
                  id="pembayaran"
                  name="pembayaran"
                  value={formData.pembayaran}
                  onChange={handleChange}
                  className="w-full text-black rounded-lg border border-gray-300 shadow-sm px-4 py-2 focus-visible:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  required
                >
                  <option value="QRIS">QRIS</option>
                  <option value="Tunai">Tunai</option>
                </select>
              </div>

              <div className="col-span-1">
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full text-black rounded-lg border border-gray-300 shadow-sm px-4 py-2 focus-visible:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="Selesai">Selesai</option>
                  {/* <option value="Pending">Pending</option> */}
                  <option value="Batal">Batal</option>
                </select>
              </div>

              <div className="col-span-1">
                <label htmlFor="discount" className="block text-sm font-semibold text-gray-700 mb-2">
                  Diskon (Rp)
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full text-black rounded-lg border border-gray-300 shadow-sm px-4 py-2 focus-visible:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  min="0"
                  step="100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                Catatan
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full text-black rounded-lg border border-gray-300 shadow-sm px-4 py-2 focus-visible:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Detail Pesanan</h3>
              <div className="space-y-4">
                {transaksi.Menu_Transaksi && transaksi.Menu_Transaksi.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-black">{item.nama_menu}</p>
                      <p className="text-sm text-black">Jumlah: {item.jumlah_menu}</p>
                    </div>
                    <p className="font-semibold text-black">{formatCurrency(toNumber(item.harga_menu) * item.jumlah_menu)}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-black">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {toNumber(formData.discount) > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Diskon:</span>
                    <span className="font-medium">-{formatCurrency(formData.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t border-dashed border-gray-300">
                  <span className="text-black">Total Akhir:</span>
                  <span className="text-green-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Conditionally render the message box */}
      {message && <MessageBox message={message.text} type={message.type} onClose={() => setMessage(null)} />}
    </div>
  );
}
