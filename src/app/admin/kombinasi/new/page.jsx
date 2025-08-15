// src/app/admin/kombinasi/new/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createProductCombinationAction } from "@/app/admin/actions"; // Pastikan path ini benar
import Link from "next/link";

// Ikon untuk tombol hapus
const XIcon = () => (
  <svg
    className="h-4 w-4 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function NewProductCombinationPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gunakan useActionState dengan wrapper untuk menambahkan data tambahan
  const [state, formAction] = useActionState(
    async (prevState, formData) => {
      // Modifikasi formData: tambahkan selectedProducts sebagai JSON string
      formData.append("selectedProducts", JSON.stringify(selectedProducts));
      // Panggil action asli. File gambar akan ditangani oleh action secara otomatis.
      return createProductCombinationAction(prevState, formData);
    },
    { message: null }
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/products");

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        console.error("Gagal mengambil daftar produk:", err);
        setError(err.message || "Gagal memuat daftar produk.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = (product) => {
    if (product && !selectedProducts.some((sp) => sp.id === product.id)) {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((sp) => sp.id !== productId));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity) && quantity > 0) {
      setSelectedProducts(
        selectedProducts.map((sp) =>
          sp.id === productId ? { ...sp, quantity: quantity } : sp
        )
      );
    }
  };

  // State untuk form submission
  const isFormValid =
    selectedProducts.length > 0 &&
    newProductName.trim() !== "" &&
    newProductPrice.trim() !== "" &&
    !isNaN(newProductPrice) &&
    parseFloat(newProductPrice) > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#679CBC] p-6 flex items-center justify-center">
        <div className="text-white text-xl">Memuat daftar produk...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#679CBC] p-6 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#679CBC] p-6 font-inter">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          Tambah Produk Kombinasi Baru
        </h1>
      </header>

      <div className="bg-white shadow-md rounded-lg p-6 md:p-8 max-w-5xl mx-auto">
        {state?.message && (
          <div
            className={`p-3 mb-4 text-sm rounded ${
              state.message.includes("Failed") ||
              state.message.includes("Missing") ||
              state.message.includes("Invalid")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {state.message}
          </div>
        )}

        {/* Form menggunakan grid untuk tata letak yang lebih rapi */}
        <form
          action={formAction}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Nama Kombinasi
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Harga Kombinasi (Rp)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              step="1"
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
            />
          </div>
          {/* --- PERUBAHAN: Input File Gambar --- */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Gambar Kombinasi
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              // Tidak perlu state lokal untuk file, karena akan diambil dari formData di action
              className="w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-purple-50 file:text-purple-700
                        hover:file:bg-purple-100
                        border border-gray-300 rounded-md shadow-sm
                        focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Catatan: Untuk demo ini, gambar akan menggunakan placeholder.
              {/* Jika logika unggahan gambar sudah diimplementasi, Anda bisa menghapus catatan ini */}
            </p>
          </div>
          {/* --- AKHIR PERUBAHAN --- */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Kategori
            </label>
            <select
              id="category"
              name="category" // Pastikan name sesuai dengan yang diambil di action
              // value={...} // Untuk edit page, set value dari initial data
              // onChange={...} // Untuk edit/new page jika menggunakan state lokal
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
              // defaultValue="" // Untuk new page, bisa kosong
            >
              <option value="">Pilih Kategori (Opsional)</option>
              <option value="Coffee">Coffee</option>
              <option value="NonCoffee">Non-Coffee</option>
              <option value="Foods">Foods</option>
              <option value="Snacks">Snacks</option>
              <option value="Paket">Paket</option>
            </select>
          </div>
  
          <div className="md:col-span-2">
            {" "}
            {/* Misalnya, span 2 kolom */}
            <label
              htmlFor="productDetail"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Detail Produk
            </label>
            <textarea
              id="productDetail"
              name="productDetail" // Pastikan name sesuai
              rows="4"
              // value={...} // Untuk edit page
              // onChange={...} // Untuk edit/new page jika menggunakan state lokal
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
              placeholder="Masukkan deskripsi detail kombinasi produk di sini..."
            ></textarea>
          </div>
          // --- AKHIR PERUBAHAN --- //
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Pilih Produk untuk Kombinasi
            </h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nama Produk
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-6 py-4 text-center text-sm text-gray-500 italic"
                      >
                        Tidak ada produk yang tersedia.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => {
                      const isSelected = selectedProducts.some(
                        (sp) => sp.id === product.id
                      );
                      return (
                        <tr
                          key={product.id}
                          className={`${
                            isSelected ? "bg-purple-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => handleAddProduct(product)}
                              disabled={isSelected}
                              className={`py-2 px-4 rounded-full text-white font-semibold transition-colors duration-200 ${
                                isSelected
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-purple-600 hover:bg-purple-700"
                              }`}
                            >
                              Tambah
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {selectedProducts.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Produk dalam Kombinasi
              </h3>
              <ul className="border border-gray-200 rounded-md divide-y divide-gray-200 bg-gray-50">
                {selectedProducts.map((selectedProduct) => (
                  <li
                    key={selectedProduct.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 space-y-2 md:space-y-0"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {selectedProduct.name}
                    </span>
                    <div className="flex items-center space-x-3">
                      <label
                        htmlFor={`qty-${selectedProduct.id}`}
                        className="text-xs text-gray-600 whitespace-nowrap"
                      >
                        Jumlah:
                      </label>
                      <input
                        type="number"
                        id={`qty-${selectedProduct.id}`}
                        name={`qty-${selectedProduct.id}`}
                        min="1"
                        value={selectedProduct.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            selectedProduct.id,
                            e.target.value
                          )
                        }
                        className="w-20 px-3 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(selectedProduct.id)}
                        className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                        aria-label={`Hapus ${selectedProduct.name}`}
                      >
                        <XIcon />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
            <Link
              href="/admin/kombinasi"
              className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200 ${
                isFormValid
                  ? "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Simpan Kombinasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
