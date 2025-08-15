// src/lib/data.js
// --- PERUBAHAN: Pastikan import sesuai dengan ekspor dari ./prisma ---
// Jika prisma.js mengekspor default: import prisma from './prisma';
// Jika prisma.js mengekspor named: import { prisma } from './prisma';
// Sesuaikan baris di bawah ini dengan cara ekspor di ./prisma.js Anda.
import prisma from './prisma';

// --- Product CRUD Operations ---
export async function getProducts() {
  try {
    // Nama model 'Product' berasal dari tabel "Product" di DB, Prisma mungkin mengubahnya menjadi 'Product'
    const products = await prisma.Product.findMany({
      orderBy: { createdAt: 'desc' }, // Nama field ini berasal dari schema.prisma Anda
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id) {
  try {
    const product = await prisma.Product.findUnique({
      where: { id },
    });
    return product;
  } catch (error) {
    console.error(`Error fetching product by ID ${id}:`, error);
    return null;
  }
}

export async function addProduct(newProductData) {
  try {
    const product = await prisma.Product.create({
      data: newProductData,
    });
    return product;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}

export async function updateProduct(id, updatedFields) {
  try {
    const product = await prisma.Product.update({
      where: { id },
      data: updatedFields,
    });
    return product;
  } catch (error) {
    console.error(`Error updating product ID ${id}:`, error);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    await prisma.Product.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error(`Error deleting product ID ${id}:`, error);
    return false;
  }
}

// --- Event CRUD Operations ---
export async function getEvents() {
  try {
    // Nama model 'Event' berasal dari tabel "Event" di DB, Prisma mungkin mengubahnya menjadi 'Event'
    const events = await prisma.Event.findMany({
      orderBy: { createdAt: 'desc' }, // Nama field ini berasal dari schema.prisma Anda
    });
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function getEventById(id) {
  try {
    const event = await prisma.Event.findUnique({
      where: { id },
    });
    return event;
  } catch (error) {
    console.error(`Error fetching event by ID ${id}:`, error);
    return null;
  }
}

export async function addEvent(newEventData) {
  try {
    const event = await prisma.Event.create({
      data: {
        title: newEventData.title,
        image: newEventData.image,
        linkPendaftaran: newEventData.linkPendaftaran,
        detailEvent: newEventData.detailEvent || '',
      },
    });
    return event;
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
}

export async function updateEvent(id, updatedFields) {
  try {
    const event = await prisma.Event.update({
      where: { id },
      data: {
        title: updatedFields.title,
        image: updatedFields.image,
        linkPendaftaran: updatedFields.linkPendaftaran,
        detailEvent: updatedFields.detailEvent || '',
      },
    });
    return event;
  } catch (error) {
    console.error(`Error updating event ID ${id}:`, error);
    throw error;
  }
}

export async function deleteEvent(id) {
  try {
    await prisma.Event.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error(`Error deleting event ID ${id}:`, error);
    return false;
  }
}

// --- PRODUCT COMBINATION ---
// --- PERUBAHAN: Gunakan nama model dan field serta relasi yang BENAR sesuai schema.prisma hasil introspeksi ---
// --- PERUBAHAN TAMBAHAN: Sertakan field 'image' dalam operasi create dan update ---

// Perbarui fungsi getProductCombinations (opsional, jika ingin mengambil category & detail)
export async function getProductCombinations() {
  try {
    const combinations = await prisma.Product_combinations.findMany({
      // include: {
      //   Product_combination_items: {
      //     include: {
      //       Product: { select: { id: true, name: true } },
      //     },
      //   },
      // },
      orderBy: { created_at: 'desc' },
      // --- PERUBAHAN (Opsional): Select field tertentu jika perlu ---
      select: {
        id: true,
        name: true,
        price: true,
        image_url: true,
        category: true, // Sertakan category
        productDetail: true, // Sertakan productDetail
        created_at: true,
        updated_at: true,
      }
      // --- AKHIR PERUBAHAN ---
    });
    return combinations;
  } catch (error) {
    console.error("Error fetching product combinations:", error);
    return [];
  }
}

// Perbarui fungsi getProductCombinationById (opsional, jika ingin mengambil category & detail)
export async function getProductCombinationById(id) {
  try {
    const combination = await prisma.Product_combinations.findUnique({
      where: { id },
      // include: {
      //   Product_combination_items: {
      //     include: {
      //       Product: { select: { id: true, name: true } },
      //     },
      //   },
      // },
      // --- PERUBAHAN (Opsional): Select field tertentu jika perlu ---
      select: {
        id: true,
        name: true,
        price: true,
        image_url: true,
        category: true,
        productDetail: true,
        created_at: true,
        updated_at: true,
        Product_combination_items: true // Ini akan di-include oleh blok include di atas
      }
      // --- AKHIR PERUBAHAN ---
    });
    return combination;
  } catch (error) {
    console.error(`Error fetching product combination ${id}:`, error);
    return null;
  }
}


// --- PERUBAHAN: Tambahkan field 'image' dalam fungsi addProductCombination ---
export async function addProductCombination(combinationData) {
  try {
    // --- PERUBAHAN: Ekstrak field 'image' ---
    const { name, price, image_url, category, productDetail, productIds } = combinationData;
    // --- AKHIR PERUBAHAN ---

    // --- PERUBAHAN: Gunakan nama model 'Product_combinations' ---
    // --- PERUBAHAN: Gunakan nama relasi 'Product_combination_items' dalam data ---
    // --- PERUBAHAN: Gunakan field 'product_id' (lihat schema.prisma) ---
    const newCombination = await prisma.Product_combinations.create({
      data: {
        name,
        price,
        image_url,
        // --- PERUBAHAN: Tambahkan field category dan productDetail ---
        category, // Bisa null jika tidak disediakan
        productDetail, // Bisa null jika tidak disediakan
        // --- AKHIR PERUBAHAN ---
        Product_combination_items: {
          create: productIds.map(item => ({
            product_id: item.id,
            quantity: item.quantity || 1,
          })),
        },
      },
      include: {
        // Sertakan item yang baru dibuat untuk respons
        Product_combination_items: {
          include: {
            // Sertakan detail produk
            Product: { select: { id: true, name: true } }, // <-- 'Product', bukan 'product'
          },
        },
      },
    });
    console.log("Kombinasi berhasil dibuat:", newCombination); // Log sukses
    return newCombination;
  } catch (error) {
    console.error("Error adding product combination:", error);
    console.error("Detail error:", error.message, error.stack);
    throw error; // Lempar ulang error
  }
}
// --- AKHIR PERUBAHAN ---

// --- PERUBAHAN: Tambahkan field 'image' dalam fungsi updateProductCombination ---
export async function updateProductCombination(id, combinationData) {
  try {
    // --- PERUBAHAN: Ekstrak field 'image' ---
    const { name, price, image, productIds } = combinationData;
    // --- AKHIR PERUBAHAN ---

    // --- PERUBAHAN: Gunakan nama model 'Product_combinations' ---
    // --- PERUBAHAN: Gunakan nama relasi 'Product_combination_items' dalam data ---
    // --- PERUBAHAN: Gunakan field 'product_id' ---
    const updatedCombination = await prisma.Product_combinations.update({
      where: { id },
      data: {
        name,
        price,
        // --- PERUBAHAN: Tambahkan field 'image' ---
        image, // Perbarui path/URL gambar
        // --- AKHIR PERUBAHAN ---
        // Relasi 'Product_combination_items' untuk operasi update: hapus lalu buat ulang
        Product_combination_items: {
          deleteMany: {}, // Hapus semua item lama
          create: productIds.map(item => ({
            product_id: item.id, // <-- 'product_id', bukan 'productId'
            quantity: item.quantity || 1,
          })),
        },
      },
      include: {
        // Sertakan item yang diperbarui untuk respons
        Product_combination_items: {
          include: {
            // Sertakan detail produk
            Product: { select: { id: true, name: true } }, // <-- 'Product', bukan 'product'
          },
        },
      },
    });
    return updatedCombination;
  } catch (error) {
    console.error(`Error updating product combination ${id}:`, error);
    console.error("Detail error:", error.message, error.stack);
    throw error; // Lempar ulang error
  }
}
// --- AKHIR PERUBAHAN ---

export async function deleteProductCombination(id) {
  try {
    // --- PERUBAHAN: Gunakan nama model 'Product_combinations' ---
    await prisma.Product_combinations.delete({ where: { id } });
  } catch (error) {
    console.error(`Error deleting product combination ${id}:`, error);
    console.error("Detail error:", error.message, error.stack);
    throw error; // Lempar ulang error
  }
}

// --- Tambahan: Dapatkan semua produk untuk selector ---
export async function getProductListForSelector() {
    try {
        // Nama model 'Product' berasal dari tabel "Product" di DB
        const products = await prisma.Product.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' } // Urutkan berdasarkan nama
        });
        return products;
    } catch (error) {
        console.error("Error fetching product list for selector:", error);
        return [];
    }
}

// Tambahkan di akhir file src/lib/data.js

// --- Transaksi CRUD Operations ---
// Fungsi utilitas yang lebih komprehensif untuk mengonversi objek Prisma ke JSON
function convertPrismaDataToJson(obj) {
  if (obj === null || obj === undefined) return obj;

  // Jika ini adalah objek Decimal dari Prisma dengan struktur {d, e, s}
  if (obj && typeof obj === 'object' && 'd' in obj && 'e' in obj && 's' in obj) {
    // Menggunakan library untuk konversi yang lebih andal, misalnya "decimal.js"
    // Untuk tujuan perbaikan ini, kita akan membuat logika yang lebih robust
    const sign = obj.s === 1 ? '' : '-';
    const digits = obj.d.map(num => String(num)).join('');
    const exponent = obj.e;

    // Menangani bilangan yang tidak punya bagian desimal (eksponen >= 0)
    if (exponent >= 0) {
      if (exponent < digits.length - 1) {
        // Angka dengan desimal
        const integerPart = digits.substring(0, exponent + 1);
        const decimalPart = digits.substring(exponent + 1);
        return sign + integerPart + '.' + decimalPart;
      } else {
        // Angka bulat, tambahkan nol jika perlu
        return sign + digits + '0'.repeat(exponent - (digits.length - 1));
      }
    } else {
      // Angka desimal dengan eksponen negatif (misalnya 0.01)
      const zeroPadding = '0'.repeat(-exponent - 1);
      return sign + '0.' + zeroPadding + digits;
    }
  }

  // Jika ini adalah BigInt
  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  // Jika ini adalah Date
  if (obj instanceof Date) {
    return obj.toISOString();
  }

  // Jika ini adalah array
  if (Array.isArray(obj)) {
    return obj.map(item => convertPrismaDataToJson(item));
  }

  // Jika ini adalah objek biasa
  if (typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'function') {
          continue;
        }
        newObj[key] = convertPrismaDataToJson(obj[key]);
      }
    }
    return newObj;
  }

  return obj;
}

// Update fungsi getTransaksi
export async function getTransaksi() {
  try {
    const transaksi = await prisma.Transaksi.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        Menu_Transaksi: true
      }
    });

    // Konversi data ke format JSON yang aman
    return convertPrismaDataToJson(transaksi);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

// Update fungsi getTransaksiById
export async function getTransaksiById(id) {
  try {
    const transaksi = await prisma.Transaksi.findUnique({
      where: { id_transaksi: id },
      include: {
        Menu_Transaksi: true
      }
    });

    // Konversi data ke format JSON yang aman
    return transaksi ? convertPrismaDataToJson(transaksi) : null;
  } catch (error) {
    console.error(`Error fetching transaction by ID ${id}:`, error);
    return null;
  }
}

export async function updateTransaksi(id, updatedFields) {
  try {
    const transaksi = await prisma.Transaksi.update({
      where: { id_transaksi: id },
      data: updatedFields,
    });
    return transaksi;
  } catch (error) {
    console.error(`Error updating transaction ID ${id}:`, error);
    throw error;
  }
}

export async function deleteTransaksi(id) {
  try {
    await prisma.Transaksi.delete({
      where: { id_transaksi: id },
    });
    return true;
  } catch (error) {
    console.error(`Error deleting transaction ID ${id}:`, error);
    return false;
  }
}
