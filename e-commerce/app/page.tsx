import { ProductService } from '../lib/productService';
import ProductGrid from '../components/ProductGrid';
import { Product } from '../types/product';

// Static Site Generation (SSG) - Fetch products at build time
export default async function HomePage() {
  let products: Product[] = [];
  
  try {
    const rawProducts = await ProductService.getAllProducts();
    // Convert MongoDB documents to plain objects
    products = rawProducts.map(product => ({
      ...product,
      _id: product._id?.toString(),
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    // In production, you might want to show an error page or fallback
  }

  return (
    <main>
      <ProductGrid products={products} />
    </main>
  );
}
