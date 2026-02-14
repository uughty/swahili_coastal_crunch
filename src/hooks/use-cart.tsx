import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartItem, MenuItem, Order, PaymentMethod } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addItem: (menuItem: MenuItem, quantity: number, selectedOptions: Record<string, string>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  orders: Order[];
  placeOrder: (details: { name: string; email: string; phone: string; address: string; paymentMethod: PaymentMethod }) => Order;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addItem = useCallback((menuItem: MenuItem, quantity: number, selectedOptions: Record<string, string>) => {
    setItems(prev => {
      const key = menuItem.id + JSON.stringify(selectedOptions);
      const existingIndex = prev.findIndex(i => i.menuItem.id + JSON.stringify(i.selectedOptions) === key);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + quantity };
        return updated;
      }
      return [...prev, { menuItem, quantity, selectedOptions }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.menuItem.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.menuItem.id !== id));
    } else {
      setItems(prev => prev.map(i => i.menuItem.id === id ? { ...i, quantity } : i));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const placeOrder = useCallback((details: { name: string; email: string; phone: string; address: string; paymentMethod: PaymentMethod }) => {
    const order: Order = {
      id: 'ORD-' + Date.now().toString(36).toUpperCase(),
      items: [...items],
      total,
      status: 'received',
      paymentMethod: details.paymentMethod,
      createdAt: new Date().toISOString(),
      customerName: details.name,
      customerEmail: details.email,
      customerPhone: details.phone,
      deliveryAddress: details.address,
    };
    setOrders(prev => [order, ...prev]);
    setItems([]);
    return order;
  }, [items, total]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, orders, placeOrder }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
