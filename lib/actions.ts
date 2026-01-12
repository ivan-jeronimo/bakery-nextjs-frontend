"use server";

import { ProductDetail } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5044';

/**
 * Server Action para obtener el detalle del producto.
 * Se ejecuta en el servidor de Next.js, evitando problemas de CORS.
 */
export async function fetchProductDetailAction(id: number): Promise<ProductDetail | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/products/${id}/detail`, {
      cache: 'no-store' // Siempre obtener datos frescos
    });

    if (!res.ok) {
      console.error(`Error fetching product detail ${id} (Server Action):`, res.status);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error(`Error connecting to Product Detail API ${id} (Server Action):`, error);
    return null;
  }
}
