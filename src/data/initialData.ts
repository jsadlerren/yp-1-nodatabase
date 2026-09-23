import { ProductPrice, PhotoItem, UserAccount, Order } from '../types';

export const INITIAL_PRODUCTS: ProductPrice[] = [
  {
    id: 'print_4x6',
    name: 'Standard Print 4" x 6"',
    size: '4x6"',
    finish: 'glossy',
    price: 0.29,
    description: 'Classic archival photo paper with crisp detail and vivid colors.',
    popular: true,
  },
  {
    id: 'print_5x7',
    name: 'Deluxe Portrait 5" x 7"',
    size: '5x7"',
    finish: 'matte',
    price: 0.89,
    description: 'Anti-glare velvety matte finish perfect for framing and portraits.',
    popular: true,
  },
  {
    id: 'print_8x10',
    name: 'Studio Gallery 8" x 10"',
    size: '8x10"',
    finish: 'luster',
    price: 3.49,
    description: 'Heavyweight exhibition luster finish with high dynamic range.',
  },
  {
    id: 'print_canvas_8x10',
    name: 'Stretched Canvas 8" x 10"',
    size: '8x10"',
    finish: 'canvas',
    price: 14.99,
    description: 'Hand-wrapped 1.25" solid wood frame with UV archival protective coating.',
  },
  {
    id: 'print_12x18',
    name: 'Panoramic Poster 12" x 18"',
    size: '12x18"',
    finish: 'metallic',
    price: 18.50,
    description: 'Ultra-bright pearlescent metallic finish for stunning landscapes.',
  },
];

