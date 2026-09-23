import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PhotoItem,
  ProductPrice,
  DeliveryAddress,
  Order,
  UserAccount,
  ActivePage,
  PrintFinish,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  SAMPLE_PHOTOS,
  generateDHLTrackingNo,
  generateOrderNo,
} from '../data/initialData';

interface AppContextType {
  products: ProductPrice[];
  users: UserAccount[];
  orders: Order[];
  currentUser: UserAccount | null;
  activePhotos: PhotoItem[];
  currentPage: ActivePage;
  currentAddress: DeliveryAddress;
  latestOrder: Order | null;
  selectedOrderId: string | null;
  authIntent: 'guest' | 'signup' | 'login';
  setAuthIntent: (intent: 'guest' | 'signup' | 'login') => void;
  setCurrentPage: (page: ActivePage) => void;
  setSelectedOrderId: (id: string | null) => void;
  addUploadedPhotos: (files: File[]) => Promise<void>;
  addSamplePhotos: () => void;
  removePhoto: (id: string) => void;
  updatePhoto: (id: string, updates: Partial<PhotoItem>) => void;
  clearActivePhotos: () => void;
  setDeliveryAddress: (address: DeliveryAddress) => void;
  login: (email: string) => boolean;
  signup: (email: string, name?: string) => UserAccount;
  continueAsPaidGuest: (email: string, name?: string) => void;
  logout: () => void;
  placeOrder: (paymentMethod: { brand: string; last4: string }, shippingMethod: 'DHL Express Worldwide' | 'DHL Standard Ground') => Order;
  // Admin actions
  updateProductPrice: (productId: string, newPrice: number) => void;
  addProduct: (product: Omit<ProductPrice, 'id'>) => void;
  deleteProduct: (productId: string) => void;
  updateUser: (userId: string, updates: Partial<UserAccount>) => void;
  updateUserAddress: (userId: string, address: DeliveryAddress) => void;
  deleteUser: (userId: string) => void;
  removeUserPhoto: (userId: string, photoId: string) => void;
  addUserPhoto: (userId: string, photo: PhotoItem) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  reorderPhotos: (photos: PhotoItem[]) => void;
  // Price computation
  subtotal: number;
  totalPhotosCount: number;
  getProduct: (id: string) => ProductPrice | undefined;
}

