import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PaymentMethod } from '@/lib/types';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, Loader2, CreditCard, DollarSign, Banknote, Wallet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const paymentMethods: { id: PaymentMethod; name: string; icon: React.ReactNode; description: string }[] = [
  { id: 'paypal', name: 'Card / PayPal', icon: <CreditCard size={20} />, description: 'Pay securely with card or PayPal via Stripe' },
  { id: 'cashapp', name: 'Cash App', icon: <DollarSign size={20} />, description: 'Pay with Cash App through Stripe checkout' },
  { id: 'zelle', name: 'Zelle', icon: <Wallet size={20} />, description: 'Pay via Zelle — instructions will be provided after order' },
  { id: 'cash', name: 'Cash on Delivery', icon: <Banknote size={20} />, description: 'Pay when your order arrives' },
];

const CheckoutPage = () => {
  const { items, total, placeOrder, clearCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [zelleInfo, setZelleInfo] = useState(false);

  // Handle Stripe redirect
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      const sessionId = searchParams.get('session_id');
      clearCart();
      setOrderPlaced(sessionId || 'STRIPE-' + Date.now().toString(36).toUpperCase());
      toast.success('Payment successful! Order confirmed.');
    }
    if (searchParams.get('canceled') === 'true') {
      toast.error('Payment was canceled');
    }
  }, [searchParams, clearCart]);

  if (items.length === 0 && !orderPlaced) {
    if (!searchParams.get('success')) {
      navigate('/cart');
      return null;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      if (selectedPayment === 'cash' || selectedPayment === 'zelle') {
        // Handle cash/zelle - your existing logic
        const order = placeOrder({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          paymentMethod: selectedPayment,
        });

        if (selectedPayment === 'zelle') {
          setZelleInfo(true);
        }
        setOrderPlaced(order.id);
        toast.success(selectedPayment === 'zelle' ? 'Order placed! Please complete Zelle payment.' : 'Order placed! Pay on delivery.');
      } else {
        // ✅ FIXED STRIPE INTEGRATION
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: {
            items: items.map(i => ({
              name: i.menuItem.name,
              price: i.menuItem.price,
              quantity: i.quantity,
              options: Object.values(i.selectedOptions).join(', ') || undefined,
            })),
            customer_email: formData.email,    // ✅ FIXED: snake_case
            customer_name: formData.name,     // ✅ FIXED: snake_case
            paymentMethod: selectedPayment,
          },
        });

        if (error) {
          console.error('Supabase function error:', error);
          throw new Error(error.message || 'Failed to create checkout session');
        }

        if (data?.url) {
          // Edge Function already saves order - just redirect
          window.location.href = data.url;
        } else {
          throw new Error('No checkout URL received from server');
        }
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error(err.message || 'Payment setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 container mx-auto px-4 max-w-lg text-center">
          <div className="bg-card rounded-2xl border border-border p-8">
            <CheckCircle size={64} className="mx-auto text-primary mb-4" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground font-body mb-4">Your order has been placed successfully.</p>
            <div className="bg-muted rounded-lg p-4 mb-6">
              <p className="font-body text-sm text-muted-foreground">Order ID</p>
              <p className="font-body text-lg font-bold text-foreground">{orderPlaced}</p>
            </div>

            {zelleInfo && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">Zelle Payment Instructions</h3>
                <p className="font-body text-sm text-muted-foreground mb-2">
                  Please send <span className="font-bold text-foreground">${total.toFixed(2)}</span> via Zelle to:
                </p>
                <p className="font-body text-sm font-bold text-foreground">hello@swahilicoastalhub.com</p>
                <p className="font-body text-xs text-muted-foreground mt-2">
                  Include your Order ID in the memo. Your order will be confirmed once payment is received.
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/orders')}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-body font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate('/menu')}
                className="bg-muted text-foreground px-6 py-3 rounded-lg font-body font-semibold text-sm hover:bg-secondary transition-colors"
              >
                Order More
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => navigate('/cart')}
          className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm mb-6 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Back to Cart
        </button>

        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          {/* Delivery Details */}
          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Delivery Details</h2>
            <div className="grid gap-4">
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Full Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-muted text-foreground border border-border rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="John Doe" required />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-muted text-foreground border border-border rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="john@example.com" required />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Phone</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-muted text-foreground border border-border rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="+1 234 567 8900" required />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Delivery Address</label>
                <textarea value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                  className="w-full bg-muted text-foreground border border-border rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" rows={3} placeholder="123 Main St, Kansas City, KS" required />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Payment Method</h2>
            <div className="grid gap-3">
              {paymentMethods.map(pm => (
                <button key={pm.id} type="button" onClick={() => setSelectedPayment(pm.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    selectedPayment === pm.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <span className="text-accent">{pm.icon}</span>
                  <div className="flex-1">
                    <p className="font-body font-semibold text-foreground">{pm.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{pm.description}</p>
                  </div>
                  {selectedPayment === pm.id && <CheckCircle size={20} className="text-primary" />}
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.menuItem.id} className="flex justify-between font-body text-sm">
                  <span className="text-foreground">
                    {item.menuItem.name} × {item.quantity}
                    {Object.keys(item.selectedOptions).length > 0 && (
                      <span className="text-muted-foreground ml-1">({Object.values(item.selectedOptions).join(', ')})</span>
                    )}
                  </span>
                  <span className="text-foreground font-medium">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-body font-bold text-lg">
              <span className="text-foreground">Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-accent text-accent-foreground py-4 rounded-xl font-body font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : `Place Order — $${total.toFixed(2)}`}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
