
export type Role = 'CUSTOMER' | 'ADMIN' | 'KITCHEN';
export type PaymentStatus = 'PAID' | 'UNPAID' | 'PENDING';
export type PaymentMethod = 'OVO' | 'GOPAY' | 'DANA' | 'VA' | 'CASH';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minStock: number;
}

export interface InventoryReport {
  id: string;
  timestamp: Date;
  reporterName: string;
  items: { itemId: string; name: string; usedAmount: number }[];
  note: string;
}

export interface Review {
  id: string;
  orderId: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: Date;
}
