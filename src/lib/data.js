// src/lib/data.js
import prisma from './prisma'; // Import prisma client

// --- Product CRUD Operations ---
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id) {
  try {
    const product = await prisma.product.findUnique({
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
    const product = await prisma.product.create({
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
    const product = await prisma.product.update({
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
    await prisma.product.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error(`Error deleting product ID ${id}:`, error);
    return false;
  }
}