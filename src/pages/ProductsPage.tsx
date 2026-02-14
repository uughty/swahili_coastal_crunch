import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { menuCategories } from '@/lib/menu-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MenuItemCard from '@/components/MenuItemCard';
import { ArrowLeft } from 'lucide-react';

const ProductsPage = () => {
  const { categoryId, subcategoryId } = useParams();
  const category = menuCategories.find(c => c.id === categoryId);
  const subcategory = category?.subcategories.find(s => s.id === subcategoryId);

  if (!category || !subcategory) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Not found</h1>
          <Link to="/menu" className="text-primary font-body font-semibold">Back to Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 container mx-auto px-4">
        <Link
          to={`/menu/${categoryId}`}
          className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm mb-6 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Back to {category.name}
        </Link>
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">{subcategory.name}</h1>
        <p className="text-muted-foreground font-body mb-10">{subcategory.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategory.products.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <MenuItemCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
