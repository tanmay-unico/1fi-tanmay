# EMI Product Store - Full-Stack Web Application

A full-stack web application that displays products (smartphones) with multiple EMI plans backed by mutual funds. The app retrieves dynamic data from a PostgreSQL database via REST APIs and presents it in a responsive, user-friendly React interface.

## Features

- **Product Catalog**: Browse products with variants (color, storage options)
- **EMI Plans**: View multiple EMI plans with tenure, interest rates, and cashback offers
- **Dynamic Pricing**: Real-time EMI calculations based on selected variant and plan
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **RESTful API**: Backend API with Express.js
- **Database**: PostgreSQL database with proper schema design

## Tech Stack

### Frontend
- **React** 18.2.0 - UI library
- **React Router** 6.20.0 - Client-side routing
- **Tailwind CSS** 3.3.6 - Utility-first CSS framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** 4.18.2 - Web framework
- **PostgreSQL** - Relational database
- **pg** 8.11.3 - PostgreSQL client for Node.js

### Development Tools
- **nodemon** - Auto-reload server during development
- **concurrently** - Run multiple npm scripts simultaneously

## Project Structure

```
├── client/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductList.js
│   │   │   ├── ProductDetail.js
│   │   │   └── CheckoutPage.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                 # Express backend API
│   ├── scripts/
│   │   └── init-db.js      # Database initialization script
│   ├── index.js            # Main server file
│   └── package.json
├── README.md               # This file
└── package.json            # Root package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 1fi-tanmay-lautawar
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, and client)
npm run install-all
```

Or install separately:

```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 3. Database Setup

1. **Create PostgreSQL Database:**
   ```sql
   CREATE DATABASE emi_products;
   ```

2. **Configure Database Connection:**
   
   Create `server/.env` file:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=emi_products
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   ```
   
   Replace `your_postgres_password` with your actual PostgreSQL password.

3. **Initialize Database with Seed Data:**
   ```bash
   cd server
   npm run init-db
   ```
   
   This will:
   - Create all necessary tables
   - Insert 3 sample products (iPhone 17 Pro, Samsung Galaxy S24 Ultra, OnePlus 12)
   - Insert multiple variants for each product
   - Insert 6 EMI plans

### 4. Run the Application

#### Option 1: Run Both Server and Client Together
```bash
npm run dev
```

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## API Endpoints

### Base URL
```
http://localhost:5000
```

### 1. Get All Products

**Endpoint:** `GET /api/products`

