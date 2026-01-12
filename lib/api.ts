// Definición de Tipos (Basado en tu respuesta JSON real)

export interface SocialNetwork {
  name: string;
  url: string;
  iconCode: string;
}

export interface HeroData {
  title: string;
  backgroundImage: string;
}

export interface HistoryData {
  description: string;
  image: string;
}

export interface FooterData {
  description: string;
  backgroundImage: string;
}

export interface BakeryData {
  id: number;
  name: string;
  slogan: string;
  logo: string;
  address: string;
  phoneNumber: string;
  whatsAppNumber: string;
  email: string;
  openingHours: string;
  hero: HeroData;
  history: HistoryData;
  footer: FooterData;
  socialNetworks: SocialNetwork[];
}

// --- Tipos para el Catálogo de Productos ---
export interface ProductSize {
  id: number;
  name: string;
  price: number | string;
}

export interface CatalogProduct {
  id: number;
  name: string;
  description: string;
  availableSizes: ProductSize[];
}

export interface ProductDisplay {
  id: number;
  name: string;
  weight: string;
  price: string;
  image: string;
}

// --- Tipos para Detalle de Producto ---
export interface DesignVariant {
  variantId: number;
  designId: number;
  designName: string;
  designDescription: string;
}

export interface SizeDetail {
  sizeId: number;
  sizeName: string;
  price: number;
  weightInGrams: number;
  availableDesigns: DesignVariant[];
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  sizes: SizeDetail[];
}

// --- Tipos para Órdenes (Payload de envío) ---
export interface OrderItemPayload {
  productId: number;
  sizeId: number;
  designId?: number | null;
  quantity: number;
}

export interface CreateOrderRequest {
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  deliveryDate: string; // ISO 8601
  notes?: string;
  items: OrderItemPayload[];
}

// --- Tipos para Historial de Pedidos ---
export interface OrderHistoryItem {
  id: number;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
  total: number;
  itemsCount: number;
}

// URL Base
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5044';

// --- Funciones de Datos Públicos ---

export async function getBakeryData(): Promise<BakeryData | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/bakery/info`, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error connecting to API:', error);
    return null;
  }
}

export async function getProductsCatalog(): Promise<ProductDisplay[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/products/catalog`, { next: { revalidate: 0 } });
    if (!res.ok) return [];
    const rawProducts: CatalogProduct[] = await res.json();

    return rawProducts.map(p => {
      const validPrices = p.availableSizes
        .map(s => parseFloat(s.price.toString()))
        .filter(price => !isNaN(price) && price > 0);
      const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
      const priceDisplay = minPrice > 0 ? `$${minPrice.toFixed(2)}` : "Consultar";
      const sizeDisplay = p.availableSizes.length > 0 ? p.availableSizes[0].name : "Tradicional";

      return {
        id: p.id,
        name: p.name,
        weight: sizeDisplay,
        price: priceDisplay,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop"
      };
    });
  } catch (error) {
    console.error('Error connecting to Products API:', error);
    return [];
  }
}

export async function getProductDetail(id: number): Promise<ProductDetail | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/products/${id}/detail`);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Error connecting to Product Detail API ${id}:`, error);
    return null;
  }
}

// --- Funciones de Autenticación y Pedidos ---

export async function sendVerificationCode(phone: string): Promise<boolean> {
  // TODO: Conectar con endpoint real POST /api/v1/auth/send-otp
  console.log(`Enviando código a ${phone}...`);
  return new Promise(resolve => setTimeout(() => resolve(true), 1000));
}

export async function verifyCode(phone: string, code: string): Promise<boolean> {
  // TODO: Conectar con endpoint real POST /api/v1/auth/verify-otp
  console.log(`Verificando código ${code} para ${phone}...`);
  return new Promise(resolve => setTimeout(() => resolve(code === "1234"), 1000));
}

export async function createOrder(order: CreateOrderRequest): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (!res.ok) {
      console.error('Error creating order:', res.status, await res.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error connecting to Orders API:', error);
    return false;
  }
}

export async function getOrderHistory(phone: string): Promise<OrderHistoryItem[]> {
  // TODO: Conectar con endpoint real GET /api/v1/orders/history?phone=...
  console.log(`Obteniendo historial para ${phone}...`);
  
  return new Promise(resolve => setTimeout(() => resolve([
    { id: 101, date: '2023-10-25', status: 'Delivered', total: 450.00, itemsCount: 24 },
    { id: 102, date: '2023-11-02', status: 'Confirmed', total: 120.00, itemsCount: 6 },
    { id: 103, date: '2023-11-10', status: 'Pending', total: 850.00, itemsCount: 48 },
  ]), 1000));
}
