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

// --- Tipos para el Catálogo y Detalle de Productos ---

export interface ProductSize {
  id: number;
  name: string;
  price: number | string;
  weightInGrams?: number;
}

export interface ProductDesign {
  id: number;
  name: string;
  description?: string;
}

export interface ProductVariant {
  sizeId: number;
  designId: number;
  imageUrl?: string;
}

export interface CatalogProduct {
  id: number;
  name: string;
  description: string;
  availableSizes: ProductSize[];
  availableDesigns: ProductDesign[];
  variants: ProductVariant[];
}

export type ProductDetail = CatalogProduct;

export interface ProductDisplay {
  id: number;
  name: string;
  weight: string;
  price: string;
  image: string;
  variants?: ProductVariant[];
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
  paymentStatus: string; // PaymentStatus
  total: number;
  itemsCount: number;
}

// --- Tipos para Detalle de Orden Completa ---
export interface OrderDetailItem {
  productName: string;
  sizeName: string;
  designName?: string;
  weightInGrams?: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDetail {
  id: number;
  orderNumber: string;
  orderDate: string;
  deliveryDate: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  notes?: string;
  items: OrderDetailItem[];
}

// --- Tipos de Autenticación ---
export interface VerifyOtpResponse {
  isValid: boolean;
  token?: string;
  fullName?: string;
  message?: string;
}

// --- Tipos de Pago ---
export interface PaymentResponse {
  initPoint: string;
}

export interface PaymentSyncResponse {
  paymentStatus: string; // 'Approved', 'InProcess', 'Rejected', etc.
  status?: string; // Estado de la orden
  message?: string;
}

// URL Base
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5044';

// Log para depuración en producción
if (typeof window !== 'undefined') {
  console.log('🚀 API URL Configurada:', API_URL);
}

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
    console.log(`📡 Fetching Bakery Data from: ${API_URL}/api/v1/bakery/info`);
    const res = await fetch(`${API_URL}/api/v1/bakery/info`, { next: { revalidate: 0 } });
    if (!res.ok) {
        console.error(`❌ Error fetching bakery data: ${res.status} ${res.statusText}`);
        return null;
    }
    return res.json();
  } catch (error) {
    console.error('❌ Network Error connecting to API:', error);
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

      let image = "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop";
      
      if (p.variants && p.variants.length > 0) {
        const variantWithImage = p.variants.find(v => v.imageUrl && v.imageUrl.trim() !== "");
        if (variantWithImage) {
          image = variantWithImage.imageUrl!;
        }
      }

      return {
        id: p.id,
        name: p.name,
        weight: sizeDisplay,
        price: priceDisplay,
        image: image,
        variants: p.variants
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
    const data = await res.json();
    console.log(`📦 API Response for Product ${id}:`, data);
    return data;
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

export async function getOrderById(orderId: number): Promise<OrderDetail | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/api/v1/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    return null;
  }
}

export async function initiatePayment(orderId: number): Promise<string | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/api/v1/orders/${orderId}/pay`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (!res.ok) {
      console.error('Error initiating payment:', res.status);
      return null;
    }

    const data: PaymentResponse = await res.json();
    return data.initPoint;
  } catch (error) {
    console.error('Error connecting to Payment API:', error);
    return null;
  }
}

/**
 * Sincroniza el estado del pago usando el OrderNumber.
 * Endpoint: POST /api/v1/payments/sync-by-number/{orderNumber}
 */
export async function syncPaymentStatusByNumber(orderNumber: string): Promise<PaymentSyncResponse | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/api/v1/payments/sync-by-number/${orderNumber}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      console.error('Error syncing payment:', res.status);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error connecting to Payment Sync API:', error);
    return null;
  }
}
