// src/app/admin/actions.js
"use server";

import {
  addProduct,
  updateProduct,
  deleteProduct,
  addEvent,
  updateEvent,
  deleteEvent,
  addProductCombination,
  updateProductCombination,
  deleteProductCombination,
  updateTransaksi, // Tambahkan impor untuk updateTransaksi
  deleteTransaksi, // Tambahkan impor untuk deleteTransaksi
} from "@/lib/data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageToSupabase } from "@/lib/uploadImage";

// --- FUNGSI PEMBANTU ---
/**
 * Menangani unggahan gambar ke layanan penyimpanan (misalnya Supabase).
 * @param {FormData} formData Objek FormData dari form submission.
 * @returns {Promise<string>} URL gambar yang diunggah atau path default.
 */
export async function handleImageUpload(formData) {
  const file = formData.get("image");
  // Jika tidak ada file atau file kosong, kembalikan gambar default
  if (!file || file.size === 0) {
    return "/images/no-image.png";
  }

  try {
    // Coba unggah file ke layanan penyimpanan
    const imageUrl = await uploadImageToSupabase(file);
    // Kembalikan URL yang diunggah, atau default jika hasilnya null/undefined
    return imageUrl || "/images/no-image.png";
  } catch (error) {
    console.error("Upload ke Supabase gagal:", error);
    // Jika unggahan gagal, kembalikan gambar default untuk mencegah error
    return "/images/no-image.png";
  }
}

// --- PRODUCT ACTIONS ---
/**
 * Server Action untuk membuat produk baru.
 */
export async function createProductAction(prevState, formData) {
  const name = formData.get("name");
  const price = parseFloat(formData.get("price"));
  const availability = formData.get("availability");
  const weight = formData.get("weight");
  const condition = formData.get("condition");
  const category = formData.get("category");
  const productDetail = formData.get("productDetail");
  const stock = parseInt(formData.get("stock"), 10);

  if (!name || isNaN(price) || !availability) {
    return { message: "Missing required fields: name, price, availability" };
  }

  // Tangani unggahan gambar
  const imagePath = await handleImageUpload(formData);

  const newProduct = {
    name,
    price,
    availability,
    image: imagePath,
    weight,
    condition,
    category,
    productDetail,
    stock: isNaN(stock) ? BigInt(0) : BigInt(stock),
  };

  try {
    await addProduct(newProduct);
    revalidatePath("/admin");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to create product:", error);
    return { message: "Failed to create product. Please try again." };
  }

  redirect("/admin");
}

/**
 * Server Action untuk memperbarui produk yang ada.
 */
