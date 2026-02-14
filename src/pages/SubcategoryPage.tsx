import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { menuCategories } from '@/lib/menu-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const SubcategoryPage = () => {
  const { categoryId } = useParams();
  const category = menuCategories.find(c => c.id === categoryId);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Category not found</h1>
          <Link to="/menu" className="text-primary font-body font-semibold">Back to Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 container mx-auto px-4">
        <Link to="/menu" className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm mb-6 hover:text-foreground transition-colors">
          <ArrowLeft size={16} /> Back to Menu
        </Link>
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">{category.name}</h1>
        <p className="text-muted-foreground font-body mb-10">{category.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.subcategories.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/menu/${categoryId}/${sub.id}`}
                className="group block bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <h3 className="font-display text-lg font-bold text-primary-foreground">{sub.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-muted-foreground font-body text-sm mb-2">{sub.description}</p>
                  <span className="inline-flex items-center gap-1 text-primary font-body text-sm font-semibold">
                    {sub.products.length} item{sub.products.length !== 1 ? 's' : ''} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SubcategoryPage;
