export type PrintFinish = 'glossy' | 'matte' | 'canvas' | 'metallic' | 'luster';

export interface ProductPrice {
  id: string;
  name: string;
  size: string;
  finish: PrintFinish;
  price: number;
  description: string;
  popular?: boolean;
}

export interface PhotoItem {
  id: string;
  url: string;
  name: string;
  size: number;
  format: string; // productPrice id or format name
  finish: PrintFinish;
  quantity: number;
  uploadedAt: string;
  aspectRatio?: number;
  width?: number;
  height?: number;
  userId?: string;
}

export interface DeliveryAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  lat: number;
  lng: number;
  formattedAddress?: string;
}

export type OrderStatus =
  | 'Processing'
  | 'Printed'
  | 'Handed to DHL'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered';

export interface DHLEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: DeliveryAddress;
  photos: PhotoItem[];
  subtotal: number;
  shippingCost: number;
  shippingMethod: 'DHL Express Worldwide' | 'DHL Standard Ground';
  tax: number;
  total: number;
  status: OrderStatus;
  dhlTrackingNo: string;
  dhlEvents: DHLEvent[];
  createdAt: string;
  estimatedDelivery: string;
  isGuest: boolean;
  paymentMethod: {
    brand: string;
    last4: string;
  };
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  address?: DeliveryAddress;
  uploadedPhotos: PhotoItem[];
}

export type ActivePage =
  | 'home'
  | 'checkout'
  | 'auth'
  | 'pay'
  | 'invoice'
  | 'account'
  | 'admin';