const DEFAULT_ADDRESS: DeliveryAddress = {
  fullName: 'Alex Reynolds',
  street: '767 5th Ave',
  city: 'New York',
  state: 'NY',
  zipCode: '10153',
  country: 'United States',
  phone: '+1 (212) 555-4321',
  lat: 40.7638,
  lng: -73.9729,
  formattedAddress: '767 5th Ave, New York, NY 10153, USA',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [products, setProducts] = useState<ProductPrice[]>(() => {
    try {
      const saved = localStorage.getItem('photoprint_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('photoprint_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('photoprint_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Current session user - default to the demo customer account for ease of testing, or null
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('photoprint_current_user');
      if (saved) return JSON.parse(saved);
      return INITIAL_USERS[1]; // default to J. Sadler customer
    } catch {
      return INITIAL_USERS[1];
    }
  });

  // Start with 2 initial sample photos ready in cart so user immediately sees thumbnails at bottom of page!
  const [activePhotos, setActivePhotos] = useState<PhotoItem[]>(() => {
    try {
      const saved = localStorage.getItem('photoprint_active_photos');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'photo_init_1',
        name: 'mountain_sunset.jpg',
        url: SAMPLE_PHOTOS[0].url,
        size: SAMPLE_PHOTOS[0].size,
        format: 'print_4x6',
        finish: 'glossy',
        quantity: 2,
        uploadedAt: new Date().toISOString(),
        aspectRatio: 1.5,
      },
      {
        id: 'photo_init_2',
        name: 'coastal_cliffs.jpg',
        url: SAMPLE_PHOTOS[1].url,
        size: SAMPLE_PHOTOS[1].size,
        format: 'print_5x7',
        finish: 'matte',
        quantity: 1,
        uploadedAt: new Date().toISOString(),
        aspectRatio: 1.5,
      },
    ];
  });

  const [currentPage, setCurrentPage] = useState<ActivePage>('home');
  const [currentAddress, setCurrentAddressState] = useState<DeliveryAddress>(() => {
    try {
      const saved = localStorage.getItem('photoprint_address');
      return saved ? JSON.parse(saved) : DEFAULT_ADDRESS;
    } catch {
      return DEFAULT_ADDRESS;
    }
  });

  const [latestOrder, setLatestOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('photoprint_latest_order');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS[0];
    } catch {
      return INITIAL_ORDERS[0];
    }
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [authIntent, setAuthIntent] = useState<'guest' | 'signup' | 'login'>('guest');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('photoprint_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('photoprint_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('photoprint_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('photoprint_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('photoprint_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('photoprint_active_photos', JSON.stringify(activePhotos));
  }, [activePhotos]);

  useEffect(() => {
    localStorage.setItem('photoprint_address', JSON.stringify(currentAddress));
  }, [currentAddress]);

  useEffect(() => {
    if (latestOrder) {
      localStorage.setItem('photoprint_latest_order', JSON.stringify(latestOrder));
    }
  }, [latestOrder]);

  const getProduct = (id: string): ProductPrice | undefined => {
    return products.find((p) => p.id === id) || products[0];
  };

  // Uploading multiple real photos
  const addUploadedPhotos = async (files: File[]) => {
    const newItems: PhotoItem[] = [];
    for (const file of files) {
      const url = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      const photoItem: PhotoItem = {
        id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: file.name,
        url,
        size: file.size,
        format: 'print_4x6',
        finish: 'glossy',
        quantity: 1,
        uploadedAt: new Date().toISOString(),
        userId: currentUser?.id,
      };
      newItems.push(photoItem);

      // If user is logged in, immediately also append to their user uploaded archive!
      if (currentUser) {
        addUserPhoto(currentUser.id, photoItem);
      }
    }

    setActivePhotos((prev) => [...prev, ...newItems]);
  };

  const addSamplePhotos = () => {
    const timestamp = Date.now();
    const newItems: PhotoItem[] = SAMPLE_PHOTOS.map((sample, idx) => {
      const photoItem: PhotoItem = {
        id: `photo_sample_${timestamp}_${idx}`,
        name: sample.name,
        url: sample.url,
        size: sample.size,
        format: idx % 2 === 0 ? 'print_4x6' : 'print_5x7',
        finish: idx % 2 === 0 ? 'glossy' : 'matte',
        quantity: 1,
        uploadedAt: new Date().toISOString(),
        aspectRatio: sample.aspectRatio,
        userId: currentUser?.id,
      };

      if (currentUser) {
        addUserPhoto(currentUser.id, photoItem);
      }
      return photoItem;
    });

    setActivePhotos((prev) => [...prev, ...newItems]);
  };

  const removePhoto = (id: string) => {
    setActivePhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePhoto = (id: string, updates: Partial<PhotoItem>) => {
    setActivePhotos((prev) =>
      prev.map((photo) => (photo.id === id ? { ...photo, ...updates } : photo))
    );
  };

  const clearActivePhotos = () => {
    setActivePhotos([]);
  };

  const setDeliveryAddress = (address: DeliveryAddress) => {
    setCurrentAddressState(address);
    // If user is logged in, also update their account profile address
    if (currentUser) {
      updateUserAddress(currentUser.id, address);
    }
  };

  // Auth actions
  const login = (email: string): boolean => {
    const normalized = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === normalized);
    if (existing) {
      setCurrentUser(existing);
      if (existing.address) {
        setCurrentAddressState(existing.address);
      }
      return true;
    }
    // Create new account if not existing
    const newUser = signup(email, email.split('@')[0]);
    return !!newUser;
  };

  const signup = (email: string, name?: string): UserAccount => {
    const normalized = email.trim().toLowerCase();
    const displayName = name?.trim() || email.split('@')[0];
    const newUser: UserAccount = {
      id: `user_${Date.now()}`,
      email: normalized,
      name: displayName,
      role: normalized.includes('admin') ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      address: currentAddress,
      uploadedPhotos: [...activePhotos],
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const continueAsPaidGuest = (email: string, name?: string) => {
    setAuthIntent('guest');
    const guestUser: UserAccount = {
      id: `guest_${Date.now()}`,
      email: email.trim() || 'guest@photoprint.com',
      name: name?.trim() || 'Guest Customer',
      role: 'user',
      createdAt: new Date().toISOString(),
      address: currentAddress,
      uploadedPhotos: [...activePhotos],
    };
    setCurrentUser(guestUser);
    setCurrentPage('pay');
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Subtotal calculation
  const subtotal = activePhotos.reduce((acc, photo) => {
    const prod = getProduct(photo.format);
    const unitPrice = prod ? prod.price : 0.29;
    return acc + unitPrice * photo.quantity;
  }, 0);

  const totalPhotosCount = activePhotos.reduce((acc, photo) => acc + photo.quantity, 0);

  // Place Order
  const placeOrder = (
    paymentMethod: { brand: string; last4: string },
    shippingMethod: 'DHL Express Worldwide' | 'DHL Standard Ground'
  ): Order => {
    const shippingCost = shippingMethod === 'DHL Express Worldwide' ? 9.99 : 4.99;
    const tax = Number((subtotal * 0.0825).toFixed(2));
    const total = Number((subtotal + shippingCost + tax).toFixed(2));
    const dhlTrackingNo = generateDHLTrackingNo();
    const orderNo = generateOrderNo();

    const dhlEvents = [
      {
        timestamp: new Date().toLocaleString(),
        status: 'Shipment Information Received',
        location: 'PhotoPrint Labs Sorting Hub, US',
        description: 'Electronic shipment data received from merchant',
      },
    ];

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNo,
      userId: currentUser?.id || `guest_${Date.now()}`,
      customerName: currentAddress.fullName || currentUser?.name || 'Customer',
      customerEmail: currentUser?.email || 'customer@photoprint.com',
      customerPhone: currentAddress.phone || '+1 (555) 019-2831',
      shippingAddress: { ...currentAddress },
      photos: [...activePhotos],
      subtotal: Number(subtotal.toFixed(2)),
      shippingCost,
      shippingMethod,
      tax,
      total,
      status: 'Processing',
      dhlTrackingNo,
      dhlEvents,
      createdAt: new Date().toISOString(),
      estimatedDelivery:
        shippingMethod === 'DHL Express Worldwide'
          ? 'Tomorrow by 12:00 PM'
          : 'In 3-4 Business Days',
      isGuest: currentUser?.id.startsWith('guest_') ?? true,
      paymentMethod,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);

    // Save photos permanently to user account record
    if (currentUser) {
      activePhotos.forEach((photo) => {
        addUserPhoto(currentUser.id, photo);
      });
    }

    return newOrder;
  };

  // Reorder photos into cart
  const reorderPhotos = (photos: PhotoItem[]) => {
    const newItems = photos.map((p) => ({
      ...p,
      id: `photo_re_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      quantity: 1,
    }));
    setActivePhotos(newItems);
    setCurrentPage('checkout');
  };

  // Admin and user management
  const updateProductPrice = (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, price: Number(newPrice.toFixed(2)) } : p))
    );
  };

  const addProduct = (product: Omit<ProductPrice, 'id'>) => {
    const newProd: ProductPrice = {
      ...product,
      id: `prod_${Date.now()}`,
    };
    setProducts((prev) => [...prev, newProd]);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateUser = (userId: string, updates: Partial<UserAccount>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const updateUserAddress = (userId: string, address: DeliveryAddress) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, address } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, address } : null));
    }
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  const removeUserPhoto = (userId: string, photoId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        return {
          ...u,
          uploadedPhotos: u.uploadedPhotos.filter((p) => p.id !== photoId),
        };
      })
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              uploadedPhotos: prev.uploadedPhotos.filter((p) => p.id !== photoId),
            }
          : null
      );
    }
  };

  const addUserPhoto = (userId: string, photo: PhotoItem) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const exists = u.uploadedPhotos.some((p) => p.id === photo.id || (p.url === photo.url && p.name === photo.name));
        if (exists) return u;
        return {
          ...u,
          uploadedPhotos: [photo, ...u.uploadedPhotos],
        };
      })
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        const exists = prev.uploadedPhotos.some((p) => p.id === photo.id || (p.url === photo.url && p.name === photo.name));
        if (exists) return prev;
        return {
          ...prev,
          uploadedPhotos: [photo, ...prev.uploadedPhotos],
        };
      });
    }
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, ...updates } : ord))
    );
    if (latestOrder?.id === orderId) {
      setLatestOrder((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        users,
        orders,
        currentUser,
        activePhotos,
        currentPage,
        currentAddress,
        latestOrder,
        selectedOrderId,
        authIntent,
        setAuthIntent,
        setCurrentPage,
        setSelectedOrderId,
        addUploadedPhotos,
        addSamplePhotos,
        removePhoto,
        updatePhoto,
        clearActivePhotos,
        setDeliveryAddress,
        login,
        signup,
        continueAsPaidGuest,
        logout,
        placeOrder,
        updateProductPrice,
        addProduct,
        deleteProduct,
        updateUser,
        updateUserAddress,
        deleteUser,
        removeUserPhoto,
        addUserPhoto,
        updateOrder,
        reorderPhotos,
        subtotal,
        totalPhotosCount,
        getProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
