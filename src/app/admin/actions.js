'use server';

import { addProduct, updateProduct, deleteProduct } from '@/lib/data';
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
