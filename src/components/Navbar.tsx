import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, ClipboardList } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useState } from 'react';

const Navbar = () => {
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/orders', label: 'Orders' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="font-display text-xl font-bold text-primary tracking-tight">
          Swahili Coastal Hub
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`font-body text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === l.to ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/cart" className="relative p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/cart" className="relative p-2">
            <ShoppingCart size={20} className="text-primary" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
            {mobileOpen ? <X size={22} className="text-foreground" /> : <Menu size={22} className="text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="flex flex-col gap-1 p-4">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`py-2 px-3 rounded-md font-body text-sm transition-colors ${
                  location.pathname === l.to ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
