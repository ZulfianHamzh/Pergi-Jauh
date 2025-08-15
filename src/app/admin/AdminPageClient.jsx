// src/app/admin/AdminPageClient.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./LogoutButton";
import { deleteProductCombinationAction } from "@/app/admin/actions";

// --- Ikon-ikon ---
const SortIcon = ({ direction }) => (
  <svg
    className={`w-4 h-4 ml-1 transition-transform ${
      direction === "desc" ? "rotate-180" : ""
    }`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h16"
    ></path>
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    ></path>
  </svg>
);

const SearchIcon = () => (
  <svg
    className="h-5 w-5 text-gray-400"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Fungsi Utilitas ---
// Fungsi utilitas untuk mengurutkan data
const sortData = (data, sortBy, sortOrder) => {
  if (!sortBy || !Array.isArray(data)) return data;

  const sorted = [...data].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortOrder === "asc" ? -1 : 1;
    if (bValue == null) return sortOrder === "asc" ? 1 : -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue, "id")
        : bValue.localeCompare(aValue, "id");
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
  return sorted;
};

// Fungsi utilitas untuk memfilter data
const filterData = (data, searchTerm, keys) => {
  if (!searchTerm || !Array.isArray(data)) return data;
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return data.filter((item) =>
    keys.some((key) => {
      const value = item[key];
      return (
        typeof value === "string" &&
        value.toLowerCase().includes(lowerCaseSearchTerm)
      );
    })
  );
};

// --- Komponen Client ---
export default function AdminPageClient({
  initialProducts,
  initialEvents,
  initialCombinations, // Diasumsikan ini sekarang menyertakan category
  sortBy,
  sortOrder,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const products = initialProducts || [];
  const events = initialEvents || [];
  const combinations = initialCombinations || [];

  const filteredProducts = filterData(products, searchTerm, [
    "name",
    "category",
  ]);
  const filteredEvents = filterData(events, searchTerm, ["title"]);
  // Tambahkan 'category' ke filter kombinasi
  const filteredCombinations = filterData(combinations, searchTerm, [
    "name",
    "category",
  ]);

  const sortedProducts = sortData(filteredProducts, sortBy, sortOrder);
  const sortedEvents = sortData(filteredEvents, sortBy, sortOrder);
  const sortedCombinations = sortData(filteredCombinations, sortBy, sortOrder);

  // Fungsi untuk membuat link pengurutan
  const getSortLink = (key) => {
    const newOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    return `?sort=${key}&order=${newOrder}`;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      {/* Overlay untuk drawer mobile - muncul saat drawer terbuka */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar / Drawer - Responsive */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#2C3E50] text-white p-6 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button
            onClick={closeSidebar}
            className="lg:hidden text-white focus:outline-none"
            aria-label="Tutup menu"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="space-y-4">
          <Link
            href="/"
            onClick={closeSidebar}
            className="block py-2 px-4 rounded-lg hover:bg-[#34495E] transition-colors duration-200"
          >
            Home
          </Link>
          <hr className="my-4 border-gray-700" />
          <Link
            href="/admin/products/new"
            onClick={closeSidebar}
            className="block py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
          >
            Tambah Produk
          </Link>
          <Link
            href="/admin/kombinasi/new"
            onClick={closeSidebar}
            className="block py-2 px-4 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors duration-200"
          >
            Tambah Kombinasi
          </Link>
          <Link
            href="/admin/events/new"
            onClick={closeSidebar}
            className="block py-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 transition-colors duration-200"
          >
            Tambah Event
          </Link>
          <Link
            href="/admin/transaksi"
            onClick={closeSidebar}
            className="block py-2 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
          >
            Lihat Transaksi
          </Link>
          <hr className="my-4 border-gray-700" />
          <div className="w-full">
            <LogoutButton />
          </div>
        </nav>
      </aside>

      {/* Konten utama - Menyesuaikan tata letak untuk mobile dan desktop */}
      <main className="flex-1 p-4 md:p-6 transition-all duration-300 ease-in-out">
        {/* Header Mobile - Hanya muncul di layar kecil */}
        <header className="lg:hidden flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <button
            onClick={toggleSidebar}
            className="text-gray-800 focus:outline-none"
            aria-label="Buka menu"
          >
            <MenuIcon />
          </button>
        </header>

        {/* Search Bar - Diletakkan di atas semua tabel */}
        <div className="mb-8 p-4 md:p-6 bg-white rounded-xl shadow-lg">
          <label htmlFor="search" className="sr-only">
            Cari...
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon />
            </div>
            <input
              type="text"
              id="search"
              name="search"
              className="block text-black w-full rounded-md border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Cari produk, event, atau kombinasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* SECTION PRODUK */}
        <section className="mb-4 p-4 md:p-6 bg-white rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Daftar Produk
            </h2>
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Gambar
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors">
                    <Link
                      href={getSortLink("name")}
                      className="flex items-center"
                      shallow
                    >
                      Nama
                      {sortBy === "name" && <SortIcon direction={sortOrder} />}
                    </Link>
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors">
                    <Link
                      href={getSortLink("price")}
                      className="flex items-center"
                      shallow
                    >
                      Harga
                      {sortBy === "price" && <SortIcon direction={sortOrder} />}
                    </Link>
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors">
                    <Link
                      href={getSortLink("stock")}
                      className="flex items-center"
                      shallow
                    >
                      Stok
                      {sortBy === "stock" && <SortIcon direction={sortOrder} />}
                    </Link>
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors">
                    <Link
                      href={getSortLink("category")}
                      className="flex items-center"
                      shallow
                    >
                      Kategori
                      {sortBy === "category" && (
                        <SortIcon direction={sortOrder} />
                      )}
                    </Link>
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-4 md:px-6 md:py-4 text-sm text-center text-gray-500"
                    >
                      Belum ada produk.
                    </td>
                  </tr>
                ) : (
                  sortedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 md:px-6 md:py-4">
                        <Image
                          src={product.image || "/images/no-image.png"}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="rounded object-cover w-12 h-12 md:w-16 md:h-16"
                        />
                      </td>
                      <td className="px-4 py-4 md:px-6 md:py-4 text-sm text-gray-900 truncate max-w-[100px] md:max-w-xs">
                        {product.name}
                      </td>
                      <td className="px-4 py-4 md:px-6 md:py-4 text-sm text-gray-500">
                        Rp{product.price.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-4 md:px-6 md:py-4 text-sm text-gray-500">
                        {product.stock}
                      </td>
                      <td className="px-4 py-4 md:px-6 md:py-4 text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="px-4 py-4 md:px-6 md:py-4 text-right text-sm font-medium">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* --- PERUBAHAN: SECTION KOMBINASI (Diperbarui dengan kolom Kategori) --- */}
        <section className="mb-4 p-4 md:p-6 bg-white rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Daftar Kombinasi
            </h2>
          </div>
          <div className="overflow-x-auto rounded-lg border">
            {/* Sesuaikan min-w untuk memberi ruang kolom baru */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Gambar
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors">
                    <Link
                      href={getSortLink("name")}
                      className="flex items-center"
                      shallow
                    >
                      Nama Kombinasi
                      {sortBy === "name" && <SortIcon direction={sortOrder} />}
                    </Link>
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors">
                    <Link
                      href={getSortLink("price")}
                      className="flex items-center"
                      shallow
                    >
                      Harga
                      {sortBy === "price" && <SortIcon direction={sortOrder} />}
                    </Link>
                  </th>
                  {/* --- PERUBAHAN: Tambahkan kolom Kategori --- */}
                  <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors">
                    <Link
                      href={getSortLink("category")}
                      className="flex items-center"
                      shallow
                    >
                      Kategori
                      {sortBy === "category" && (
                        <SortIcon direction={sortOrder} />
                      )}
                    </Link>
                  </th>
                  {/* --- AKHIR PERUBAHAN --- */}
                  <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Komponen
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCombinations.length === 0 ? (
                  <tr>
                    {/* Sesuaikan colspan karena ada kolom baru (6 -> 7) */}
                    <td
                      colSpan="7"
                      className="px-4 py-4 md:px-6 md:py-4 text-sm text-center text-gray-500"
                    >
                      Belum ada kombinasi.
                    </td>
                  </tr>
                ) : (
                  sortedCombinations.map((combo) => (
                    <tr key={combo.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 md:px-6 md:py-4">
                        <Image
                          src={combo.image_url || "/images/no-image.png"}
                          alt={`Gambar ${combo.name}`}
                          width={48}
                          height={48}
                          className="rounded object-cover w-12 h-12 md:w-16 md:h-16"
                        />
                      </td>
                      <td className="px-4 py-4 md:px-6 md:py-4 text-sm text-gray-900 font-medium truncate max-w-[100px] md:max-w-xs">
                        {combo.name}
                      </td>
                      <td className="px-4 py-4 md:px-6 md:py-4 text-sm text-gray-500">
                        Rp{combo.price.toLocaleString("id-ID")}
                      </td>
                      {/* --- PERUBAHAN: Tambahkan sel untuk Kategori --- */}
                      <td className="px-4 py-4 md:px-6 md:py-4 text-sm text-gray-500">
                        {combo.category || "-"}
                      </td>
                      {/* --- AKHIR PERUBAHAN --- */}
                      <td className="px-4 py-4 md:px-6 md:py-4 text-sm text-gray-500">
                        {combo.Product_combination_items &&
                        combo.Product_combination_items.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {combo.Product_combination_items.map((item) => (
                              <li
                                key={`${combo.id}-${item.product_id}`}
                                className="truncate max-w-[100px] md:max-w-xs"
                              >
                                <span className="font-medium text-xs md:text-sm">
                                  {item.Product?.name ||
                                    `ID: ${item.product_id}`}
                                </span>
                                {item.quantity > 1 && (
                                  <span className="ml-1 text-xs bg-gray-100 rounded px-1">
                                    x{item.quantity}
                                  </span>
                                )}
                                {!item.Product && (
                                  <span className="ml-1 text-xs text-red-500">
                                    (Tidak Ditemukan)
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="italic text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 md:px-6 md:py-4 text-right text-sm font-medium whitespace-nowrap space-x-3">
                        <Link
                          href={`/admin/kombinasi/${combo.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                        >
                          Edit
                        </Link>
                        <form
                          action={deleteProductCombinationAction}
                          onSubmit={(e) => {
                            if (
                              !confirm(`Yakin hapus kombinasi '${combo.name}'?`)
                            ) {
                              e.preventDefault();
                            }
                          }}
                          className="inline"
                        >
                          <input type="hidden" name="id" value={combo.id} />
                          <button
                            type="submit"
                            className="text-red-600 hover:text-red-900 transition-colors duration-200 ml-3"
                          >
                            Hapus
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
        {/* --- AKHIR PERUBAHAN: SECTION KOMBINASI --- */}

        {/* SECTION EVENT */}
        <section className="p-4 md:p-6 bg-white rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Daftar Event
            </h2>
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Gambar
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors">
                    <Link
                      href={getSortLink("title")}
                      className="flex items-center"
                      shallow
                    >
                      Judul
                      {sortBy === "title" && <SortIcon direction={sortOrder} />}
                    </Link>
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedEvents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-4 py-4 md:px-6 md:py-4 text-sm text-center text-gray-500"
                    >
                      Belum ada event.
                    </td>
                  </tr>
                ) : (
                  sortedEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 md:px-6 md:py-4">
                        <Image
                          src={event.image || "/images/no-image.png"}
                          alt={event.title}
                          width={48}
                          height={48}
                          className="rounded object-cover w-12 h-12 md:w-16 md:h-16"
                        />
                      </td>
                      <td className="px-4 py-4 md:px-6 md:py-4 text-sm text-gray-900 truncate max-w-[100px] md:max-w-xs">
                        {event.title}
                      </td>
                      <td className="px-4 py-4 md:px-6 md:py-4 text-right text-sm font-medium">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
