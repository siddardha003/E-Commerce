# E-Commerce Demo - Next.js 14 with MongoDB Atlas

A full-stack e-commerce application built with Next.js 14 (App Router) and MongoDB Atlas, demonstrating multiple rendering methods: SSG, ISR, SSR, CSR, and React Server Components.

## Features

### Rendering Methods Demonstrated

1. **Static Site Generation (SSG)** - Home Page (`/`)
   - Products fetched at build time from MongoDB Atlas
   - Client-side search and filtering
   - Optimized for performance and SEO

2. **Incremental Static Regeneration (ISR)** - Product Detail Pages (`/products/[slug]`)
   - Pre-generated product pages with 60-second revalidation
   - Fresh product data without full rebuilds
   - Shows "Last Updated" timestamps

3. **Server-Side Rendering (SSR)** - Inventory Dashboard (`/dashboard`)
   - Real-time data on every request
   - Live inventory monitoring
   - Low stock alerts and recent updates

4. **Client-Side Rendering (CSR)** - Admin Panel (`/admin`)
   - Interactive product management
   - CRUD operations with forms
   - Admin authentication required

5. **React Server Components** - Recommendations Page (`/recommendations`)
   - Server-side product fetching
   - Client-side wishlist functionality
   - Hybrid server/client rendering

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Authentication**: Simple key-based admin auth

## Project Structure

```
app/
├── api/                    # API routes
│   ├── products/          # Product CRUD endpoints
│   └── seed/              # Database seeding endpoint
├── admin/                 # Admin panel (CSR)
├── dashboard/             # Inventory dashboard (SSR)
├── products/[slug]/       # Product detail pages (ISR)
├── recommendations/       # Recommendations (Server Components)
├── layout.tsx            # Root layout
└── page.tsx              # Home page (SSG)

components/
├── ProductGrid.tsx        # Product grid with search/filter
└── WishlistButton.tsx     # Client-side wishlist component

lib/
├── mongodb.ts            # Database connection
└── productService.ts     # Product data service

types/
└── product.ts            # TypeScript interfaces

scripts/
└── seedDatabase.ts       # Sample data seeder
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd e-commerce
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# Admin Authentication
ADMIN_KEY=your-secret-admin-key

# Next.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string and update `MONGODB_URI` in `.env.local`
5. Ensure your IP address is whitelisted in Atlas Network Access

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

### 6. Seed Sample Data

To populate the database with sample products:

1. Navigate to http://localhost:3000/admin
2. Enter your admin key (from `ADMIN_KEY` in `.env.local`)
3. Use the admin panel to add products, or
4. Make a POST request to `/api/seed` with your admin key in the `x-admin-key` header

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Fetch all products | No |
| GET | `/api/products/[slug]` | Fetch single product | No |
| POST | `/api/products` | Create new product | Yes |
| PUT | `/api/products/[id]` | Update product | Yes |
| DELETE | `/api/products/[id]` | Delete product | Yes |
| POST | `/api/seed` | Seed sample data | Yes |

## Rendering Method Examples

### SSG (Static Site Generation)
- **Page**: Home (`/`)
- **Implementation**: Server component with data fetching
- **Benefits**: Fast loading, SEO-friendly, cached by CDN

### ISR (Incremental Static Regeneration)
- **Page**: Product Details (`/products/[slug]`)
- **Implementation**: `revalidate = 60` and `generateStaticParams`
- **Benefits**: Static performance with fresh data

### SSR (Server-Side Rendering)
- **Page**: Dashboard (`/dashboard`)
- **Implementation**: `dynamic = 'force-dynamic'`
- **Benefits**: Always fresh data, good for admin interfaces

### CSR (Client-Side Rendering)
- **Page**: Admin Panel (`/admin`)
- **Implementation**: `'use client'` with fetch calls
- **Benefits**: Interactive UI, no page reloads

### Server Components
- **Page**: Recommendations (`/recommendations`)
- **Implementation**: Server component + client components
- **Benefits**: Reduced JavaScript bundle, better performance

## MongoDB Data Model

```typescript
interface Product {
  _id?: ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  lastUpdated: string; // ISO datetime
  image?: string;
}
```

## Development Notes

### Building for Production

```bash
npm run build
npm start
```

### Key Features

1. **Type Safety**: Full TypeScript implementation
2. **Error Handling**: Comprehensive error boundaries and API error handling
3. **Performance**: Optimized images, code splitting, and rendering strategies
4. **SEO**: Proper meta tags and server-side rendering
5. **Responsive**: Mobile-first design with Tailwind CSS

### Admin Authentication

The application uses a simple key-based authentication system for admin functions. In production, you should implement proper JWT-based authentication with user management.

## Deployment

This application can be deployed to Vercel, Netlify, or any platform that supports Next.js:

1. Ensure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) or add your deployment platform's IP ranges
2. Set environment variables in your deployment platform
3. Deploy the application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes and demonstrates Next.js 14 rendering methods with MongoDB Atlas.
