import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '../../../scripts/seedDatabase';
import { ApiResponse } from '../../../types/product';

// Helper function to check admin authentication
function isAdmin(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  return adminKey === process.env.ADMIN_KEY;
}

// POST /api/seed - Seed database with sample data (Admin only)
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Unauthorized',
    };
    return NextResponse.json(response, { status: 401 });
  }

  try {
    await seedDatabase();
    
    const response: ApiResponse<null> = {
      success: true,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error seeding database:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to seed database',
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}