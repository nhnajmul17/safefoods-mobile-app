# Safe Food App 🥗

A React Native mobile application built with Expo for food delivery and e-commerce. Safe Food provides a seamless shopping experience for fresh food products with features like user authentication, product browsing, cart management, and order tracking.

## 📱 Features

- **User Authentication**: Login, registration, OTP verification, password reset
- **Product Browsing**: Category-based navigation, search, product details
- **Shopping Cart**: Add/remove items, quantity management, persistent storage
- **Order Management**: Order placement, history, tracking, delivery management
- **User Profile**: Profile management, address book, settings

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npx expo start
   ```

3. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on your device

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[📖 Main Documentation](docs/README.md)** - Complete project overview and architecture
- **[🔧 Development Setup](docs/DEVELOPMENT_SETUP.md)** - Environment setup and development workflow
- **[🧩 Component Guide](docs/COMPONENT_GUIDE.md)** - Reusable components and usage examples
- **[🌐 API Documentation](docs/API_DOCUMENTATION.md)** - API endpoints and integration guide
- **[🚀 Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Build and deployment instructions

## 🏗️ Tech Stack

- **Framework**: Expo SDK 53
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand with AsyncStorage persistence
- **UI**: React Native with custom components
- **Testing**: Jest with React Native Testing Library

## 📁 Project Structure

```
safe-foods-app/
├── app/                    # Expo Router pages
├── components/             # Reusable UI components
├── store/                  # Zustand state management
├── constants/              # App constants and types
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions
├── assets/                 # Images, icons, fonts
└── docs/                   # Documentation
```

## 🛠️ Development Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run on web browser
npm test           # Run tests
npm run lint       # Lint code
```

## 🌟 Key Components

- **Authentication Flow**: Complete auth system with OTP verification
- **Product Catalog**: Category-based browsing with search functionality
- **Shopping Cart**: Persistent cart with real-time updates
- **Order System**: Full order lifecycle management
- **User Management**: Profile, addresses, and preferences

## 🔗 API Integration

The app integrates with the Safe Food API:
- **Base URL**: `https://api.safefoods.com.bd/api`
- **Authentication**: JWT token-based
- **Features**: Products, orders, user management, payments

## 📱 Supported Platforms

- **iOS**: iPhone and iPad
- **Android**: Phone and tablet
- **Web**: Progressive Web App support

## 🤝 Contributing

1. Read the [Development Setup Guide](docs/DEVELOPMENT_SETUP.md)
2. Follow the [Component Guide](docs/COMPONENT_GUIDE.md) for consistency
3. Write tests for new features
4. Update documentation as needed

## 📄 License

This project is proprietary software for Safe Food Bangladesh.

## 📞 Support

For technical support or questions:
- WhatsApp: +8801332945561
- Email: support@safefoods.com.bd

---

Built with ❤️ using Expo and React Native
