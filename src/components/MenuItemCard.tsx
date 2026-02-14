import { useState } from 'react';
import { Star, Clock, Plus, Minus, X } from 'lucide-react';
import { MenuItem } from '@/lib/types';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  item: MenuItem;
}

const MenuItemCard = ({ item }: Props) => {
  const [showDetail, setShowDetail] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(item, quantity, selectedOptions);
    toast.success(`${item.name} added to cart!`);
    setQuantity(1);
    setSelectedOptions({});
    setShowDetail(false);
  };

  return (
    <>
      {/* Card - click to open detail */}
      <div
        onClick={() => setShowDetail(true)}
        className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer group"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {item.tags.length > 0 && (
            <div className="absolute top-3 left-3 flex gap-1.5">
              {item.tags.map(tag => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${
                    tag === 'chef choice' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-display text-lg font-semibold text-foreground">{item.name}</h3>
            <span className="font-body font-bold text-primary text-lg">${item.price.toFixed(2)}</span>
          </div>
          <p className="text-muted-foreground font-body text-sm line-clamp-2">{item.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-warm-gold fill-warm-gold" />
              <span className="font-body text-xs font-medium text-foreground">{item.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock size={14} />
              <span className="font-body text-xs">{item.prepTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm"
            onClick={() => setShowDetail(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="relative">
                <img src={item.image} alt={item.name} className="w-full h-56 object-cover rounded-t-2xl" />
                <button
                  onClick={() => setShowDetail(false)}
                  className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm p-2 rounded-full"
                >
                  <X size={18} className="text-foreground" />
                </button>
                {item.tags.length > 0 && (
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className={`px-3 py-1 rounded-full text-xs font-body font-semibold ${
                          tag === 'chef choice' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="font-display text-2xl font-bold text-foreground">{item.name}</h2>
                  <span className="font-body font-bold text-primary text-2xl">${item.price.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-warm-gold fill-warm-gold" />
                    <span className="font-body text-sm font-medium text-foreground">{item.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock size={16} />
                    <span className="font-body text-sm">{item.prepTime}</span>
                  </div>
                </div>

                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6">{item.description}</p>

                {/* Options */}
                {item.options && item.options.map(opt => (
                  <div key={opt.name} className="mb-4">
                    <label className="font-body text-sm font-semibold text-foreground mb-2 block">{opt.name}</label>
                    <div className="flex gap-2 flex-wrap">
                      {opt.choices.map(c => (
                        <button
                          key={c}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.name]: c }))}
                          className={`px-4 py-2 rounded-lg font-body text-sm transition-colors ${
                            selectedOptions[opt.name] === c
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-secondary'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Quantity & Add */}
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-3 bg-muted rounded-lg px-3 py-2">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1 rounded hover:bg-secondary">
                      <Minus size={16} className="text-foreground" />
                    </button>
                    <span className="font-body text-base font-semibold w-8 text-center text-foreground">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="p-1 rounded hover:bg-secondary">
                      <Plus size={16} className="text-foreground" />
                    </button>
                  </div>
                  <button
                    onClick={handleAdd}
                    className="flex-1 bg-accent text-accent-foreground py-3 rounded-lg font-body font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    Add to Cart — ${(item.price * quantity).toFixed(2)}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MenuItemCard;
