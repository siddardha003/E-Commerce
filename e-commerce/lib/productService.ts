import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';
import { Product, ProductInput, DashboardStats } from '../types/product';

export class ProductService {
  private static async getCollection(): Promise<Collection<Product>> {
    const db = await getDatabase();
    return db.collection<Product>('products');
  }

  static async getAllProducts(): Promise<Product[]> {
    const collection = await this.getCollection();
    return await collection.find({}).toArray();
  }

  static async getProductBySlug(slug: string): Promise<Product | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ slug });
  }

  static async getProductById(id: string): Promise<Product | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async createProduct(productData: ProductInput): Promise<Product> {
    const collection = await this.getCollection();
    const product: Product = {
      ...productData,
      lastUpdated: new Date().toISOString(),
    };
    
    const result = await collection.insertOne(product);
    const createdProduct = await collection.findOne({ _id: result.insertedId });
    
    if (!createdProduct) {
      throw new Error('Failed to create product');
    }
    
    return createdProduct;
  }

  static async updateProduct(id: string, productData: Partial<ProductInput>): Promise<Product | null> {
    const collection = await this.getCollection();
    const updateData = {
      ...productData,
      lastUpdated: new Date().toISOString(),
    };
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    return await this.getProductById(id);
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  static async getDashboardStats(): Promise<DashboardStats> {
    const collection = await this.getCollection();
    
    const totalProducts = await collection.countDocuments();
    
    // Get low stock items (inventory < 10)
    const lowStockItems = await collection
      .find({ inventory: { $lt: 10 } })
      .toArray();
    
    // Get recently updated items (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentlyUpdated = await collection
      .find({ lastUpdated: { $gte: sevenDaysAgo.toISOString() } })
      .sort({ lastUpdated: -1 })
      .limit(5)
      .toArray();
    
    return {
      totalProducts,
      lowStockItems,
      recentlyUpdated,
    };
  }

  static async getRecommendedProducts(limit: number = 6): Promise<Product[]> {
    const collection = await this.getCollection();
    // Simple recommendation: get random products with good inventory
    return await collection
      .aggregate<Product>([
        { $match: { inventory: { $gt: 0 } } },
        { $sample: { size: limit } }
      ])
      .toArray();
  }
}