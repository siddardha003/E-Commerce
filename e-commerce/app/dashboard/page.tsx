import { ProductService } from '../../lib/productService';
import Link from 'next/link';

// Force dynamic rendering (SSR) - no caching
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const stats = await ProductService.getDashboardStats();
  const currentTime = new Date().toLocaleString();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Real-time inventory monitoring and analytics
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Rendered at: {currentTime}
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
          <span className="px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700">
            Dashboard
          </span>
          <Link
            href="/admin"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            Admin Panel
          </Link>
          <Link
            href="/recommendations"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            Recommendations
          </Link>
        </div>
      </nav>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Products
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalProducts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Low Stock Items
                  </dt>
                  <dd className="text-lg font-medium text-red-600">
                    {stats.lowStockItems.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Recently Updated
                  </dt>
                  <dd className="text-lg font-medium text-green-600">
                    {stats.recentlyUpdated.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Low Stock Alerts ({stats.lowStockItems.length})
        </h2>
        {stats.lowStockItems.length > 0 ? (
          <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
            <ul className="divide-y divide-red-200">
              {stats.lowStockItems.map((product) => (
                <li key={product._id?.toString()} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-red-400 rounded-full"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-red-700">
                          Category: {product.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-red-900">
                        Stock: {product.inventory}
                      </span>
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">All products are well-stocked! 🎉</p>
          </div>
        )}
      </div>

      {/* Recently Updated Items */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recently Updated Items ({stats.recentlyUpdated.length})
        </h2>
        {stats.recentlyUpdated.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {stats.recentlyUpdated.map((product) => (
                <li key={product._id?.toString()}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {product.category} • ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            Stock: {product.inventory}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(product.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>
                        <Link
                          href={`/products/${product.slug}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600">No recent updates in the last 7 days.</p>
          </div>
        )}
      </div>

      {/* Refresh Notice */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 This dashboard shows real-time data fetched on every page load (SSR).
          Refresh the page to see the latest inventory information.
        </p>
      </div>
    </div>
  );
}