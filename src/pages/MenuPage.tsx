import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { menuCategories, allProducts } from '@/lib/menu-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MenuItemCard from '@/components/MenuItemCard';
import { ArrowRight, Search, Star, Filter, Utensils } from 'lucide-react';

type QualityFilter = 'all' | 'trending' | 'chef choice';

const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [qualityFilter, setQualityFilter] = useState<QualityFilter>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);

  const isSearching = searchQuery.trim().length > 0 || qualityFilter !== 'all' || ratingFilter > 0;

  const filteredProducts = allProducts.filter(p => {
    const matchesSearch = searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesQuality = qualityFilter === 'all' || p.tags.includes(qualityFilter);
    const matchesRating = p.rating >= ratingFilter;
    return matchesSearch && matchesQuality && matchesRating;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=600&fit=crop"
          alt="East African cuisine spread"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative z-10 text-center px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-accent mb-3"
          >
            <Utensils size={18} />
            <span className="font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground/80">
              Fresh • Authentic • Handmade
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-4"
          >
            Our Menu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-primary-foreground/80 font-body text-lg"
          >
            Authentic East African cuisine, made fresh in Kansas City
          </motion.p>
        </div>
      </section>

      <div className="py-12 container mx-auto px-4">
        {/* Search & Filters */}
        <div className="bg-card rounded-xl border border-border p-4 mb-10 -mt-8 relative z-20 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                className="w-full bg-muted text-foreground rounded-lg pl-10 pr-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-muted-foreground" />
              {(['all', 'trending', 'chef choice'] as QualityFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setQualityFilter(f)}
                  className={`px-3 py-2 rounded-lg font-body text-xs font-semibold capitalize transition-colors ${
                    qualityFilter === f
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <Star size={16} className="text-accent" />
              <select
                value={ratingFilter}
                onChange={e => setRatingFilter(Number(e.target.value))}
                className="bg-muted text-foreground rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={0}>All Ratings</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.7}>4.7+ Stars</option>
                <option value={4.9}>4.9+ Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {isSearching ? (
          <div>
            <p className="font-body text-sm text-muted-foreground mb-6">
              {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-display text-2xl font-bold text-foreground mb-2">No items found</p>
                <p className="font-body text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <MenuItemCard item={item} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuCategories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/menu/${cat.id}`}
                  className="group block bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-display text-2xl font-bold text-primary-foreground">{cat.name}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-muted-foreground font-body text-sm mb-3">{cat.description}</p>
                    <span className="inline-flex items-center gap-1 text-primary font-body text-sm font-semibold group-hover:gap-2 transition-all">
                      {cat.subcategories.length} types <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MenuPage;
