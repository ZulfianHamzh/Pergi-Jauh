// src/middleware.js (GANTI DENGAN INI)
import { withAuth } from "next-auth/middleware";
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) { // Pastikan ada 'async' di sini
    const isAdminPath = req.nextUrl.pathname.startsWith('/admin');
    const isLoginPage = req.nextUrl.pathname === '/admin/login'; // Periksa tepatnya /admin/login
    const token = req.nextauth.token; // Token otomatis tersedia di req.nextauth

    // 1. Jika pengguna mencoba mengakses halaman admin (selain login) dan TIDAK TERAUTENTIKASI
    if (isAdminPath && !isLoginPage && !token) {
      // Redirect ke halaman login admin dengan callbackUrl
      const signInUrl = new URL('/admin/login', req.url);
      signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname); // Set callbackUrl agar bisa kembali setelah login
      return NextResponse.redirect(signInUrl);
    }

    // 2. Jika pengguna TERAUTENTIKASI (token ada)
    if (token) {
      // Jika pengguna adalah ADMIN dan mencoba mengakses halaman LOGIN, redirect ke /admin
      if (isLoginPage && token.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }

      // Jika pengguna adalah BUKAN ADMIN dan mencoba mengakses halaman ADMIN (selain login), redirect ke home
      if (isAdminPath && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Jika tidak ada kondisi redirect yang terpenuhi, biarkan request berjalan normal
    return NextResponse.next();
  },
  {
    callbacks: {
      // authorized dipanggil sebelum middleware utama dan menentukan apakah token harus dimuat
      // Kita hanya perlu memastikan token ada untuk melanjutkan ke middleware fungsi di atas
      authorized: ({ token }) => {
        // Return true agar token selalu dimuat (jika ada) dan logika peran di handle di fungsi middleware
        return true;
      },
    },
    // pages: { signIn: '/admin/login' } // Tidak perlu di sini, logika redirect di handle di fungsi middleware
  }
);

// Matcher untuk menerapkan middleware hanya pada rute yang relevan
export const config = {
  matcher: ["/admin/:path*", "/api/auth/:path*"],
};