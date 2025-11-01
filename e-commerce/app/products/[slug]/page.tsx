import { notFound } from 'next/navigation';
import { ProductService } from '../../../lib/productService';
import Image from 'next/image';
import Link from 'next/link';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ISR: Generate static pages with revalidation every 60 seconds
export const revalidate = 60;

// Generate static params for all products at build time
export async function generateStaticParams() {
  try {
    const products = await ProductService.getAllProducts();
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  try {
    const product = await ProductService.getProductBySlug(slug);
    
    if (!product) {
      notFound();
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-10">
          <ol className="flex items-center space-x-3 text-sm">
            <li>
              <Link href="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <span className="text-orange-300">•</span>
            </li>
            <li>
              <span className="text-gray-600">{product.category}</span>
            </li>
            <li>
              <span className="text-orange-300">•</span>
            </li>
            <li>
              <span className="text-gray-800 font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
          {/* Product Image */}
          <div className="flex flex-col-reverse">
            <div className="aspect-w-1 aspect-h-1 w-full">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-center object-cover rounded-2xl shadow-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-orange-300 text-lg">No Image Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.name}
            </h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
            </div>

            {/* Category */}
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {product.category}
              </span>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <div className="mt-2 prose prose-sm text-gray-500">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Stock Information */}
            <div className="mt-6">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900">Availability</h3>
                <div className="ml-4 flex items-center">
                  {product.inventory > 0 ? (
                    <>
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-700">
                        {product.inventory} items in stock
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                      <span className="text-sm text-red-600">Out of stock</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: {new Date(product.lastUpdated).toLocaleString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex sm:flex-col1">
              <button
                type="button"
                disabled={product.inventory === 0}
                className={`max-w-xs flex-1 ${
                  product.inventory > 0
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:ring-orange-500 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 cursor-not-allowed'
                } border border-transparent rounded-xl py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full transition-all duration-300 hover:transform hover:scale-[1.02]`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H20" />
                </svg>
                {product.inventory > 0 ? 'Add to cart' : 'Out of stock'}
              </button>

              <button
                type="button"
                className="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="sr-only">Add to favorites</span>
              </button>
            </div>

            {/* Additional Product Info */}
            <div className="mt-10 pt-10 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Product Details</h3>
              <div className="mt-4 prose prose-sm text-gray-500">
                <ul role="list">
                  <li>Product ID: {product._id?.toString()}</li>
                  <li>Category: {product.category}</li>
                  <li>Current Stock: {product.inventory} units</li>
                  <li>Price: ${product.price.toFixed(2)}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Products */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Products
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}