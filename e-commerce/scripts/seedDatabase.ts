import { ProductService } from '../lib/productService';
import { ProductInput } from '../types/product';

const sampleProducts: ProductInput[] = [
  {
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 199.99,
    category: 'Electronics',
    inventory: 25,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'
  },
  {
    name: 'Organic Cotton T-Shirt',
    slug: 'organic-cotton-t-shirt',
    description: 'Comfortable and eco-friendly organic cotton t-shirt available in multiple colors. Sustainable fashion at its best.',
    price: 29.99,
    category: 'Clothing',
    inventory: 50,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80'
  },
  {
    name: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    description: 'Track your health and fitness with this advanced smartwatch featuring heart rate monitoring, GPS, and water resistance.',
    price: 299.99,
    category: 'Electronics',
    inventory: 15,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'
  },
  {
    name: 'Artisan Coffee Beans',
    slug: 'artisan-coffee-beans',
    description: 'Single-origin coffee beans roasted to perfection. Rich, full-bodied flavor with notes of chocolate and caramel.',
    price: 24.99,
    category: 'Food & Beverages',
    inventory: 100,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&q=80'
  },
  {
    name: 'Yoga Mat Pro',
    slug: 'yoga-mat-pro',
    description: 'Professional-grade yoga mat with superior grip and cushioning. Perfect for all types of yoga and fitness exercises.',
    price: 79.99,
    category: 'Sports & Fitness',
    inventory: 30,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80'
  },
  {
    name: 'Wireless Keyboard',
    slug: 'wireless-keyboard',
    description: 'Ergonomic wireless keyboard with backlit keys and long battery life. Ideal for both office and gaming use.',
    price: 89.99,
    category: 'Electronics',
    inventory: 40,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80'
  },
  {
    name: 'Leather Wallet',
    slug: 'leather-wallet',
    description: 'Handcrafted genuine leather wallet with RFID protection and multiple card slots. Timeless design and durability.',
    price: 59.99,
    category: 'Accessories',
    inventory: 60,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80'
  },
  {
    name: 'Stainless Steel Water Bottle',
    slug: 'stainless-steel-water-bottle',
    description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly.',
    price: 34.99,
    category: 'Home & Kitchen',
    inventory: 75,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80'
  },
  {
    name: 'Bluetooth Speaker',
    slug: 'bluetooth-speaker',
    description: 'Portable Bluetooth speaker with powerful bass and 360-degree sound. Waterproof design perfect for outdoor adventures.',
    price: 79.99,
    category: 'Electronics',
    inventory: 35,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80'
  },
  {
    name: 'Running Shoes',
    slug: 'running-shoes',
    description: 'Lightweight running shoes with advanced cushioning and breathable mesh upper. Designed for comfort and performance.',
    price: 129.99,
    category: 'Sports & Fitness',
    inventory: 8, // Low stock for demo
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'
  },
  {
    name: 'Plant-Based Protein Powder',
    slug: 'plant-based-protein-powder',
    description: 'Organic plant-based protein powder with complete amino acid profile. Vanilla flavor, perfect for smoothies and shakes.',
    price: 49.99,
    category: 'Health & Wellness',
    inventory: 5, // Low stock for demo
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80'
  },
  {
    name: 'Ceramic Coffee Mug',
    slug: 'ceramic-coffee-mug',
    description: 'Handmade ceramic coffee mug with unique glaze pattern. Microwave and dishwasher safe. Perfect for your morning coffee.',
    price: 19.99,
    category: 'Home & Kitchen',
    inventory: 90,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=500&q=80'
  }
];

export async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    // Get all existing products
    const existingProducts = await ProductService.getAllProducts();
    console.log(`Found ${existingProducts.length} existing products`);
    
    // Only seed if database is empty
    if (existingProducts.length === 0) {
      console.log('Database is empty, seeding with sample data...');
      
      for (const productData of sampleProducts) {
        try {
          const product = await ProductService.createProduct(productData);
          console.log(`Created product: ${product.name}`);
        } catch (error) {
          console.error(`Failed to create product ${productData.name}:`, error);
        }
      }
      
      console.log('Database seeding completed successfully!');
    } else {
      console.log('Database already contains products, skipping seeding.');
    }
  } catch (error) {
    console.error('Error during database seeding:', error);
    throw error;
  }
}

// Export sample data for use in other contexts
export { sampleProducts };