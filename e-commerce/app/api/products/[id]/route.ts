import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '../../../../lib/productService';
import { ProductInput, ApiResponse } from '../../../../types/product';

// Helper function to check admin authentication
function isAdmin(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  return adminKey === process.env.ADMIN_KEY;
}

// PUT /api/products/[id] - Update existing product (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Unauthorized',
    };
    return NextResponse.json(response, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const productData: Partial<ProductInput> = body;

    const product = await ProductService.updateProduct(id, productData);
    
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
  } catch (error) {
    console.error('Error updating product:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update product',
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/products/[id] - Delete product (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Unauthorized',
    };
    return NextResponse.json(response, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await ProductService.deleteProduct(id);
    
    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found',
      };
      return NextResponse.json(response, { status: 404 });
    }
    
    const response: ApiResponse<null> = {
      success: true,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting product:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete product',
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}