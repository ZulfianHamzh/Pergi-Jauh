// src/app/admin/AdminNavbar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import LogoutButton from "../app/admin/LogoutButton";

// Ikon-ikon
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

export default function AdminNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
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
            href="/admin"
            onClick={closeSidebar}
            className="block py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
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
    </>
  );
}