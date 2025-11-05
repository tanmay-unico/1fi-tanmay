# Database Schema Documentation

This document provides detailed information about the database schema used in the EMI Product Store application.

## Database: `emi_products`

### Overview

The database consists of three main tables that work together to manage products, their variants, and available EMI plans.

---

## Tables

### 1. `products`

Stores basic product information.

#### Schema

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

#### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `name` | VARCHAR(255) | NOT NULL | Product name (e.g., "Apple iPhone 17 Pro") |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier for routing |
| `description` | TEXT | | Product description |
| `category` | VARCHAR(100) | | Product category (e.g., "Smartphones") |
| `brand` | VARCHAR(100) | | Product brand (e.g., "Apple") |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

#### Indexes

- Primary Key: `id`
- Unique Index: `slug`

#### Example Data

```sql
INSERT INTO products (name, slug, description, category, brand) VALUES
('Apple iPhone 17 Pro', 'apple-iphone-17-pro', 'The latest iPhone with advanced features', 'Smartphones', 'Apple');
```

---

### 2. `variants`

Stores product variants with different configurations (color, storage, pricing).

#### Schema

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

#### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `product_id` | INTEGER | FOREIGN KEY, REFERENCES products(id) | Links variant to product |
| `name` | VARCHAR(255) | NOT NULL | Variant name (e.g., "256GB - Silver") |
| `color` | VARCHAR(100) | | Color option |
| `storage` | VARCHAR(50) | | Storage capacity |
| `mrp` | DECIMAL(10, 2) | NOT NULL | Maximum Retail Price |
| `price` | DECIMAL(10, 2) | NOT NULL | Selling price |
| `image_url` | VARCHAR(500) | | URL to product image |
| `stock` | INTEGER | DEFAULT 0 | Available stock quantity |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

#### Foreign Keys

- `product_id` → `products(id)` ON DELETE CASCADE

#### Indexes

- Primary Key: `id`
- Foreign Key Index: `product_id`

#### Example Data

```sql
INSERT INTO variants (product_id, name, color, storage, mrp, price, image_url, stock) VALUES
(1, '256GB - Silver', 'Silver', '256GB', 134900.00, 124900.00, 'https://example.com/image.jpg', 10);
```

---

### 3. `emi_plans`

Stores EMI plan configurations that can be applied to any product variant.

#### Schema

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

#### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `name` | VARCHAR(255) | NOT NULL | Plan name (e.g., "3 Months - 0% Interest") |
| `tenure_months` | INTEGER | NOT NULL | Number of months for EMI tenure |
| `interest_rate` | DECIMAL(5, 2) | NOT NULL | Annual interest rate percentage |
| `cashback` | DECIMAL(10, 2) | DEFAULT 0 | Cashback amount offered |
| `cashback_description` | TEXT | | Description of cashback offer |
| `min_amount` | DECIMAL(10, 2) | DEFAULT 0 | Minimum purchase amount for plan |
| `max_amount` | DECIMAL(10, 2) | | Maximum purchase amount (nullable) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

#### Indexes

- Primary Key: `id`

#### Example Data

```sql
INSERT INTO emi_plans (name, tenure_months, interest_rate, cashback, cashback_description, min_amount) VALUES
('3 Months - 0% Interest', 3, 0.00, 0.00, NULL, 0.00),
('12 Months - 10.5% Interest', 12, 10.50, 500.00, 'Get ₹500 cashback', 0.00);
```

---

## Relationships

### Entity Relationship Diagram

```
┌─────────────┐
│  products   │
│─────────────│
│ id (PK)     │
│ name        │
│ slug        │
│ description │
│ category    │
│ brand       │
└──────┬──────┘
       │
       │ 1:N
       │
       ▼
┌─────────────┐
│  variants   │
│─────────────│
│ id (PK)     │
│ product_id  │─── FK to products.id
│ name        │
│ color       │
│ storage     │
│ mrp         │
│ price       │
│ image_url   │
│ stock       │
└─────────────┘
       │
       │ Uses (N:M via application logic)
       │
       ▼
┌─────────────┐
│ emi_plans   │
│─────────────│
│ id (PK)     │
│ name        │
│ tenure_     │
│   months    │
│ interest_   │
│   rate      │
│ cashback    │
│ cashback_   │
│   desc      │
│ min_amount  │
│ max_amount  │
└─────────────┘
```

### Relationship Details

1. **Products → Variants** (One-to-Many)
   - One product can have multiple variants
   - Variants are deleted when parent product is deleted (CASCADE)
   - Each variant belongs to exactly one product

2. **Variants ↔ EMI Plans** (Many-to-Many via application logic)
   - Any variant can use any EMI plan
   - Relationship is calculated dynamically in the application
   - Monthly payment is computed based on variant price and plan terms

---

## Seed Data

The database is initialized with the following sample data:

### Products

1. **Apple iPhone 17 Pro** (`apple-iphone-17-pro`)
   - 4 variants (256GB Silver, 256GB Space Black, 512GB Silver, 512GB Space Black)
   - Price range: ₹124,900 - ₹144,900

2. **Samsung Galaxy S24 Ultra** (`samsung-galaxy-s24-ultra`)
   - 3 variants (256GB Titanium Black, 256GB Titanium Gray, 512GB Titanium Black)
   - Price range: ₹114,999 - ₹124,999

3. **OnePlus 12** (`oneplus-12`)
   - 3 variants (256GB Silky Black, 256GB Flowy Emerald, 512GB Silky Black)
   - Price range: ₹59,999 - ₹64,999

### EMI Plans

All plans are available for all products:

1. **3 Months - 0% Interest** (3 months, 0% interest, no cashback)
2. **6 Months - 0% Interest** (6 months, 0% interest, no cashback)
3. **9 Months - 10.5% Interest** (9 months, 10.5% interest, no cashback)
4. **12 Months - 10.5% Interest** (12 months, 10.5% interest, ₹500 cashback)
5. **18 Months - 12% Interest** (18 months, 12% interest, ₹1000 cashback)
6. **24 Months - 12% Interest** (24 months, 12% interest, ₹2000 cashback)

---

## Database Initialization

Run the initialization script to create tables and insert seed data:

```bash
cd server
npm run init-db
```

This script:
1. Creates all tables if they don't exist
2. Inserts sample products
3. Inserts variants for each product
4. Clears and inserts EMI plans

---

## Maintenance

### Reset Database
To completely reset the database:
```sql
DROP TABLE IF EXISTS variants CASCADE;
DROP TABLE IF EXISTS emi_plans CASCADE;
DROP TABLE IF EXISTS products CASCADE;
```
Then run `npm run init-db` again.

### Backup
```bash
pg_dump -U postgres emi_products > backup.sql
```

### Restore
```bash
psql -U postgres emi_products < backup.sql
```

