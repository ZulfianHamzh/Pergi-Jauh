'use server';

import { addProduct, updateProduct, deleteProduct, addEvent, updateEvent, deleteEvent } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uploadImageToSupabase } from '@/lib/uploadImage'; // Ganti handler upload ke Supabase

export async function handleImageUpload(formData) {
  const file = formData.get('image');
  if (!file || file.size === 0) {
    return '/images/no-image.png';
  }

  try {
    const imageUrl = await uploadImageToSupabase(file);
    return imageUrl || '/images/no-image.png';
  } catch (error) {
    console.error('Upload ke Supabase gagal:', error);
    return '/images/no-image.png';
  }
}

export async function createProductAction(prevState, formData) {
  const name = formData.get('name');
  const price = parseFloat(formData.get('price'));
  const availability = formData.get('availability');
  const weight = formData.get('weight');
  const condition = formData.get('condition');
  const category = formData.get('category');
  const productDetail = formData.get('productDetail');

  if (!name || isNaN(price) || !availability) {
    return { message: 'Missing required fields: name, price, availability' };
  }

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
  };

  try {
    await addProduct(newProduct);
    revalidatePath('/admin');
    revalidatePath('/');
  } catch (error) {
    console.error("Failed to create product:", error);
    return { message: "Failed to create product. Please try again." };
  }

  redirect('/admin');
}

export async function updateProductAction(prevState, formData) {
  const id = formData.get('id');
  const name = formData.get('name');
  const price = parseFloat(formData.get('price'));
  const availability = formData.get('availability');
  const weight = formData.get('weight');
  const condition = formData.get('condition');
  const category = formData.get('category');
  const productDetail = formData.get('productDetail');

  if (!id || !name || isNaN(price) || !availability) {
    return { message: 'Missing required fields: id, name, price, availability' };
  }

  const file = formData.get('image');
  let imagePath = formData.get('currentImage');

  if (file && file.size > 0) {
    imagePath = await handleImageUpload(formData);
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
  };

  try {
    await updateProduct(id, updatedFields);
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath(`/products/${id}`);
  } catch (error) {
    console.error("Failed to update product:", error);
    return { message: "Failed to update product. Please try again." };
  }

  redirect('/admin');
}

export async function deleteProductAction(formData) {
  const id = formData.get('id');
  if (!id) {
    return { message: 'Product ID is missing.' };
  }

  try {
    await deleteProduct(id);
    revalidatePath('/admin');
    revalidatePath('/');
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { message: "Failed to delete product. Please try again." };
  }
}

// Tambahan di bagian akhir file actions.js

// --- EVENT UPDATE ---
export async function updateEventAction(prevState, formData) {
  const id = formData.get('id');
  const title = formData.get('title');

  if (!id || !title) {
    return { message: 'ID dan Judul event wajib diisi.' };
  }

  const file = formData.get('image');
  let imagePath = formData.get('currentImage');

  if (file && file.size > 0) {
    imagePath = await handleImageUpload(formData);
  }

  const updatedFields = {
    title,
    image: imagePath,
  };

  try {
    await updateEvent(id, updatedFields);
    revalidatePath('/admin');
    revalidatePath(`/admin/events/${id}/edit`);
  } catch (error) {
    console.error("Gagal mengupdate event:", error);
    return { message: "Gagal mengupdate event. Coba lagi nanti." };
  }

  redirect('/admin');
}

// --- EVENT DELETE ---
export async function deleteEventAction(formData) {
  const id = formData.get('id');
  if (!id) {
    return { message: 'Event ID tidak ditemukan.' };
  }

  try {
    await deleteEvent(id);
    revalidatePath('/admin');
  } catch (error) {
    console.error("Gagal menghapus event:", error);
    return { message: "Gagal menghapus event. Coba lagi nanti." };
  }
}

// --- EVENT ---
export async function createEventAction(prevState, formData) {
  const title = formData.get('title');

  if (!title) {
    return { message: 'Judul event wajib diisi.' };
  }

  const imagePath = await handleImageUpload(formData);

  const newEvent = {
    title,
    image: imagePath,
  };

  try {
    await addEvent(newEvent);
    revalidatePath('/admin');
  } catch (error) {
    console.error("Gagal menambah event:", error);
    return { message: "Gagal menambah event. Coba lagi nanti." };
  }

  redirect('/admin');
}