import { ProductService } from '../../lib/productService';
import WishlistButton from '../../components/WishlistButton';
import Link from 'next/link';
import Image from 'next/image';

// React Server Components - fetch data on the server
export default async function RecommendationsPage() {
  const rawProducts = await ProductService.getRecommendedProducts(6);
  // Convert MongoDB documents to plain objects
  const recommendedProducts = rawProducts.map(product => ({
    ...product,
    _id: product._id?.toString(),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recommended Products</h1>
        <p className="mt-2 text-gray-600">
          Curated selection of products you might like
        </p>
      </div>

      {/* Navigation */}
      <nav className="mb-8">
        <div className="flex space-x-4">
          <Link
            href="/"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/admin"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            Admin Panel
          </Link>
          <span className="px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700">
            Recommendations
          </span>
        </div>
      </nav>

      {/* Recommendations Grid */}
      {recommendedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {recommendedProducts.map((product) => (
            <div key={product._id?.toString()} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="h-48 w-full object-cover object-center"
                  />
                ) : (
                  <div className="h-48 w-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.inventory} in stock
                  </span>
                </div>
                
                <div className="mb-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <Link
                    href={`/products/${product.slug}`}
                    className="block w-full bg-emerald-600 text-white text-center py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    View Details
                  </Link>
                  
                  {/* Client-side Wishlist Button */}
                  <WishlistButton product={product} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-4h-2m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v3"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add some products to get personalized recommendations.
            </p>
            <div className="mt-6">
              <Link
                href="/admin"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Products
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          How Recommendations Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Server-Side Processing</h3>
            <p className="text-sm text-gray-600">
              Product recommendations are generated on the server using React Server Components.
              This ensures fast initial page loads and better SEO.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Client-Side Interaction</h3>
            <p className="text-sm text-gray-600">
              The wishlist functionality is handled on the client side, allowing for interactive
              features without requiring page reloads.
            </p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">Current Algorithm</h3>
          <p className="text-sm text-gray-600">
            Recommendations are currently based on available inventory and random selection.
            In a production environment, this could be enhanced with user behavior,
            purchase history, and machine learning algorithms.
          </p>
        </div>
      </div>

      {/* Server Components Notice */}
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          🚀 This page demonstrates React Server Components. Product data is fetched on the server,
          while wishlist interactions happen on the client side for optimal performance.
        </p>
      </div>
    </div>
  );
}