import heroBg from '@/assets/hero-bg.jpg';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChefHat } from 'lucide-react';
import { chefsCollection } from '@/lib/menu-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[80vh] min-h-[550px] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Swahili coastal dining" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-warm-gold font-body text-sm font-semibold uppercase tracking-[0.25em] mb-4"
          >
            Authentic East African Cuisine • Kansas City, KS
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
          >
            Swahili<br />Coastal Hub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-primary-foreground/80 font-body text-lg mb-8 max-w-xl mx-auto"
          >
            East African flavors, handmade fresh in the heart of Kansas.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg font-body font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Explore Our Menu <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Chef's Collection - Zigzag */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-accent mb-3">
              <ChefHat size={20} />
              <span className="font-body text-sm font-semibold uppercase tracking-widest">Chef&apos;s Collection</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Signature Creations
            </h2>
          </div>

          <div className="space-y-20">
            {chefsCollection.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7 }}
                className={`flex flex-col gap-8 items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="w-full md:w-1/2">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-body font-bold">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}`}>
                  <h3 className="font-display text-3xl font-bold text-foreground mb-4">{item.name}</h3>
                  <p className="text-muted-foreground font-body text-base leading-relaxed mb-4">{item.description}</p>
                  <div className="bg-secondary/60 rounded-lg p-4 mb-6">
                    <p className="font-body text-sm italic text-foreground/80">
                      <span className="font-semibold text-accent">Chef&apos;s Note:</span> {item.chefNote}
                    </p>
                  </div>
                  <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-body font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Order Now <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-secondary/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="font-body text-sm font-semibold uppercase tracking-widest text-accent">Our Kitchen</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2">Gallery</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {chefsCollection.map((item, i) => (
              <motion.div
                key={`gallery-${item.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative rounded-xl overflow-hidden ${
                  i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                } aspect-square group cursor-pointer`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-colors duration-300 flex items-center justify-center">
                  <p className="text-primary-foreground font-display text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
