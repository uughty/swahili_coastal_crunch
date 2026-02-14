import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/use-cart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Package, Clock, ChefHat, Truck, CheckCircle, ShoppingBag, Search, MapPin } from 'lucide-react';

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  received: { label: 'Received', icon: Package, color: 'text-accent' },
  preparing: { label: 'Preparing', icon: ChefHat, color: 'text-accent' },
  'in-transit': { label: 'In Transit', icon: Truck, color: 'text-primary' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-primary' },
};

const paymentLabels: Record<string, string> = {
  paypal: 'Card / PayPal',
  zelle: 'Zelle',
  cashapp: 'Cash App',
  cash: 'Cash on Delivery',
};

interface DbOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  items: any[];
  total: number;
  payment_method: string;
  status: string;
  created_at: string;
}

const OrdersPage = () => {
  const { orders: localOrders } = useCart();
  const [dbOrders, setDbOrders] = useState<DbOrder[]>([]);
  const [emailSearch, setEmailSearch] = useState('');
  const [searched, setSearched] = useState(false);

  const searchOrders = async () => {
    if (!emailSearch.trim()) return;
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', emailSearch.trim().toLowerCase())
      .order('created_at', { ascending: false });
    setDbOrders((data as DbOrder[]) || []);
    setSearched(true);
  };

  // Subscribe to real-time updates
  useEffect(() => {
    if (!searched || dbOrders.length === 0) return;
    const channel = supabase
      .channel('orders-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        setDbOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } as DbOrder : o));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [searched, dbOrders.length]);

  const hasOrders = dbOrders.length > 0 || localOrders.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">Order History</h1>
        <p className="text-muted-foreground font-body mb-6">Track your orders in real-time</p>

        {/* Email search */}
        <div className="bg-card rounded-xl border border-border p-4 mb-8">
          <label className="font-body text-sm font-medium text-foreground mb-2 block">Find your orders by email</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={emailSearch}
                onChange={e => setEmailSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchOrders()}
                placeholder="Enter your email address..."
                className="w-full bg-muted text-foreground rounded-lg pl-9 pr-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={searchOrders}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-body font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </div>
        </div>

        {searched && dbOrders.length === 0 && localOrders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag size={64} className="mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2">No orders found</h2>
            <p className="text-muted-foreground font-body mb-6">No orders found for this email address.</p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-body font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* DB Orders */}
            {dbOrders.map(order => {
              const status = statusConfig[order.status] || statusConfig.received;
              const StatusIcon = status.icon;
              return (
                <div key={order.id} className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-body text-xs text-muted-foreground">Order</p>
                      <p className="font-body font-bold text-foreground">{order.order_number}</p>
                    </div>
                    <div className={`flex items-center gap-2 ${status.color}`}>
                      <StatusIcon size={18} />
                      <span className="font-body text-sm font-semibold">{status.label}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {(order.items as any[]).map((item: any, i: number) => (
                      <div key={i} className="flex justify-between font-body text-sm">
                        <span className="text-foreground">{item.name} × {item.quantity}</span>
                        <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-3 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-4">
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Payment</p>
                        <p className="font-body text-sm font-medium text-foreground">{paymentLabels[order.payment_method] || order.payment_method}</p>
                      </div>
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Date</p>
                        <p className="font-body text-sm font-medium text-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {order.status === 'in-transit' && (
                        <Link
                          to={`/track/${order.id}`}
                          className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-body text-xs font-semibold hover:bg-primary/20 transition-colors"
                        >
                          <MapPin size={14} /> Track
                        </Link>
                      )}
                      <p className="font-body font-bold text-lg text-primary">${Number(order.total).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Local orders (session-only, fallback) */}
            {localOrders.map(order => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              return (
                <div key={order.id} className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-body text-xs text-muted-foreground">Order (local)</p>
                      <p className="font-body font-bold text-foreground">{order.id}</p>
                    </div>
                    <div className={`flex items-center gap-2 ${status.color}`}>
                      <StatusIcon size={18} />
                      <span className="font-body text-sm font-semibold">{status.label}</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between font-body text-sm">
                        <span className="text-foreground">{item.menuItem.name} × {item.quantity}</span>
                        <span className="text-muted-foreground">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between items-center">
                    <p className="font-body text-sm text-muted-foreground">{paymentLabels[order.paymentMethod]}</p>
                    <p className="font-body font-bold text-lg text-primary">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              );
            })}

            {!searched && !hasOrders && (
              <div className="text-center py-16">
                <ShoppingBag size={64} className="mx-auto text-muted-foreground/30 mb-4" />
                <h2 className="font-display text-2xl font-semibold text-foreground mb-2">No orders yet</h2>
                <p className="text-muted-foreground font-body mb-6">Enter your email above to find your orders.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;
