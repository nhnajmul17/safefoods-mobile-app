# Safe Food App - API Documentation

## Base URL

```
https://api.safefoods.com.bd/api
```

## Authentication

The API uses token-based authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## API Endpoints

### Authentication

#### POST /auth/login
Login with email/phone and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    },
    "access_token": "jwt_token_here"
  }
}
```

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "phone": "+8801234567890",
  "password": "password123"
}
```

#### POST /auth/verify-otp
Verify OTP for registration or password reset.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "token": "verification_token"
}
```

#### POST /auth/forgot-password
Request password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST /auth/reset-password
Reset password with token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "token": "reset_token",
  "password": "new_password123"
}
```

### Products

#### GET /products
Get list of products with optional filtering.

**Query Parameters:**
- `category` - Filter by category
- `search` - Search by product name
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "product_id",
        "name": "Product Name",
        "description": "Product description",
        "image": "image_url",
        "price": 100,
        "weight": "1kg",
        "category": "proteins",
        "variants": [
          {
            "id": "variant_id",
            "name": "Variant Name",
            "price": 100,
            "unit": "kg"
          }
        ]
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 10,
      "total_items": 200
    }
  }
}
```

#### GET /products/:id
Get product details by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "product_id",
      "name": "Product Name",
      "description": "Detailed product description",
      "images": ["image_url_1", "image_url_2"],
      "price": 100,
      "weight": "1kg",
      "category": "proteins",
      "variants": [...],
      "related_products": [...]
    }
  }
}
```

### Categories

#### GET /categories
Get list of product categories.

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "category_id",
        "name": "Proteins",
        "slug": "proteins",
        "icon": "icon_url",
        "product_count": 25
      }
    ]
  }
}
```

### Cart

#### GET /cart
Get user's cart items (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "cart_items": [
      {
        "id": "cart_item_id",
        "product_id": "product_id",
        "variant_id": "variant_id",
        "quantity": 2,
        "product": {
          "name": "Product Name",
          "image": "image_url",
          "price": 100
        }
      }
    ],
    "total_items": 5,
    "total_price": 500
  }
}
```

#### POST /cart/add
Add item to cart (requires authentication).

**Request Body:**
```json
{
  "product_id": "product_id",
  "variant_id": "variant_id",
  "quantity": 2
}
```

#### PUT /cart/update
Update cart item quantity (requires authentication).

**Request Body:**
```json
{
  "cart_item_id": "cart_item_id",
  "quantity": 3
}
```

#### DELETE /cart/remove/:id
Remove item from cart (requires authentication).

### Orders

#### GET /orders
Get user's order history (requires authentication).

**Query Parameters:**
- `status` - Filter by order status
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_id",
        "order_number": "SF-2024-001",
        "status": "delivered",
        "total_amount": 500,
        "created_at": "2024-01-15T10:30:00Z",
        "delivery_address": {
          "street": "123 Main St",
          "city": "Dhaka",
          "phone": "+8801234567890"
        },
        "items": [...]
      }
    ]
  }
}
```

#### POST /orders
Create a new order (requires authentication).

**Request Body:**
```json
{
  "delivery_address_id": "address_id",
  "payment_method": "cash_on_delivery",
  "coupon_code": "SAVE10",
  "notes": "Please call before delivery"
}
```

#### GET /orders/:id
Get order details by ID (requires authentication).

### User Profile

#### GET /profile
Get user profile information (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "phone": "+8801234567890",
      "addresses": [
        {
          "id": "address_id",
          "type": "home",
          "street": "123 Main St",
          "city": "Dhaka",
          "postal_code": "1000",
          "is_default": true
        }
      ]
    }
  }
}
```

#### PUT /profile
Update user profile (requires authentication).

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "+8801234567890"
}
```

#### POST /profile/addresses
Add new delivery address (requires authentication).

**Request Body:**
```json
{
  "type": "home",
  "street": "123 Main St",
  "city": "Dhaka",
  "postal_code": "1000",
  "is_default": false
}
```

## Error Responses

All API endpoints return errors in the following format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": {
      "email": ["The email field is required."]
    }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Request validation failed
- `UNAUTHORIZED` - Authentication required or invalid token
- `FORBIDDEN` - Access denied
- `NOT_FOUND` - Resource not found
- `SERVER_ERROR` - Internal server error

## Rate Limiting

The API implements rate limiting:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Data Types

### Product Categories

Available category slugs:
- `proteins`
- `dairy`
- `meat`
- `egg`
- `chicken`
- `fish`
- `fruits`
- `vegetables`
- `oil`
- `honey`

### Order Statuses

- `pending` - Order placed, awaiting processing
- `processing` - Order being prepared
- `delivered` - Order completed

### Payment Methods

- `cash_on_delivery` - Cash on delivery
- `bkash` - bKash mobile payment
- `nagad` - Nagad mobile payment
- `card` - Credit/debit card

### Discount Types

- `percentage` - Percentage-based discount
- `fixed` - Fixed amount discount