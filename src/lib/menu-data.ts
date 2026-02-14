import { MenuItem, MenuItemOption } from './types';

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  products: MenuItem[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  subcategories: SubCategory[];
}

const spiceLevelOption: MenuItemOption = { name: 'Spice Level', choices: ['Mild', 'Medium', 'Hot', 'Extra Hot'] };
const fillingOption: MenuItemOption = { name: 'Filling', choices: ['Beef', 'Chicken', 'Vegetable', 'Lamb'] };
const sizeOption: MenuItemOption = { name: 'Size', choices: ['Regular', 'Large', 'Family Pack'] };

export const menuCategories: Category[] = [
  {
    id: 'samosa',
    name: 'Samosa / Sambusa',
    description: 'Crispy hand-folded pastries with savory fillings — a Kansas City favorite',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop',
    subcategories: [
      {
        id: 'beef-samosa',
        name: 'Beef Samosa',
        description: 'Classic beef-filled samosas with aromatic spices',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
        products: [
          {
            id: 'bs1', name: 'Classic Beef Samosa', description: 'Crispy golden pastry filled with seasoned ground beef, onions, cilantro, and our signature spice blend. Served with tamarind chutney.',
            price: 3.99, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
            category: 'Samosa', rating: 4.9, prepTime: '10 min', tags: ['trending', 'chef choice'],
            options: [spiceLevelOption, sizeOption],
          },
          {
            id: 'bs2', name: 'Spicy Beef Samosa', description: 'Extra hot version with jalapeños and habanero-infused beef filling. Not for the faint-hearted!',
            price: 4.49, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
            category: 'Samosa', rating: 4.7, prepTime: '10 min', tags: ['trending'],
            options: [sizeOption],
          },
        ],
      },
      {
        id: 'chicken-samosa',
        name: 'Chicken Samosa',
        description: 'Tender chicken filling wrapped in flaky pastry',
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
        products: [
          {
            id: 'cs1', name: 'Chicken Tikka Samosa', description: 'Marinated chicken tikka pieces wrapped in crispy pastry with mint yogurt dip.',
            price: 4.29, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
            category: 'Samosa', rating: 4.8, prepTime: '12 min', tags: ['chef choice'],
            options: [spiceLevelOption, sizeOption],
          },
          {
            id: 'cs2', name: 'Butter Chicken Samosa', description: 'Creamy butter chicken filling in a perfectly crispy shell. A fusion favorite.',
            price: 4.49, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
            category: 'Samosa', rating: 4.6, prepTime: '12 min', tags: ['trending'],
            options: [sizeOption],
          },
        ],
      },
      {
        id: 'veggie-samosa',
        name: 'Vegetable Samosa',
        description: 'Fresh vegetables and aromatic spices',
        image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop',
        products: [
          {
            id: 'vs1', name: 'Potato & Pea Samosa', description: 'Traditional vegetable samosa with spiced potatoes, green peas, and fresh herbs.',
            price: 3.49, image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop',
            category: 'Samosa', rating: 4.5, prepTime: '10 min', tags: [],
            options: [spiceLevelOption, sizeOption],
          },
        ],
      },
    ],
  },
  {
    id: 'mahamri',
    name: 'Mahamri',
    description: 'Sweet and fluffy East African doughnuts — freshly made daily in Kansas',
    image: 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=600&h=400&fit=crop',
    subcategories: [
      {
        id: 'classic-mahamri',
        name: 'Classic Mahamri',
        description: 'Traditional coconut milk doughnuts',
        image: 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=400&h=300&fit=crop',
        products: [
          {
            id: 'mh1', name: 'Original Mahamri', description: 'Traditional Swahili doughnuts made with coconut milk, cardamom, and yeast. Light, fluffy, and subtly sweet.',
            price: 5.99, image: 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=400&h=300&fit=crop',
            category: 'Mahamri', rating: 4.8, prepTime: '8 min', tags: ['chef choice', 'trending'],
            options: [sizeOption],
          },
          {
            id: 'mh2', name: 'Cardamom Mahamri', description: 'Extra cardamom-infused mahamri with a fragrant, aromatic twist. Served warm with chai.',
            price: 6.49, image: 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=400&h=300&fit=crop',
            category: 'Mahamri', rating: 4.7, prepTime: '8 min', tags: [],
            options: [sizeOption],
          },
        ],
      },
      {
        id: 'stuffed-mahamri',
        name: 'Stuffed Mahamri',
        description: 'Filled mahamri with sweet and savory options',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
        products: [
          {
            id: 'mh3', name: 'Nutella Stuffed Mahamri', description: 'Warm mahamri stuffed with Nutella and dusted with powdered sugar. A dessert lovers dream.',
            price: 7.49, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
            category: 'Mahamri', rating: 4.9, prepTime: '10 min', tags: ['trending'],
            options: [sizeOption],
          },
        ],
      },
    ],
  },
  {
    id: 'kaimati',
    name: 'Kaimati',
    description: 'Golden fried dough balls drenched in sweet syrup — irresistible treats',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop',
    subcategories: [
      {
        id: 'traditional-kaimati',
        name: 'Traditional Kaimati',
        description: 'Classic sweet dough balls',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
        products: [
          {
            id: 'km1', name: 'Classic Kaimati', description: 'Golden fried dough balls soaked in cardamom-infused sugar syrup. Crispy outside, soft inside.',
            price: 4.99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
            category: 'Kaimati', rating: 4.6, prepTime: '8 min', tags: ['chef choice'],
            options: [sizeOption],
          },
          {
            id: 'km2', name: 'Honey Glazed Kaimati', description: 'Kaimati drizzled with pure Kansas honey and a sprinkle of sesame seeds.',
            price: 5.49, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
            category: 'Kaimati', rating: 4.5, prepTime: '8 min', tags: ['trending'],
            options: [sizeOption],
          },
        ],
      },
      {
        id: 'premium-kaimati',
        name: 'Premium Kaimati',
        description: 'Gourmet takes on the classic',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
        products: [
          {
            id: 'km3', name: 'Chocolate Kaimati', description: 'Kaimati coated in dark chocolate ganache with coconut shavings. An indulgent treat.',
            price: 6.99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
            category: 'Kaimati', rating: 4.8, prepTime: '10 min', tags: ['trending', 'chef choice'],
            options: [sizeOption],
          },
        ],
      },
    ],
  },
  {
    id: 'chapati',
    name: 'Chapati',
    description: 'Soft layered flatbread — handmade fresh with every order',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop',
    subcategories: [
      {
        id: 'plain-chapati',
        name: 'Plain Chapati',
        description: 'Classic handmade flatbread',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
        products: [
          {
            id: 'ch1', name: 'Original Chapati', description: 'Soft, flaky, layered flatbread made fresh on the griddle. Perfect with any curry or stew.',
            price: 2.99, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
            category: 'Chapati', rating: 4.7, prepTime: '5 min', tags: ['chef choice'],
            options: [sizeOption],
          },
          {
            id: 'ch2', name: 'Butter Chapati', description: 'Chapati brushed with melted butter for extra richness and flakiness.',
            price: 3.49, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
            category: 'Chapati', rating: 4.6, prepTime: '5 min', tags: ['trending'],
            options: [sizeOption],
          },
        ],
      },
      {
        id: 'chapati-wraps',
        name: 'Chapati Wraps',
        description: 'Chapati rolled with delicious fillings',
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
        products: [
          {
            id: 'ch3', name: 'Beef Chapati Wrap', description: 'Soft chapati wrapped around spiced ground beef, fresh veggies, and tangy sauce.',
            price: 8.99, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
            category: 'Chapati', rating: 4.8, prepTime: '12 min', tags: ['trending', 'chef choice'],
            options: [spiceLevelOption, fillingOption],
          },
          {
            id: 'ch4', name: 'Chicken Chapati Wrap', description: 'Grilled chicken with fresh veggies and spicy mayo rolled in warm chapati.',
            price: 8.99, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
            category: 'Chapati', rating: 4.7, prepTime: '12 min', tags: [],
            options: [spiceLevelOption],
          },
        ],
      },
    ],
  },
];

