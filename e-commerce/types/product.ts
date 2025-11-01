import { ObjectId } from 'mongodb';

export interface Product {
  _id?: ObjectId | string; // Support both ObjectId and string for serialization
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  lastUpdated: string; // ISO datetime
  image?: string; // Optional image URL
}

export interface ProductInput {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  image?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockItems: Product[];
  recentlyUpdated: Product[];
}

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: string;
  inventory: string;
  slug: string;
  image?: string;
}