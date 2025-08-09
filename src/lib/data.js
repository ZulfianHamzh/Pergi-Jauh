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

export async function getProductCombinations() {
  try {
    // --- PERUBAHAN: Gunakan nama model 'Product_combinations' ---
    // --- PERUBAHAN: Gunakan nama relasi 'Product_combination_items' ---
    // --- PERUBAHAN: Gunakan nama relasi 'Product' (dengan huruf kapital) ---
    // --- PERUBAHAN: Gunakan field 'created_at' untuk orderBy ---
    const combinations = await prisma.Product_combinations.findMany({
      include: {
        // Relasi dari Product_combinations ke Product_combination_items
        Product_combination_items: {
          include: {
            // Relasi dari Product_combination_items ke Product (lihat nama di schema.prisma)
            Product: { select: { id: true, name: true } }, // <-- 'Product', bukan 'product'
          },
        },
      },
      orderBy: { created_at: 'desc' }, // <-- 'created_at', bukan 'createdAt'
    });
    return combinations;
  } catch (error) {
    console.error("Error fetching product combinations:", error);
    console.error("Detail error:", error.message);
    return [];
  }
}

export async function getProductCombinationById(id) {
  try {
    // --- PERUBAHAN: Gunakan nama model 'Product_combinations' ---
    // --- PERUBAHAN: Gunakan nama relasi 'Product_combination_items' ---
    // --- PERUBAHAN: Gunakan nama relasi 'Product' (dengan huruf kapital) ---
    const combination = await prisma.Product_combinations.findUnique({
      where: { id }, // id adalah field yang benar
      include: {
        // Relasi dari Product_combinations ke Product_combination_items
        Product_combination_items: {
          include: {
            // Relasi dari Product_combination_items ke Product
            Product: { select: { id: true, name: true } }, // <-- 'Product', bukan 'product'
          },
        },
      },
    });
    return combination;
  } catch (error) {
    console.error(`Error fetching product combination ${id}:`, error);
    console.error("Detail error:", error.message);
    return null;
  }
}

export async function addProductCombination(combinationData) {
  try {
    const { name, price, productIds } = combinationData;

    // --- PERUBAHAN: Gunakan nama model 'Product_combinations' ---
    // --- PERUBAHAN: Gunakan nama relasi 'Product_combination_items' dalam data ---
    // --- PERUBAHAN: Gunakan field 'product_id' (lihat schema.prisma) ---
    const newCombination = await prisma.Product_combinations.create({
      data: {
        name,
        price,
        // Relasi 'Product_combination_items' untuk operasi create
        Product_combination_items: {
          create: productIds.map(item => ({
            product_id: item.id, // <-- 'product_id', bukan 'productId'
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

export async function updateProductCombination(id, combinationData) {
  try {
    const { name, price, productIds } = combinationData;

    // --- PERUBAHAN: Gunakan nama model 'Product_combinations' ---
    // --- PERUBAHAN: Gunakan nama relasi 'Product_combination_items' dalam data ---
    // --- PERUBAHAN: Gunakan field 'product_id' ---
    const updatedCombination = await prisma.Product_combinations.update({
      where: { id },
      data: {
        name,
        price,
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