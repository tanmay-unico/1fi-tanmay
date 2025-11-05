# Quick Setup Guide

## Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2. Create PostgreSQL Database
Open PostgreSQL command line or pgAdmin and run:
```sql
CREATE DATABASE emi_products;
```

### 3. Configure Database Connection
Create a file `server/.env` with the following content:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=emi_products
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```
Replace `your_postgres_password` with your actual PostgreSQL password.

### 4. Initialize Database
```bash
cd server
npm run init-db
```

This will create the tables and insert sample data (3 products with variants and EMI plans).

### 5. Start the Application

**Option A: Run both together**
```bash
npm run dev
```

**Option B: Run separately**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Sample Products
- Apple iPhone 17 Pro (with 4 variants)
- Samsung Galaxy S24 Ultra (with 3 variants)
- OnePlus 12 (with 3 variants)

Each product has 6 EMI plans available (3, 6, 9, 12, 18, 24 months).

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check `.env` file has correct credentials
- Ensure database `emi_products` exists

### Port Already in Use
- Change PORT in `server/.env` if 5000 is in use
- React dev server runs on 3000 by default

### Module Not Found
- Run `npm install` in root, server, and client directories
- Delete `node_modules` and reinstall if issues persist