export async function updateProductAction(prevState, formData) {
  const id = formData.get("id");
  const name = formData.get("name");
  const price = parseFloat(formData.get("price"));
  const availability = formData.get("availability");
  const weight = formData.get("weight");
  const condition = formData.get("condition");
  const category = formData.get("category");
  const productDetail = formData.get("productDetail");
  const stock = parseInt(formData.get("stock"), 10);

  if (!id || !name || isNaN(price) || !availability) {
    return {
      message: "Missing required fields: id, name, price, availability",
    };
  }

  // Tangani unggahan gambar (jika ada file baru)
  const file = formData.get("image");
  let imagePath = formData.get("currentImage"); // Path gambar lama

  if (file && file.size > 0) {
    imagePath = await handleImageUpload(formData); // Unggah gambar baru
  }

  const updatedFields = {
    name,
    price,
    availability,
    image: imagePath,
    weight,
    condition,
    category,
    productDetail,
    stock: isNaN(stock) ? BigInt(0) : BigInt(stock),
  };

  try {
    await updateProduct(id, updatedFields);
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/products/${id}`);
  } catch (error) {
    console.error("Failed to update product:", error);
    return { message: "Failed to update product. Please try again." };
  }

  redirect("/admin");
}

/**
 * Server Action untuk menghapus produk.
 */
export async function deleteProductAction(formData) {
  const id = formData.get("id");
  if (!id) {
    return { message: "Product ID is missing." };
  }

  try {
    await deleteProduct(id);
    revalidatePath("/admin");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { message: "Failed to delete product. Please try again." };
  }
}

// --- EVENT ACTIONS ---
/**
 * Server Action untuk membuat event baru.
 */
export async function createEventAction(prevState, formData) {
  const title = formData.get("title");
  const detailEvent = formData.get("detailEvent");
  const linkPendaftaran = formData.get("linkPendaftaran");

  if (!title) {
    return { message: "Judul event wajib diisi." };
  }

  // Tangani unggahan gambar
  const imagePath = await handleImageUpload(formData);

  const newEvent = {
    title,
    image: imagePath,
    detailEvent,
    linkPendaftaran,
  };

  try {
    await addEvent(newEvent);
    revalidatePath("/admin");
  } catch (error) {
    console.error("Gagal menambah event:", error);
    return { message: "Gagal menambah event. Coba lagi nanti." };
  }

  redirect("/admin");
}

/**
 * Server Action untuk memperbarui event yang ada.
 */
export async function updateEventAction(prevState, formData) {
  const id = formData.get("id");
  const title = formData.get("title");
  const detailEvent = formData.get("detailEvent");
  const linkPendaftaran = formData.get("linkPendaftaran");

  if (!id || !title) {
    return { message: "ID dan Judul event wajib diisi." };
  }

  // Tangani unggahan gambar (jika ada file baru)
  const file = formData.get("image");
  let imagePath = formData.get("currentImage"); // Path gambar lama

  if (file && file.size > 0) {
    imagePath = await handleImageUpload(formData); // Unggah gambar baru
  }

  const updatedFields = {
    title,
    image: imagePath,
    detailEvent,
    linkPendaftaran,
  };

  try {
    await updateEvent(id, updatedFields);
    revalidatePath("/admin");
    revalidatePath(`/admin/events/${id}/edit`);
  } catch (error) {
    console.error("Gagal mengupdate event:", error);
    return { message: "Gagal mengupdate event. Coba lagi nanti." };
  }

  redirect("/admin");
}

/**
 * Server Action untuk menghapus event.
 */
export async function deleteEventAction(formData) {
  const id = formData.get("id");
  if (!id) {
    return { message: "Event ID tidak ditemukan." };
  }

  try {
    await deleteEvent(id);
    revalidatePath("/admin");
  } catch (error) {
    console.error("Gagal menghapus event:", error);
    return { message: "Gagal menghapus event. Coba lagi nanti." };
  }
}

// --- PRODUCT COMBINATION ACTIONS ---
/**
 * Server Action untuk membuat kombinasi produk baru.
 */
export async function createProductCombinationAction(prevState, formData) {
  const name = formData.get("name");
  const price = parseFloat(formData.get("price"));
  const category = formData.get("category"); // Bisa null jika tidak wajib
  const productDetail = formData.get("productDetail"); // Bisa null jika tidak wajib

  if (!name || isNaN(price)) {
    return { message: "Missing required fields: name, price" };
  }

  let productIds = [];
  try {
    const selectedProductsJson = formData.get("selectedProducts");
    if (selectedProductsJson) {
      productIds = JSON.parse(selectedProductsJson);
      // Format yang diharapkan: [{id: '...', quantity: 2}, ...]
    }
  } catch (e) {
    console.error("Failed to parse selected products:", e);
    return { message: "Invalid product selection data." };
  }

  if (productIds.length === 0) {
    return { message: "Please select at least one product." };
  }

  // Tangani unggahan gambar
  const imagePath = await handleImageUpload(formData);

  const newCombinationData = {
    name,
    price,
    category: category || null, // Atau tentukan default jika perlu
    productDetail: productDetail || null, // Atau tentukan default jika perlu
    image_url: imagePath, // Tambahkan field image
    productIds, // Array of {id, quantity}
  };

  try {
    await addProductCombination(newCombinationData);
    revalidatePath("/admin");
    revalidatePath("/admin/kombinasi");
  } catch (error) {
    console.error("Failed to create product combination:", error);
    return {
      message: "Failed to create product combination. Please try again.",
    };
  }

  redirect("/admin/kombinasi");
}

/**
 * Server Action untuk memperbarui kombinasi produk yang ada.
 */
export async function updateProductCombinationAction(prevState, formData) {
  const id = formData.get("id");
  const name = formData.get("name");
  const price = parseFloat(formData.get("price"));

  if (!id || !name || isNaN(price)) {
    return { message: "Missing required fields: id, name, price" };
  }

  let productIds = [];
  try {
    const selectedProductsJson = formData.get("selectedProducts");
    if (selectedProductsJson) {
      productIds = JSON.parse(selectedProductsJson);
    }
  } catch (e) {
    console.error("Failed to parse selected products:", e);
    return { message: "Invalid product selection data." };
  }

  if (productIds.length === 0) {
    return { message: "Please select at least one product." };
  }

  const file = formData.get("image");
  let imagePath = formData.get("currentImage");

  if (file && file.size > 0) {
    imagePath = await handleImageUpload(formData);
  }

  const updatedCombinationData = {
    name,
    price,
    image: imagePath,
    productIds,
  };

  try {
    await updateProductCombination(id, updatedCombinationData);
    revalidatePath("/admin");
    revalidatePath("/admin/kombinasi");
  } catch (error) {
    console.error("Failed to update product combination:", error);
    return {
      message: "Failed to update product combination. Please try again.",
    };
  }

  redirect("/admin/kombinasi");
}

/**
 * Server Action untuk menghapus kombinasi produk.
 */
export async function deleteProductCombinationAction(formData) {
  const id = formData.get("id");
  if (!id) {
    return { message: "Product Combination ID is missing." };
  }

  try {
    await deleteProductCombination(id);
    revalidatePath("/admin");
    revalidatePath("/admin/kombinasi");
  } catch (error) {
    console.error("Failed to delete product combination:", error);
    return {
      message: "Failed to delete product combination. Please try again.",
    };
  }
}

// --- TRANSAKSI ACTIONS ---
/**
 * Server Action untuk memperbarui transaksi.
 */
export async function updateTransaksiAction(id, updatedFields) {
  if (!id) {
    return { message: "ID Transaksi tidak ditemukan." };
  }

  try {
    await updateTransaksi(id, updatedFields);
    revalidatePath("/admin/transaksi");
    return { success: true, message: "Transaksi berhasil diperbarui." };
  } catch (error) {
    console.error("Gagal memperbarui transaksi:", error);
    return { success: false, message: "Gagal memperbarui transaksi. Coba lagi." };
  }
}

/**
 * Server Action untuk menghapus transaksi.
 */
export async function deleteTransaksiAction(id) {
  if (!id) {
    return { message: "ID Transaksi tidak ditemukan." };
  }

  try {
    await deleteTransaksi(id);
    revalidatePath("/admin/transaksi");
    return { success: true, message: "Transaksi berhasil dihapus." };
  } catch (error) {
    console.error("Gagal menghapus transaksi:", error);
    return { success: false, message: "Gagal menghapus transaksi. Coba lagi." };
  }
}