export const SAMPLE_PHOTOS: Omit<PhotoItem, 'id' | 'format' | 'finish' | 'quantity' | 'uploadedAt'>[] = [
  {
    name: 'mountain_sunset.jpg',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80',
    size: 2840192,
    aspectRatio: 1.5,
  },
  {
    name: 'coastal_cliffs.jpg',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80',
    size: 3410294,
    aspectRatio: 1.5,
  },
  {
    name: 'golden_gate_bridge.jpg',
    url: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=900&auto=format&fit=crop&q=80',
    size: 4120931,
    aspectRatio: 1.4,
  },
  {
    name: 'tokyo_cherry_blossom.jpg',
    url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=900&auto=format&fit=crop&q=80',
    size: 3820109,
    aspectRatio: 1.33,
  },
  {
    name: 'autumn_forest.jpg',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&auto=format&fit=crop&q=80',
    size: 2980112,
    aspectRatio: 1.5,
  },
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user_admin',
    email: 'admin@photoprint.com',
    name: 'Elena Vance (Admin)',
    role: 'admin',
    createdAt: '2026-01-10T09:00:00.000Z',
    address: {
      fullName: 'Elena Vance',
      street: '350 5th Ave, Floor 18',
      city: 'New York',
      state: 'NY',
      zipCode: '10118',
      country: 'United States',
      phone: '+1 (212) 555-0199',
      lat: 40.748817,
      lng: -73.985428,
      formattedAddress: 'Empire State Building, 350 5th Ave, New York, NY 10118, USA',
    },
    uploadedPhotos: [
      {
        id: 'photo_admin_1',
        name: 'mountain_sunset.jpg',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80',
        size: 2840192,
        format: 'print_4x6',
        finish: 'glossy',
        quantity: 2,
        uploadedAt: '2026-09-20T14:30:00.000Z',
        userId: 'user_admin',
      },
      {
        id: 'photo_admin_2',
        name: 'coastal_cliffs.jpg',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80',
        size: 3410294,
        format: 'print_8x10',
        finish: 'canvas',
        quantity: 1,
        uploadedAt: '2026-09-21T11:20:00.000Z',
        userId: 'user_admin',
      }
    ],
  },
  {
    id: 'user_customer_1',
    email: 'jsadlerren@gmail.com',
    name: 'J. Sadler',
    role: 'user',
    createdAt: '2026-02-14T10:30:00.000Z',
    address: {
      fullName: 'J. Sadler',
      street: '1600 Amphitheatre Pkwy',
      city: 'Mountain View',
      state: 'CA',
      zipCode: '94043',
      country: 'United States',
      phone: '+1 (650) 253-0000',
      lat: 37.4220656,
      lng: -122.0840897,
      formattedAddress: '1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA',
    },
    uploadedPhotos: [
      {
        id: 'photo_cust_1',
        name: 'golden_gate_bridge.jpg',
        url: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=900&auto=format&fit=crop&q=80',
        size: 4120931,
        format: 'print_5x7',
        finish: 'matte',
        quantity: 4,
        uploadedAt: '2026-09-18T16:45:00.000Z',
        userId: 'user_customer_1',
      },
      {
        id: 'photo_cust_2',
        name: 'tokyo_cherry_blossom.jpg',
        url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=900&auto=format&fit=crop&q=80',
        size: 3820109,
        format: 'print_12x18',
        finish: 'metallic',
        quantity: 1,
        uploadedAt: '2026-09-19T09:12:00.000Z',
        userId: 'user_customer_1',
      }
    ],
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_demo_1',
    orderNo: 'ORD-2026-88192',
    userId: 'user_customer_1',
    customerName: 'J. Sadler',
    customerEmail: 'jsadlerren@gmail.com',
    customerPhone: '+1 (650) 253-0000',
    shippingAddress: {
      fullName: 'J. Sadler',
      street: '1600 Amphitheatre Pkwy',
      city: 'Mountain View',
      state: 'CA',
      zipCode: '94043',
      country: 'United States',
      phone: '+1 (650) 253-0000',
      lat: 37.4220656,
      lng: -122.0840897,
      formattedAddress: '1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA',
    },
    photos: [
      {
        id: 'photo_ord_1',
        name: 'golden_gate_bridge.jpg',
        url: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=900&auto=format&fit=crop&q=80',
        size: 4120931,
        format: 'print_5x7',
        finish: 'matte',
        quantity: 4,
        uploadedAt: '2026-09-18T16:45:00.000Z',
        userId: 'user_customer_1',
      },
      {
        id: 'photo_ord_2',
        name: 'tokyo_cherry_blossom.jpg',
        url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=900&auto=format&fit=crop&q=80',
        size: 3820109,
        format: 'print_12x18',
        finish: 'metallic',
        quantity: 1,
        uploadedAt: '2026-09-19T09:12:00.000Z',
        userId: 'user_customer_1',
      }
    ],
    subtotal: 22.06,
    shippingCost: 8.95,
    shippingMethod: 'DHL Express Worldwide',
    tax: 1.98,
    total: 32.99,
    status: 'In Transit',
    dhlTrackingNo: 'DHL-EXP-9402857123',
    dhlEvents: [
      {
        timestamp: '2026-09-22 14:30',
        status: 'Departed Facility in SAN FRANCISCO - USA',
        location: 'San Francisco Gateway Hub, CA',
        description: 'Processed at DHL Express Sort Facility',
      },
      {
        timestamp: '2026-09-22 09:15',
        status: 'Processed at Facility',
        location: 'Oakland Hub, CA',
        description: 'Shipment event code: AF - Arrived Facility',
      },
      {
        timestamp: '2026-09-21 17:40',
        status: 'Shipment Picked Up',
        location: 'PhotoPrint Labs, San Jose, CA',
        description: 'Handed over by lab dispatch to courier',
      },
    ],
    createdAt: '2026-09-21T15:20:00.000Z',
    estimatedDelivery: '2026-09-24 by end of day',
    isGuest: false,
    paymentMethod: {
      brand: 'Visa',
      last4: '4242',
    }
  }
];

export function generateDHLTrackingNo(): string {
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `DHL-EXP-${digits}`;
}

export function generateOrderNo(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `ORD-2026-${num}`;
}
