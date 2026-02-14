import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import Navbar from '@/components/Navbar';

const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold text-foreground">Your Cart</h1>
            <p className="text-muted-foreground font-body">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-destructive font-body text-sm font-medium hover:underline">
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground font-body mb-6">Explore our menu and add some delicious items!</p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-body font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <ArrowLeft size={16} /> Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map(item => (
                <div
                  key={item.menuItem.id + JSON.stringify(item.selectedOptions)}
                  className="flex gap-4 p-4 bg-card rounded-xl border border-border"
                >
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-semibold text-foreground truncate">{item.menuItem.name}</h3>
                    {Object.entries(item.selectedOptions).length > 0 && (
                      <p className="text-muted-foreground font-body text-xs">
                        {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(', ')}
                      </p>
                    )}
                    <p className="font-body font-bold text-primary mt-1">${(item.menuItem.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeItem(item.menuItem.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1">
                      <button onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)} className="p-0.5">
                        <Minus size={14} className="text-foreground" />
                      </button>
                      <span className="font-body text-sm font-medium w-5 text-center text-foreground">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)} className="p-0.5">
                        <Plus size={14} className="text-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-8 bg-card rounded-xl border border-border p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-primary font-medium">Free</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-body font-bold text-lg">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 rounded-lg font-body font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
