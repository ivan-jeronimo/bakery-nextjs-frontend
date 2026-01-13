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

// --- Tipos para Órdenes ---
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
  orderNumber: string;
  date: string;
  status: string; // OrderStatus
  paymentStatus: string; // PaymentStatus (Nuevo campo)
  total: number;
  itemsCount: number;
}

// --- Tipos de Autenticación ---
export interface VerifyOtpResponse {
  isValid: boolean;
  token?: string;
  fullName?: string;
  message?: string;
}

// URL Base
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5044';

// Helper para obtener el token almacenado
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

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
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error sending OTP:', errorData);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error connecting to Auth API:', error);
    return false;
  }
}

export async function verifyCode(phone: string, code: string): Promise<VerifyOtpResponse> {
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    });

    if (!res.ok) {
      console.error('Error verifying OTP:', res.status);
      return { isValid: false };
    }

    const data: VerifyOtpResponse = await res.json();

    if (data.isValid && data.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.token);
        if (data.fullName) {
          localStorage.setItem('user_name', data.fullName);
        }
      }
    }

    return data;
  } catch (error) {
    console.error('Error connecting to Auth API:', error);
    return { isValid: false };
  }
}

export async function createOrder(order: CreateOrderRequest): Promise<boolean> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/orders`, {
      method: 'POST',
      headers: headers,
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

export async function getOrderHistory(): Promise<OrderHistoryItem[]> {
  const token = getAuthToken();
  if (!token) {
    console.error('No auth token found');
    return [];
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/orders/history`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
}
