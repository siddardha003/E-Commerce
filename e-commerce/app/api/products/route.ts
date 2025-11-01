import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '../../../lib/productService';
import { ProductInput, ApiResponse } from '../../../types/product';

// Helper function to check admin authentication
function isAdmin(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  return adminKey === process.env.ADMIN_KEY;
}

// GET /api/products - Fetch all products OR single product by slug
// Usage: /api/products (all) OR /api/products?slug=product-slug (single)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (slug) {
      // Get single product by slug
      const product = await ProductService.getProductBySlug(slug);
      
      if (!product) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Product not found',
        };
        return NextResponse.json(response, { status: 404 });
      }
      
      const response: ApiResponse<typeof product> = {
        success: true,
        data: product,
      };
      
      return NextResponse.json(response);
    } else {
      // Get all products
      const products = await ProductService.getAllProducts();
      
      const response: ApiResponse<typeof products> = {
        success: true,
        data: products,
      };
      
      return NextResponse.json(response);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch products',
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/products - Add a new product (Admin only)
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Unauthorized',
    };
    return NextResponse.json(response, { status: 401 });
  }

  try {
    const body = await request.json();
    const productData: ProductInput = body;

    // Validate required fields
    const requiredFields = ['name', 'slug', 'description', 'price', 'category', 'inventory'];
    for (const field of requiredFields) {
      if (!productData[field as keyof ProductInput]) {
        const response: ApiResponse<null> = {
          success: false,
          error: `Missing required field: ${field}`,
        };
        return NextResponse.json(response, { status: 400 });
      }
    }

    const product = await ProductService.createProduct(productData);
    
    const response: ApiResponse<typeof product> = {
      success: true,
      data: product,
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create product',
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}