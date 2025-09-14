# Safe Food App Documentation

## Overview

Safe Food is a React Native mobile application built with Expo that provides a food delivery and e-commerce platform. The app allows users to browse food categories, add items to cart, manage orders, and handle user authentication.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Features](#features)
- [State Management](#state-management)
- [Navigation](#navigation)
- [API Integration](#api-integration)
- [Development Guidelines](#development-guidelines)

## Architecture Overview

The app follows a modern React Native architecture with:

- **Framework**: Expo SDK 53
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand with AsyncStorage persistence
- **UI Components**: Custom components with React Native
- **TypeScript**: Full TypeScript support for type safety

## Project Structure

```
safe-foods-app/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Authentication flow
│   ├── (tabs)/                   # Main tab navigation
│   ├── (product)/                # Product details
│   └── _layout.tsx               # Root layout
├── components/                   # Reusable UI components
│   ├── auth/                     # Authentication components
│   ├── common/                   # Shared components
│   ├── homeScreen/               # Home screen components
│   ├── categoryScreen/           # Category screen components
│   ├── checkoutScreen/           # Checkout components
│   └── ui/                       # Base UI components
├── store/                        # Zustand state management
├── constants/                    # App constants and types
├── hooks/                        # Custom React hooks
├── utils/                        # Utility functions
└── assets/                       # Images, icons, fonts
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npx expo start
   ```

### Environment Setup

The app uses the following API endpoint:
- Production API: `https://api.safefoods.com.bd/api`

## Features

### Core Features

1. **User Authentication**
   - Email/Phone login
   - Registration with OTP verification
   - Password reset functionality
   - Persistent login state

2. **Product Browsing**
   - Category-based navigation
   - Product search and filtering
   - Product details with variants
   - Related products suggestions

3. **Shopping Cart**
   - Add/remove items
   - Quantity management
   - Persistent cart state
   - Price calculations

4. **Order Management**
   - Order placement
   - Order history
   - Order tracking
   - Delivery address management

5. **User Profile**
   - Profile management
   - Address book
   - Settings and preferences

### Navigation Structure

The app uses a nested navigation structure:

```
Root Stack
├── (tabs) - Main Tab Navigation
│   ├── home - Home screen
│   ├── category - Category browsing
│   ├── shop-now - Shop now section
│   ├── cart - Shopping cart
│   └── menu - User menu
├── (auth) - Authentication Stack
│   ├── login - User login
│   ├── register - User registration
│   ├── otp-verification - OTP verification
│   └── forgot-password - Password reset
└── Modal Screens
    ├── checkout - Checkout process
    ├── my-orders - Order history
    ├── my-profile - User profile
    └── settings - App settings
```

## State Management

The app uses Zustand for state management with two main stores:

### Auth Store (`store/authStore.ts`)

Manages user authentication state:

```typescript
interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  accessToken: string | null;
  // ... other auth-related fields
}
```

**Key Methods:**
- `login()` - Authenticate user
- `logout()` - Clear user session
- `setRegisterData()` - Store registration data
- `setResetData()` - Store password reset data

### Cart Store (`store/cartStore.ts`)

Manages shopping cart state:

```typescript
interface CartState {
  cartItems: CartItem[];
  isCartFetchedFromApi: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variantId: string) => void;
  updateQuantity: (id: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
```

**Key Features:**
- Persistent storage with AsyncStorage
- Automatic price calculations
- Variant-based item management

## API Integration

The app integrates with the Safe Food API at `https://api.safefoods.com.bd/api`.

### Key Endpoints

- Authentication endpoints
- Product catalog
- Order management
- User profile management

### Data Types

Core data types are defined in `constants/types.ts` and `store/storeTypes.ts`:

```typescript
interface Product {
  id: string;
  name: string;
  image: string;
  weight: string;
  price: number;
}

interface CartItem {
  id: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  quantity: number;
}
```

## Development Guidelines

### Code Organization

1. **Components**: Use functional components with TypeScript
2. **Styling**: Use StyleSheet.create() for component styles
3. **State**: Use Zustand stores for global state, useState for local state
4. **Navigation**: Use Expo Router's file-based routing
5. **Types**: Define interfaces in appropriate type files

### Best Practices

1. **Performance**
   - Use React.memo() for expensive components
   - Implement proper list optimizations
   - Lazy load images and components

2. **Error Handling**
   - Implement proper error boundaries
   - Handle API errors gracefully
   - Provide user-friendly error messages

3. **Testing**
   - Write unit tests for utility functions
   - Test component rendering
   - Test state management logic

### Constants and Configuration

Key constants are defined in `constants/variables.ts`:

- API URLs
- Category constants
- Payment method types
- Order status types
- Contact information

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Add proper error handling
4. Update documentation for new features
5. Test on both iOS and Android platforms

## Deployment

The app is configured for deployment with:

- **Package**: `safefoods.com.bd`
- **EAS Project ID**: `090b5a58-7b06-42e5-ae65-1a05fdf5971f`
- **Owner**: `nhnajmul17`

Use EAS Build for production deployments:

```bash
eas build --platform all
```