**Description:** Retrieves a list of all products with their basic information and price ranges.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Apple iPhone 17 Pro",
    "slug": "apple-iphone-17-pro",
    "description": "The latest iPhone with advanced features and cutting-edge technology",
    "category": "Smartphones",
    "brand": "Apple",
    "min_mrp": "134900.00",
    "min_price": "124900.00",
    "max_mrp": "154900.00",
    "max_price": "144900.00",
    "image_url": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500"
  },
  {
    "id": 2,
    "name": "Samsung Galaxy S24 Ultra",
    "slug": "samsung-galaxy-s24-ultra",
    ...
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

### 2. Get Product by Slug

**Endpoint:** `GET /api/products/:slug`

**Description:** Retrieves detailed information about a specific product including all variants and available EMI plans.

**Parameters:**
- `slug` (path parameter) - Product slug (e.g., `apple-iphone-17-pro`)

**Example:** `GET /api/products/apple-iphone-17-pro`

**Response:**
```json
{
  "id": 1,
  "name": "Apple iPhone 17 Pro",
  "slug": "apple-iphone-17-pro",
  "description": "The latest iPhone with advanced features and cutting-edge technology",
  "category": "Smartphones",
  "brand": "Apple",
  "created_at": "2024-01-15T10:30:00.000Z",
  "variants": [
    {
      "id": 1,
      "product_id": 1,
      "name": "256GB - Silver",
      "color": "Silver",
      "storage": "256GB",
      "mrp": "134900.00",
      "price": "124900.00",
      "image_url": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500",
      "stock": 10,
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "product_id": 1,
      "name": "256GB - Space Black",
      "color": "Space Black",
      "storage": "256GB",
      "mrp": "134900.00",
      "price": "124900.00",
      "image_url": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500",
      "stock": 10,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "emiPlans": [
    {
      "id": 1,
      "name": "3 Months - 0% Interest",
      "tenure_months": 3,
      "interest_rate": "0.00",
      "cashback": "0.00",
      "cashback_description": null,
      "min_amount": "0.00",
      "max_amount": null,
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "6 Months - 0% Interest",
      "tenure_months": 6,
      "interest_rate": "0.00",
      "cashback": "0.00",
      "cashback_description": null,
      "min_amount": "0.00",
      "max_amount": null,
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 3,
      "name": "9 Months - 10.5% Interest",
      "tenure_months": 9,
      "interest_rate": "10.50",
      "cashback": "0.00",
      "cashback_description": null,
      "min_amount": "0.00",
      "max_amount": null,
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 4,
      "name": "12 Months - 10.5% Interest",
      "tenure_months": 12,
      "interest_rate": "10.50",
      "cashback": "500.00",
      "cashback_description": "Get ₹500 cashback",
      "min_amount": "0.00",
      "max_amount": null,
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 5,
      "name": "18 Months - 12% Interest",
      "tenure_months": 18,
      "interest_rate": "12.00",
      "cashback": "1000.00",
      "cashback_description": "Get ₹1000 cashback",
      "min_amount": "0.00",
      "max_amount": null,
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 6,
      "name": "24 Months - 12% Interest",
      "tenure_months": 24,
      "interest_rate": "12.00",
      "cashback": "2000.00",
      "cashback_description": "Get ₹2000 cashback",
      "min_amount": "0.00",
      "max_amount": null,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Product not found
- `500 Internal Server Error` - Server error

---

### 3. Get EMI Plans for Variant

**Endpoint:** `GET /api/variants/:variantId/emi-plans`

**Description:** Retrieves EMI plans with calculated monthly payments for a specific variant.

**Parameters:**
- `variantId` (path parameter) - Variant ID

**Example:** `GET /api/variants/1/emi-plans`

**Response:**
```json
[
  {
    "id": 1,
    "name": "3 Months - 0% Interest",
    "tenure_months": 3,
    "interest_rate": "0.00",
    "cashback": "0.00",
    "cashback_description": null,
    "min_amount": "0.00",
    "max_amount": null,
    "created_at": "2024-01-15T10:30:00.000Z",
    "monthlyPayment": "41633.33",
    "principal": "124900.00"
  },
  {
    "id": 2,
    "name": "6 Months - 0% Interest",
    "tenure_months": 6,
    "interest_rate": "0.00",
    "cashback": "0.00",
    "cashback_description": null,
    "min_amount": "0.00",
    "max_amount": null,
    "created_at": "2024-01-15T10:30:00.000Z",
    "monthlyPayment": "20816.67",
    "principal": "124900.00"
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Variant not found
- `500 Internal Server Error` - Server error

---

## Database Schema

### Tables Overview

The database consists of three main tables:

1. **products** - Stores product information
2. **variants** - Stores product variants (color, storage, pricing)
3. **emi_plans** - Stores EMI plan configurations

### Detailed Schema

#### 1. Products Table

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(100),
  brand VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Primary key, auto-incrementing
- `name` - Product name (e.g., "Apple iPhone 17 Pro")
- `slug` - URL-friendly identifier (unique)
- `description` - Product description
- `category` - Product category (e.g., "Smartphones")
- `brand` - Product brand (e.g., "Apple")
- `created_at` - Timestamp of record creation

#### 2. Variants Table

```sql
CREATE TABLE variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(100),
  storage VARCHAR(50),
  mrp DECIMAL(10, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Primary key, auto-incrementing
- `product_id` - Foreign key to products table
- `name` - Variant name (e.g., "256GB - Silver")
- `color` - Color option
- `storage` - Storage capacity
- `mrp` - Maximum Retail Price
- `price` - Selling price
- `image_url` - Product image URL
- `stock` - Available stock quantity
- `created_at` - Timestamp of record creation

**Relationships:**
- Many-to-one with `products` (CASCADE delete)

#### 3. EMI Plans Table

```sql
CREATE TABLE emi_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  tenure_months INTEGER NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  cashback DECIMAL(10, 2) DEFAULT 0,
  cashback_description TEXT,
  min_amount DECIMAL(10, 2) DEFAULT 0,
  max_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Primary key, auto-incrementing
- `name` - Plan name (e.g., "3 Months - 0% Interest")
- `tenure_months` - Number of months for EMI
- `interest_rate` - Annual interest rate percentage
- `cashback` - Cashback amount
- `cashback_description` - Cashback offer description
- `min_amount` - Minimum purchase amount for plan
- `max_amount` - Maximum purchase amount for plan (nullable)
- `created_at` - Timestamp of record creation

### Entity Relationship Diagram

```
products (1) ────< (many) variants
                     │
                     └─── Uses ────> (many) emi_plans
```

## Seed Data

The database initialization script (`server/scripts/init-db.js`) includes:

### Products (3)
1. **Apple iPhone 17 Pro** - 4 variants
2. **Samsung Galaxy S24 Ultra** - 3 variants
3. **OnePlus 12** - 3 variants

### EMI Plans (6)
1. 3 Months - 0% Interest
2. 6 Months - 0% Interest
3. 9 Months - 10.5% Interest
4. 12 Months - 10.5% Interest (₹500 cashback)
5. 18 Months - 12% Interest (₹1000 cashback)
6. 24 Months - 12% Interest (₹2000 cashback)

## Frontend Routes

- `/` - Product listing page
- `/products/:slug` - Product detail page with variant and EMI selection
- `/checkout` - Final checkout/order summary page

## EMI Calculation Formula

The application uses the standard EMI formula:

**For 0% Interest:**
```
EMI = Principal / Tenure
```

**For Interest-bearing Plans:**
```
EMI = (P × r × (1 + r)^n) / ((1 + r)^n - 1)
```

Where:
- `P` = Principal amount (variant price)
- `r` = Monthly interest rate (annual rate / 12 / 100)
- `n` = Number of months (tenure)

## Development

### Running in Development Mode

The application uses:
- **nodemon** for auto-reloading the backend server
- **React's hot reloading** for the frontend
- **concurrently** to run both servers simultaneously

### Environment Variables

Create `server/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=emi_products
DB_USER=postgres
DB_PASSWORD=your_password
```

### Reinitializing Database

To reset and reinitialize the database:
```bash
cd server
npm run init-db
```

**Note:** This will clear existing EMI plans and insert fresh seed data.

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check `.env` file has correct credentials
- Ensure database `emi_products` exists

### Port Already in Use
- Change `PORT` in `server/.env` if 5000 is in use
- React dev server runs on 3000 by default

### Module Not Found
- Run `npm install` in root, server, and client directories
- Delete `node_modules` and reinstall if issues persist

### NaN in Monthly Payment
- Ensure database values are properly formatted
- Check that variant price and EMI plan data are valid numbers

## License

ISC

## Author

Tanmay Lautawar
