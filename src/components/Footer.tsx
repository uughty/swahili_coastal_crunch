import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3 className="font-display text-2xl font-bold mb-3">Swahili Coastal Hub</h3>
          <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
            Bringing authentic East African flavors to the heart of Kansas. Fresh, handmade, and full of love.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { to: '/', label: 'Home' },
              { to: '/menu', label: 'Menu' },
              { to: '/orders', label: 'Order History' },
              { to: '/cart', label: 'Cart' },
            ].map(link => (
              <li key={link.to}>
                <Link to={link.to} className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
              <span className="font-body text-sm text-primary-foreground/70">
                1234 Main Street<br />Kansas City, KS 66101
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-accent" />
              <span className="font-body text-sm text-primary-foreground/70">(913) 555-0123</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-accent" />
              <span className="font-body text-sm text-primary-foreground/70">hello@swahilicoastalhub.com</span>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Hours</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Clock size={16} className="shrink-0 text-accent" />
              <div className="font-body text-sm text-primary-foreground/70">
                <p>Mon — Fri: 10am – 9pm</p>
                <p>Sat — Sun: 9am – 10pm</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Swahili Coastal Hub. All rights reserved. Kansas City, KS.
        </p>
        <p className="font-body text-xs text-primary-foreground/50">
          East African Flavors • Kansas City Soul
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
