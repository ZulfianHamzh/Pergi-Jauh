// src/app/admin/LogoutButton.jsx
'use client';

import { signOut } from 'next-auth/react';
import React from 'react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
    >
      Logout
    </button>
  );
}