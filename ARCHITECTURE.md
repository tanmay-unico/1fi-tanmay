# Application Architecture

This document describes the modular architecture of the EMI Product Store application.

## Backend Structure

```
server/
├── config/
│   └── database.js          # Database connection configuration
├── controllers/
│   ├── productController.js # Product business logic
│   └── variantController.js # Variant business logic
├── services/
│   ├── productService.js    # Product data access layer
│   ├── variantService.js    # Variant data access layer
│   └── emiService.js        # EMI plans data access layer
├── routes/
│   ├── productRoutes.js     # Product API routes
│   └── variantRoutes.js     # Variant API routes
├── middleware/
│   └── errorHandler.js      # Error handling middleware
├── utils/
│   └── emiCalculator.js     # EMI calculation utility
├── scripts/
│   └── init-db.js          # Database initialization script
└── index.js                 # Application entry point
```

### Layer Responsibilities

#### 1. **Routes** (`routes/`)
- Define API endpoints
- Map HTTP methods to controller functions
- Handle route parameters

#### 2. **Controllers** (`controllers/`)
- Handle HTTP requests and responses
- Validate input
- Call service layer
- Return appropriate HTTP responses

#### 3. **Services** (`services/`)
- Business logic
- Data access operations
- Database queries
- Data transformation

#### 4. **Config** (`config/`)
- Database connection setup
- Environment configuration
- Shared configurations

#### 5. **Utils** (`utils/`)
- Reusable utility functions
- Helper functions (EMI calculations, etc.)

#### 6. **Middleware** (`middleware/`)
- Error handling
- Authentication (if needed)
- Request logging
- Validation

## Frontend Structure

```
client/src/
├── components/
│   ├── ProductList.js       # Product listing component
│   ├── ProductDetail.js     # Product detail component
│   └── CheckoutPage.js      # Checkout page component
├── hooks/
│   ├── useProducts.js       # Custom hook for products list
│   └── useProduct.js        # Custom hook for single product
├── services/
│   └── api.js               # API service layer
├── utils/
│   └── emiCalculator.js     # EMI calculation utility
├── constants/
│   └── api.js               # API endpoints and constants
├── App.js                   # Main app component
└── index.js                 # Application entry point
```

### Layer Responsibilities

#### 1. **Components** (`components/`)
- React UI components
- Presentational logic
- User interactions

#### 2. **Hooks** (`hooks/`)
- Custom React hooks
- Data fetching logic
- State management
- Reusable component logic

#### 3. **Services** (`services/`)
- API communication
- HTTP requests
- Data transformation
- Error handling

#### 4. **Utils** (`utils/`)
- Utility functions
- Helper functions
- Calculations

#### 5. **Constants** (`constants/`)
- API endpoints
- Configuration constants
- Static values

## Data Flow

### Backend Flow
```
Request → Routes → Controllers → Services → Database
                                      ↓
Response ← Routes ← Controllers ← Services
```

### Frontend Flow
```
Component → Hooks → Services → API → Backend
                                   ↓
Component ← Hooks ← Services ← API ← Backend
```

## Key Design Principles

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Single Responsibility**: Each module/function does one thing well
3. **DRY (Don't Repeat Yourself)**: Reusable code in utilities and services
4. **Modularity**: Easy to add, modify, or remove features
5. **Maintainability**: Clear structure makes code easier to understand and modify

## Benefits of This Architecture

1. **Scalability**: Easy to add new features without affecting existing code
2. **Testability**: Each layer can be tested independently
3. **Maintainability**: Clear structure makes debugging and updates easier
4. **Reusability**: Services and utilities can be reused across the application
5. **Team Collaboration**: Clear separation allows multiple developers to work on different layers

## Example: Adding a New Feature

### Backend
1. Create route in `routes/`
2. Create controller in `controllers/`
3. Create service in `services/` if needed
4. Add database queries

### Frontend
1. Create component in `components/`
2. Create hook in `hooks/` if data fetching is needed
3. Add API method in `services/api.js`
4. Add endpoint constant in `constants/api.js`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:slug` - Get product by slug

### Variants
- `GET /api/variants/:variantId/emi-plans` - Get EMI plans for variant

