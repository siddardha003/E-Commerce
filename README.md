# E-Commerce Web Application

A full-stack e-commerce web application built with Next.js, demonstrating different rendering strategies across various pages. This project showcases Static Site Generation (SSG), Incremental Static Regeneration (ISR), Server-Side Rendering (SSR), and Client-Side Rendering (CSR) techniques.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- npm or yarn package manager

### Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/E-Commerce.git
   cd E-Commerce/e-commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   # or your MongoDB Atlas connection string
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
   ```

4. **Database Setup**
   - Ensure MongoDB is running locally or use MongoDB Atlas
   - The application will automatically create the necessary collections
   - Sample product data will be populated on first run

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)


## 🎯 Rendering Strategies

### 1. Home Page (`/`) - Static Site Generation (SSG)
- **Strategy**: SSG with `generateStaticParams`
- **Rationale**: Product catalog changes infrequently, perfect for static generation
- **Benefits**: Fastest loading, excellent SEO, reduced server load
- **Implementation**: Products fetched at build time and pre-rendered

### 2. Product Detail Pages (`/products/[slug]`) - Incremental Static Regeneration (ISR)
- **Strategy**: ISR with 60-second revalidation
- **Rationale**: Product details may change (price, inventory) but don't need real-time updates
- **Benefits**: Static performance with content freshness
- **Implementation**: `revalidate = 60` and `generateStaticParams` for popular products

### 3. Dashboard Page (`/dashboard`) - Server-Side Rendering (SSR)
- **Strategy**: SSR with `dynamic = 'force-dynamic'`
- **Rationale**: Real-time inventory data required, personalized content
- **Benefits**: Always fresh data, server-side computation
- **Implementation**: Dynamic rendering on each request

### 4. Recommendations Page (`/recommendations`) - React Server Components
- **Strategy**: Server Components with server-side data fetching
- **Rationale**: Personalized recommendations with good performance
- **Benefits**: Reduced client-side JavaScript, server-side data processing
- **Implementation**: Async server components with direct database queries

### 5. Admin Panel (`/admin`) - Client-Side Rendering (CSR)
- **Strategy**: CSR with `'use client'`
- **Rationale**: Rich interactivity, form handling, real-time updates
- **Benefits**: Interactive UI, optimistic updates, real-time feedback
- **Implementation**: React hooks, client-side state management


## 🗄️ Database Setup


1. **Products Collection**
   ```javascript
   {
     _id: ObjectId,
     name: String,
     description: String,
     price: Number,
     category: String,
     inventory: Number,
     slug: String,
     image: String,
     createdAt: Date,
     updatedAt: Date
   }
   ```

## 📊 Short Report

### Rendering Strategy Rationale

**1. Home Page (SSG)**
- **Why**: Product listings are relatively static and benefit from CDN caching
- **Performance**: Sub-second load times, excellent Core Web Vitals
- **SEO**: Perfect for search engine optimization with pre-rendered content

**2. Product Pages (ISR)**
- **Why**: Balance between static performance and content freshness
- **Performance**: Static speed with periodic updates for inventory/pricing
- **Scalability**: Handles thousands of products without build-time bottlenecks

**3. Dashboard (SSR)**
- **Why**: Real-time data requirements for inventory management
- **Performance**: Server-side computation reduces client-side processing
- **Accuracy**: Always displays current inventory levels and statistics

**4. Recommendations (RSC)**
- **Why**: Personalized content that benefits from server-side processing
- **Performance**: Reduced JavaScript bundle size, faster initial page load
- **Functionality**: Complex recommendation algorithms run on the server

**5. Admin Panel (CSR)**
- **Why**: Rich interactivity required for CRUD operations
- **Performance**: Optimistic updates provide immediate user feedback
- **UX**: Form validation, real-time previews, and interactive features

### Data Flow Implementation

The application implements a clean separation of concerns:

- **Presentation Layer**: React components handle UI rendering
- **API Layer**: Next.js API routes provide RESTful endpoints
- **Service Layer**: ProductService abstracts business logic
- **Data Layer**: MongoDB handles persistent storage

### Challenges and Solutions

- **Problem**: Managing different rendering strategies in one project while ensuring smooth data flow between pages was initially confusing.
- **Solution**: I referred to Next.js documentation and separated rendering logic clearly. using getStaticProps for SSG, getStaticPaths with revalidate for ISR, getServerSideProps for SSR, and client-side fetching for the Admin panel. This modular approach reduced code conflicts and improved understanding.

## 📱 Page Screenshots

### Home Page - Static Site Generation (SSG)
![Home Page](./e-commerce/public/Screenshot%202025-11-02%20003215.png)
*Product grid with static generation for optimal performance*

### Product Detail Page - Incremental Static Regeneration (ISR)
![Product Detail](./e-commerce/public/Screenshot%202025-11-02%20003247.png)
*Individual product page with ISR for fresh content*

### Dashboard Page - Server-Side Rendering (SSR)
![Dashboard](./e-commerce/public/Screenshot%202025-11-02%20003326.png)
*Real-time inventory dashboard with server-side rendering*

### Recommendations Page - React Server Components
![Recommendations](./e-commerce/public/Screenshot%202025-11-02%20003351.png)
*Curated product recommendations with emerald green "View Details" buttons*

### Admin Panel - Client-Side Rendering (CSR)
![Admin Panel](./e-commerce/public/Screenshot%202025-11-02%20003401.png)
*Interactive admin panel for product management*

### Additional Page View
![Additional View](./e-commerce/public/Screenshot%202025-11-02%20003758.png)
*Additional application functionality*


## 🛠️ Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB
- **Deployment**: Vercel (recommended)
- **Development**: ESLint, Hot Module Replacement

## 📞 Contact

**Siddardha Karumuri**
- Email: [siddarthakarumuri003@gmail.com](mailto:siddarthakarumuri003@gmail.com)
- LinkedIn: [Siddardha Karumuri](https://linkedin.com/in/siddardha-karumuri)
- Portfolio: [siddardhakarumuri.tech](https://www.siddarthakarumuri.tech)
- Date: 1/11/2025
---
