# Safe Food App - Component Guide

## Overview

This guide covers the reusable components in the Safe Food app, their props, usage examples, and best practices.

## Common Components

### CustomHeader

A reusable header component with back navigation and customizable content.

**Location**: `components/common/customHeader.tsx`

**Props:**
```typescript
interface CustomHeaderProps {
  title: string;
  canGoBack?: boolean;
  rightComponent?: React.ReactNode;
  showHeader?: boolean;
}
```

**Usage:**
```tsx
import { CustomHeader } from '@/components/common/customHeader';

// Basic header with title
<CustomHeader title="My Profile" />

// Header with back button
<CustomHeader title="Settings" canGoBack={true} />

// Header with right component
<CustomHeader 
  title="Cart" 
  canGoBack={true}
  rightComponent={<CartIcon />}
/>
```

### CustomTabBar

Custom tab bar component for bottom navigation.

**Location**: `components/common/customTabBar.tsx`

**Features:**
- Custom styling
- Active/inactive states
- Icon support
- Badge support for cart items

### Loader

Loading spinner component for async operations.

**Location**: `components/common/loader.tsx`

**Usage:**
```tsx
import { Loader } from '@/components/common/loader';

// Show loader during API calls
{isLoading && <Loader />}
```

## Home Screen Components

### BannerCarousel

Image carousel component for promotional banners.

**Location**: `components/homeScreen/bannerCarousel.tsx`

**Features:**
- Auto-scroll functionality
- Pagination indicators
- Touch navigation
- Image lazy loading

**Usage:**
```tsx
import { BannerCarousel } from '@/components/homeScreen/bannerCarousel';

<BannerCarousel banners={bannerData} />
```

### CategorySection

Grid layout for product categories.

**Location**: `components/homeScreen/categorySection.tsx`

**Features:**
- Responsive grid layout
- Category icons
- Navigation to category pages

### BestDeal & OnSale Components

Product showcase components for featured items.

**Locations:**
- `components/homeScreen/bestDeal.tsx`
- `components/homeScreen/onSale.tsx`

**Features:**
- Horizontal scrolling
- Product cards
- Price display
- Add to cart functionality

## Product Components

### CategoryProductCard

Product card component for category listings.

**Location**: `components/categoryScreen/categoryProductCard.tsx`

**Props:**
```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductPress: (productId: string) => void;
}
```

**Features:**
- Product image
- Name and price display
- Add to cart button
- Quantity selector

### ShopNowProductCard

Product card for shop now section.

**Location**: `components/shopNowScreen/shopNowProductCard.tsx`

**Similar to CategoryProductCard but with different styling**

### RelatedProducts

Component showing related products on product detail pages.

**Location**: `components/productDetails/RelatedProducts.tsx`

**Features:**
- Horizontal product list
- Similar product recommendations
- Navigation to product details

## Checkout Components

### OrderSummary

Displays order totals and breakdown.

**Location**: `components/checkoutScreen/orderSummary.tsx`

**Features:**
- Item count and subtotal
- Delivery charges
- Discount calculations
- Final total

### DeliveryAddress

Address selection and management component.

**Location**: `components/checkoutScreen/deliveryAddress.tsx`

**Features:**
- Address list display
- Add new address
- Edit existing addresses
- Default address selection

### PaymentMethods

Payment method selection component.

**Location**: `components/checkoutScreen/paymentMethods.tsx`

**Supported Methods:**
- Cash on Delivery
- bKash
- Nagad
- Credit/Debit Card

### CouponSection

Coupon code input and validation.

**Location**: `components/checkoutScreen/couponSection.tsx`

**Features:**
- Coupon code input
- Validation feedback
- Discount display
- Remove coupon option

## Profile Components

### ProfileHeader

User profile information display.

**Location**: `components/myProfileScreen/profileHeader.tsx`

**Features:**
- User avatar
- Name and email display
- Edit profile button

### AddressCard

Individual address display component.

**Location**: `components/myProfileScreen/addressCard.tsx`

**Features:**
- Address details
- Edit/delete actions
- Default address indicator

### AddressFormModal

Modal for adding/editing addresses.

**Location**: `components/myProfileScreen/addressFormModal.tsx`

**Features:**
- Form validation
- Address type selection
- Save/cancel actions

## Order Components

### OrderCard

Individual order display in order history.

**Location**: `components/myOrdersScreen/orderCard.tsx`

**Features:**
- Order number and date
- Status indicator
- Total amount
- Item count
- View details action

### OrderModal

Modal for detailed order view.

**Location**: `components/myOrdersScreen/orderModal.tsx`

**Features:**
- Complete order details
- Item list
- Delivery information
- Order tracking

## UI Components

### ThemedText & ThemedView

Base components with theme support.

**Locations:**
- `components/ThemedText.tsx`
- `components/ThemedView.tsx`

**Features:**
- Automatic theme switching
- Consistent styling
- Accessibility support

### IconSymbol

Cross-platform icon component.

**Location**: `components/ui/IconSymbol.tsx`

**Usage:**
```tsx
import { IconSymbol } from '@/components/ui/IconSymbol';

<IconSymbol name="home" size={24} color="#000" />
```

## Component Best Practices

### 1. Props Interface

Always define TypeScript interfaces for component props:

```typescript
interface ComponentProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
}

const MyComponent: React.FC<ComponentProps> = ({ title, onPress, disabled }) => {
  // Component implementation
};
```

### 2. Default Props

Use default parameters for optional props:

```typescript
const MyComponent: React.FC<ComponentProps> = ({ 
  title, 
  onPress = () => {}, 
  disabled = false 
}) => {
  // Component implementation
};
```

### 3. Styling

Use StyleSheet.create() for component styles:

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

### 4. Performance Optimization

Use React.memo() for components that receive stable props:

```typescript
const ExpensiveComponent = React.memo<ComponentProps>(({ data }) => {
  // Expensive rendering logic
});
```

### 5. Error Boundaries

Wrap components that might fail in error boundaries:

```tsx
<ErrorBoundary>
  <ComponentThatMightFail />
</ErrorBoundary>
```

### 6. Accessibility

Add accessibility props for better user experience:

```tsx
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Add to cart"
  accessibilityRole="button"
>
  <Text>Add to Cart</Text>
</TouchableOpacity>
```

## Testing Components

### Unit Testing

Test component rendering and props:

```typescript
import { render } from '@testing-library/react-native';
import { CustomHeader } from '../customHeader';

test('renders header with title', () => {
  const { getByText } = render(<CustomHeader title="Test Title" />);
  expect(getByText('Test Title')).toBeTruthy();
});
```

### Integration Testing

Test component interactions:

```typescript
import { fireEvent } from '@testing-library/react-native';

test('calls onPress when button is pressed', () => {
  const mockOnPress = jest.fn();
  const { getByRole } = render(
    <CustomButton onPress={mockOnPress} title="Press me" />
  );
  
  fireEvent.press(getByRole('button'));
  expect(mockOnPress).toHaveBeenCalled();
});
```

## Component Lifecycle

### 1. Planning
- Define component purpose and scope
- Identify required props and state
- Plan component structure

### 2. Implementation
- Create TypeScript interfaces
- Implement component logic
- Add styling and animations

### 3. Testing
- Write unit tests
- Test on different screen sizes
- Verify accessibility

### 4. Documentation
- Document props and usage
- Add code examples
- Update this guide

### 5. Maintenance
- Monitor performance
- Update for new requirements
- Refactor when needed