// Chef's collection for homepage
export const chefsCollection = [
  {
    id: 'chef1',
    name: 'Classic Beef Samosa',
    description: 'Our signature samosa — hand-folded crispy pastry stuffed with seasoned ground beef, fresh onions, and our secret spice blend. Served with house-made tamarind chutney. A Kansas City staple.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop',
    price: 3.99,
    chefNote: 'Chef Amina\'s personal recipe — perfected over 20 years.',
  },
  {
    id: 'chef2',
    name: 'Original Mahamri',
    description: 'Traditional East African doughnuts made with coconut milk, cardamom, and love. Light, fluffy, and subtly sweet — pair with our spiced chai for the ultimate experience.',
    image: 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=800&h=600&fit=crop',
    price: 5.99,
    chefNote: 'Best enjoyed warm, straight from the fryer. A family recipe.',
  },
  {
    id: 'chef3',
    name: 'Chocolate Kaimati',
    description: 'Golden dough balls fried to perfection, coated in rich dark chocolate ganache, and topped with toasted coconut shavings. Sweet, crunchy, and utterly indulgent.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
    price: 6.99,
    chefNote: 'Our most-requested dessert — a modern twist on a classic treat.',
  },
  {
    id: 'chef4',
    name: 'Beef Chapati Wrap',
    description: 'Soft handmade chapati wrapped around perfectly seasoned ground beef, crisp vegetables, and our signature tangy sauce. A hearty meal on the go, Kansas style.',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&h=600&fit=crop',
    price: 8.99,
    chefNote: 'The best grab-and-go lunch in Kansas City — guaranteed to satisfy.',
  },
];

// Flatten all products for search
export const allProducts = menuCategories.flatMap(c => c.subcategories.flatMap(s => s.products));
