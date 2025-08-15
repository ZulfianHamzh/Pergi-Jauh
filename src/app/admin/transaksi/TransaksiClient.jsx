// src/app/admin/transaksi/TransaksiClient.jsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { deleteTransaksiAction } from "../actions";
import { useSearchParams, useRouter } from "next/navigation";
import { exportToExcel } from "@/utils/export"; // Import fungsi export yang baru

// Fungsi utilitas untuk memformat tanggal
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Fungsi utilitas untuk memformat mata uang
const formatCurrency = (amount) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || num === null || num === undefined) return "Rp0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

// Fungsi utilitas untuk mengonversi nilai ke number
const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "string") return parseFloat(value) || 0;
  if (typeof value === "number") return value;
  return 0;
};

// Dummy Components untuk icons dan logout
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const LogoutButton = () => (
  <button className="w-full text-left py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 transition-colors duration-200">
    Logout
  </button>
);

export default function TransaksiClient({ initialTransaksi }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [transaksi, setTransaksi] = useState(initialTransaksi);
  const [filteredTransaksi, setFilteredTransaksi] = useState(initialTransaksi);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sortBy = searchParams.get("sort") || "created_at";
  const sortOrder = searchParams.get("order") || "desc";

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

  // Menggabungkan filter dan pencarian
  useEffect(() => {
    let filtered = [...transaksi];

    // Filter berdasarkan tanggal
    if (selectedDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.created_at).toISOString().split("T")[0];
        return itemDate === selectedDate;
      });
    }

    // Filter berdasarkan pencarian
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.id_transaksi.toLowerCase().includes(lowercasedSearchTerm) ||
          item.atas_nama.toLowerCase().includes(lowercasedSearchTerm) ||
          item.pembayaran.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    // Urutkan data yang sudah difilter
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === undefined || bValue === undefined) {
        return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredTransaksi(filtered);
  }, [selectedDate, searchTerm, transaksi, sortBy, sortOrder]);

  // Fungsi handler untuk export
  const handleExport = () => {
    // Siapkan data untuk diekspor
    const summaryData = {
        grandTotal: formatCurrency(grandTotal),
        totalQris: formatCurrency(totalQris),
        totalTunai: formatCurrency(totalTunai),
      };
    const dataToExport = filteredTransaksi.map((item) => {
      // Ambil detail menu dari item.Menu_Transaksi


      const menuDetails =
        item.Menu_Transaksi && item.Menu_Transaksi.length > 0
          ? item.Menu_Transaksi.map(
              (menu) =>
                `${menu.nama_menu} (${menu.jumlah_menu}x) - ${formatCurrency(
                  toNumber(menu.harga_menu) * menu.jumlah_menu
                )}`
            ).join("\n")
          : "Tidak ada item";

        

      

      return {
        "ID Transaksi": item.id_transaksi,
        "Tanggal & Waktu": formatDate(item.created_at),
        "Atas Nama": item.atas_nama,
        Pembayaran: item.pembayaran,
        Total: toNumber(item.total),
        Status: item.status,
        "Dibuat Oleh": item.dibuat_oleh || "-",
        Catatan: item.notes || "-",
        Diskon: toNumber(item.discount),
        "Item Pesanan": menuDetails,
      };
    });

    // Tentukan nama file secara kondisional
    let filename;
    if (selectedDate) {
      // Jika ada tanggal yang difilter
      filename = `Laporan_Transaksi_${selectedDate}`;
    } else {
      // Jika tidak ada filter tanggal
      filename = "Laporan_Semua_Transaksi";
    }

    // Panggil fungsi export
    exportToExcel(dataToExport, summaryData, filename);
  };

  // Hitung grand total
  const grandTotal = filteredTransaksi.reduce((sum, item) => {
    const total = toNumber(item.total);
    return sum + total;
  }, 0);

  // NEW: Hitung total QRIS
  const totalQris = filteredTransaksi
    .filter((item) => item.pembayaran?.toLowerCase() === "qris")
    .reduce((sum, item) => sum + toNumber(item.total), 0);

  // NEW: Hitung total Tunai
  const totalTunai = filteredTransaksi
    .filter((item) => item.pembayaran?.toLowerCase() === "tunai")
    .reduce((sum, item) => sum + toNumber(item.total), 0);

  // Hapus transaksi
  const handleDelete = async (id_transaksi) => {
    if (!confirm("Yakin ingin menghapus transaksi ini?")) return;

    setLoading(true);
    try {
      const result = await deleteTransaksiAction(id_transaksi);

      // Menggunakan router.refresh() untuk mendapatkan data terbaru dari server
      if (result) {
        setTransaksi((prev) =>
          prev.filter((t) => t.id_transaksi !== id_transaksi)
        );
        alert("Transaksi berhasil dihapus");
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Gagal menghapus transaksi");
    } finally {
      setLoading(false);
    }
  };

  // Toggle detail transaksi
  const toggleDetail = (id) => {
    setShowDetail(showDetail === id ? null : id);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
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

        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-black">
                Daftar Transaksi
              </h1>
              <p className="text-gray-600">
                Kelola dan lihat riwayat transaksi
              </p>
            </div>
            {/* Tombol Export yang baru */}
            <button
              onClick={handleExport}
              className="mt-4 md:mt-0 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export ke Excel
            </button>
          </div>

          {/* Filter, Pencarian & Grand Total */}
          <div className="mb-6 p-6 bg-gradient-to-r from-white via-gray-50 to-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Filter Tanggal */}
              <div className="flex-1">
                <label
                  htmlFor="date-filter"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  📅 Filter berdasarkan tanggal:
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date-filter"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm text-gray-900"
                  />
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Cari Transaksi */}
              <div className="flex-1">
                <label
                  htmlFor="search"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  🔍 Cari transaksi:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari ID atau nama..."
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm text-gray-900"
                  />
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Ringkasan Total */}
              <div className="md:text-right md:w-auto w-full bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <p className="text-lg font-bold text-gray-800">
                  Grand Total:{" "}
                  <span className="text-green-600">
                    {formatCurrency(grandTotal)}
                  </span>
                </p>
                <p className="text-sm font-medium text-gray-800">
                  Total QRIS:{" "}
                  <span className="text-blue-600">
                    {formatCurrency(totalQris)}
                  </span>
                </p>
                <p className="text-sm font-medium text-gray-800">
                  Total Tunai:{" "}
                  <span className="text-orange-600">
                    {formatCurrency(totalTunai)}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {filteredTransaksi.length} transaksi ditemukan
                </p>
              </div>
            </div>
          </div>

          {/* Tabel Transaksi */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHeaderCell
                      title="ID & Tanggal"
                      sortKey="id_transaksi"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      getSortLink={getSortLink}
                    />
                    <TableHeaderCell
                      title="Atas Nama"
                      sortKey="atas_nama"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      getSortLink={getSortLink}
                    />
                    <TableHeaderCell
                      title="Pembayaran"
                      sortKey="pembayaran"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      getSortLink={getSortLink}
                    />
                    <TableHeaderCell
                      title="Total"
                      sortKey="total"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      getSortLink={getSortLink}
                    />
                    <TableHeaderCell
                      title="Status"
                      sortKey="status"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      getSortLink={getSortLink}
                    />
                    <th className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransaksi.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-black"
                      >
                        Tidak ada transaksi
                      </td>
                    </tr>
                  ) : (
                    filteredTransaksi.map((item) => (
                      <React.Fragment key={item.id_transaksi}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-black">
                              {item.id_transaksi}
                            </div>
                            <div className="text-xs text-gray-600">
                              {formatDate(item.created_at)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-black">
                              {item.atas_nama}
                            </div>
                            {item.preferensi_kopi && (
                              <div className="text-xs text-gray-600">
                                {item.preferensi_kopi}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                            {item.pembayaran}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                            <span className="text-green-600">
                              {formatCurrency(item.total)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.status === "Selesai"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => toggleDetail(item.id_transaksi)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Detail
                            </button>
                            <Link
                              href={`/admin/transaksi/${item.id_transaksi}/edit`}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(item.id_transaksi)}
                              disabled={loading}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              {loading ? "Menghapus..." : "Hapus"}
                            </button>
                          </td>
                        </tr>

                        {/* Detail Transaksi */}
                        {showDetail === item.id_transaksi && (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <h4 className="font-medium text-black mb-2">
                                    Informasi Umum
                                  </h4>
                                  <div className="text-sm space-y-1 text-black">
                                    <p>
                                      <span className="font-medium">
                                        Dibuat oleh:
                                      </span>{" "}
                                      {item.dibuat_oleh || "-"}
                                    </p>
                                    <p>
                                      <span className="font-medium">
                                        Catatan:
                                      </span>{" "}
                                      {item.notes || "-"}
                                    </p>
                                    {toNumber(item.discount) > 0 && (
                                      <p>
                                        <span className="font-medium">
                                          Diskon:
                                        </span>{" "}
                                        {formatCurrency(item.discount)}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium text-black mb-2">
                                    Item Pesanan
                                  </h4>
                                  <div className="text-sm space-y-2 text-black">
                                    {item.Menu_Transaksi &&
                                    item.Menu_Transaksi.length > 0 ? (
                                      item.Menu_Transaksi.map((menu, index) => (
                                        <div
                                          key={index}
                                          className="border-b pb-2"
                                        >
                                          <p className="font-medium">
                                            {menu.nama_menu} x{menu.jumlah_menu}
                                          </p>
                                          <p className="text-black">
                                            {formatCurrency(
                                              toNumber(menu.harga_menu) *
                                                menu.jumlah_menu
                                            )}
                                          </p>
                                          {menu.suhu && (
                                            <p className="text-xs text-black">
                                              Suhu: {menu.suhu} (+
                                              {formatCurrency(
                                                toNumber(menu.suhu_harga) || 0
                                              )}
                                              )
                                            </p>
                                          )}
                                          {menu.topping_tambahan_list &&
                                            Array.isArray(
                                              menu.topping_tambahan_list
                                            ) &&
                                            menu.topping_tambahan_list.length >
                                              0 && (
                                              <div className="text-xs text-black">
                                                Topping:{" "}
                                                {menu.topping_tambahan_list
                                                  .map((t) => t.name || t)
                                                  .join(", ")}
                                              </div>
                                            )}
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-black">
                                        Tidak ada item
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium text-black mb-2">
                                    Ringkasan Pembayaran
                                  </h4>
                                  <div className="text-sm space-y-1 text-black">
                                    <div className="flex justify-between">
                                      <span>Subtotal:</span>
                                      <span>
                                        {formatCurrency(
                                          toNumber(item.total) +
                                            toNumber(item.discount || 0)
                                        )}
                                      </span>
                                    </div>
                                    {toNumber(item.discount) > 0 && (
                                      <div className="flex justify-between text-red-600">
                                        <span>Diskon:</span>
                                        <span>
                                          -{formatCurrency(item.discount)}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex justify-between font-bold border-t pt-2">
                                      <span>Total:</span>
                                      <span className="text-green-600">
                                        {formatCurrency(item.total)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Komponen helper untuk header tabel dengan sorting
function TableHeaderCell({ title, sortKey, sortBy, sortOrder, getSortLink }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
      <Link href={getSortLink(sortKey)} className="flex items-center space-x-1">
        <span>{title}</span>
        {sortBy === sortKey && <span>{sortOrder === "asc" ? "▲" : "▼"}</span>}
      </Link>
    </th>
  );
}
