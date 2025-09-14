# Safe Food App - Deployment Guide

## Overview

This guide covers the deployment process for the Safe Food app to both iOS App Store and Google Play Store using Expo Application Services (EAS).

## Prerequisites

### Required Accounts

1. **Expo Account**
   - Sign up at [expo.dev](https://expo.dev)
   - Verify email address

2. **Apple Developer Account** (for iOS)
   - Enroll at [developer.apple.com](https://developer.apple.com)
   - Annual fee: $99 USD
   - Required for App Store distribution

3. **Google Play Console Account** (for Android)
   - Sign up at [play.google.com/console](https://play.google.com/console)
   - One-time fee: $25 USD
   - Required for Play Store distribution

### Required Tools

1. **EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

## Project Configuration

### 1. EAS Configuration

Initialize EAS in your project:

```bash
eas build:configure
```

This creates `eas.json` with build profiles:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m1-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m1-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 2. App Configuration

Update `app.json` for production:

```json
{
  "expo": {
    "name": "Safe Food",
    "slug": "Safe-Foods-App",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/logo-safefood.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/safefoods-splash-logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.safefoods.app",
      "buildNumber": "1"
    },
    "android": {
      "package": "safefoods.com.bd",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/logo-safefood.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    }
  }
}
```

## iOS Deployment

### 1. Apple Developer Setup

#### Create App Identifier
1. Go to [developer.apple.com](https://developer.apple.com)
2. Navigate to Certificates, Identifiers & Profiles
3. Create new App ID with bundle identifier: `com.safefoods.app`

#### Create App Store Connect App
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+"
3. Fill in app information:
   - Name: "Safe Food"
   - Bundle ID: `com.safefoods.app`
   - SKU: `safe-food-app`

### 2. Build for iOS

#### Development Build
```bash
eas build --profile development --platform ios
```

#### Production Build
```bash
eas build --profile production --platform ios
```

### 3. Submit to App Store

#### Automatic Submission
```bash
eas submit --platform ios
```

#### Manual Submission
1. Download `.ipa` file from EAS dashboard
2. Upload to App Store Connect using Transporter app
3. Complete app information in App Store Connect
4. Submit for review

### 4. App Store Metadata

Required information for App Store Connect:

#### App Information
- **Name**: Safe Food
- **Subtitle**: Fresh Food Delivery
- **Category**: Food & Drink
- **Content Rights**: Original content

#### Version Information
- **Version**: 1.0.0
- **Build**: 1
- **What's New**: Initial release of Safe Food app

#### App Description
```
Safe Food is your trusted partner for fresh, quality food delivery. Browse through our wide selection of proteins, dairy, vegetables, and more. 

Features:
• Fresh and quality food products
• Easy browsing by categories
• Secure checkout process
• Multiple payment options
• Order tracking
• User-friendly interface

Download Safe Food today and enjoy fresh food delivered to your doorstep!
```

#### Keywords
```
food delivery, fresh food, grocery, proteins, dairy, vegetables, safe food, bangladesh
```

#### Screenshots
Required sizes:
- 6.7" iPhone: 1290 x 2796 pixels
- 6.5" iPhone: 1242 x 2688 pixels
- 5.5" iPhone: 1242 x 2208 pixels
- 12.9" iPad: 2048 x 2732 pixels

## Android Deployment

### 1. Google Play Console Setup

#### Create Application
1. Go to [play.google.com/console](https://play.google.com/console)
2. Click "Create app"
3. Fill in details:
   - App name: "Safe Food"
   - Default language: English
   - App type: App
   - Category: Food & Drink

### 2. Build for Android

#### Development Build
```bash
eas build --profile development --platform android
```

#### Production Build
```bash
eas build --profile production --platform android
```

### 3. App Signing

EAS handles app signing automatically. For manual signing:

#### Generate Keystore
```bash
eas credentials
```

#### Configure Signing
```json
{
  "android": {
    "package": "safefoods.com.bd",
    "versionCode": 1
  }
}
```

### 4. Submit to Play Store

#### Automatic Submission
```bash
eas submit --platform android
```

#### Manual Submission
1. Download `.aab` file from EAS dashboard
2. Upload to Google Play Console
3. Complete store listing
4. Submit for review

### 5. Play Store Metadata

#### Store Listing

**Short Description** (80 characters):
```
Fresh food delivery app with quality products and easy ordering
```

**Full Description** (4000 characters):
```
Safe Food - Your Trusted Fresh Food Delivery Partner

Safe Food brings you the freshest and highest quality food products right to your doorstep. Our carefully curated selection includes proteins, dairy products, fresh vegetables, fruits, and much more.

🥗 FRESH & QUALITY PRODUCTS
We source our products from trusted suppliers to ensure you get the best quality food items for you and your family.

🛒 EASY SHOPPING EXPERIENCE
Browse through our well-organized categories:
• Proteins & Meat
• Dairy Products
• Fresh Vegetables
• Seasonal Fruits
• Cooking Oils
• Natural Honey
• And much more!

💳 SECURE CHECKOUT
Multiple payment options including:
• Cash on Delivery
• bKash
• Nagad
• Credit/Debit Cards

📱 USER-FRIENDLY FEATURES
• Intuitive category browsing
• Product search functionality
• Shopping cart management
• Order history tracking
• Multiple delivery addresses
• Real-time order updates

🚚 RELIABLE DELIVERY
Fast and reliable delivery service across Bangladesh. Track your orders in real-time and get fresh food delivered when you need it.

🔒 SECURE & SAFE
Your personal information and payment details are protected with industry-standard security measures.

Download Safe Food today and experience the convenience of fresh food delivery!

For support: Contact us through the app or visit our website.
```

#### Graphics Assets

Required assets:
- **App Icon**: 512 x 512 pixels
- **Feature Graphic**: 1024 x 500 pixels
- **Screenshots**: 
  - Phone: 16:9 or 9:16 aspect ratio
  - Tablet: Various sizes supported

## Build Optimization

### 1. Bundle Size Optimization

#### Remove Unused Dependencies
```bash
npx expo install --fix
```

#### Analyze Bundle
```bash
npx expo export --dump-assetmap
```

### 2. Performance Optimization

#### Image Optimization
- Use WebP format for images
- Implement lazy loading
- Optimize image sizes

#### Code Splitting
- Use dynamic imports
- Lazy load screens
- Minimize bundle size

### 3. Production Configuration

#### Environment Variables
```javascript
// app.config.js
export default {
  expo: {
    extra: {
      apiUrl: process.env.NODE_ENV === 'production' 
        ? 'https://api.safefoods.com.bd/api'
        : 'https://staging-api.safefoods.com.bd/api'
    }
  }
};
```

## Release Management

### 1. Version Management

#### Semantic Versioning
- **Major**: Breaking changes (2.0.0)
- **Minor**: New features (1.1.0)
- **Patch**: Bug fixes (1.0.1)

#### Update Version
```bash
# Update version in app.json
# iOS: increment buildNumber
# Android: increment versionCode
```

### 2. Release Process

#### Pre-release Checklist
- [ ] All tests passing
- [ ] Performance tested
- [ ] Security review completed
- [ ] App store assets ready
- [ ] Release notes prepared

#### Release Steps
1. Create release branch
2. Update version numbers
3. Build and test
4. Submit to stores
5. Monitor release
6. Tag release in Git

### 3. Over-the-Air Updates

#### Configure EAS Update
```bash
eas update:configure
```

#### Publish Update
```bash
eas update --branch production --message "Bug fixes and improvements"
```

## Monitoring and Analytics

### 1. Crash Reporting

#### Sentry Integration
```bash
npx expo install @sentry/react-native
```

#### Configuration
```javascript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
});
```

### 2. Analytics

#### Expo Analytics
```javascript
import { Analytics } from 'expo-analytics';

const analytics = new Analytics('YOUR_TRACKING_ID');
analytics.event('Purchase', { category: 'Food', value: 100 });
```

## Troubleshooting

### Common Build Issues

#### iOS Build Failures
- Check provisioning profiles
- Verify bundle identifier
- Update Xcode version

#### Android Build Failures
- Check package name conflicts
- Verify keystore configuration
- Update Android SDK

### Store Rejection Issues

#### iOS App Store
- Follow Human Interface Guidelines
- Ensure app functionality works
- Provide proper app description

#### Google Play Store
- Follow Material Design guidelines
- Ensure app permissions are justified
- Provide proper privacy policy

## Post-Deployment

### 1. Monitor Performance
- Track app crashes
- Monitor user feedback
- Analyze usage metrics

### 2. User Feedback
- Respond to app store reviews
- Implement user suggestions
- Fix reported bugs

### 3. Regular Updates
- Release bug fixes
- Add new features
- Improve performance

## Support and Maintenance

### 1. Update Schedule
- Security updates: Immediate
- Bug fixes: Weekly
- Feature updates: Monthly
- Major releases: Quarterly

### 2. Backup Strategy
- Regular code backups
- Database backups
- Asset backups

### 3. Documentation
- Keep deployment docs updated
- Document known issues
- Maintain release notes