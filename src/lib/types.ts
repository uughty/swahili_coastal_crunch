export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  prepTime: string;
  tags: string[];
  options?: MenuItemOption[];
}

export interface MenuItemOption {
  name: string;
  choices: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: Record<string, string>;
}

export type PaymentMethod = 'paypal' | 'zelle' | 'cashapp' | 'cash';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'received' | 'preparing' | 'in-transit' | 'delivered';
  paymentMethod: PaymentMethod;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
}
