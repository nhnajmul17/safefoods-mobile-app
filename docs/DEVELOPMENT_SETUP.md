# Safe Food App - Development Setup Guide

## Prerequisites

Before setting up the development environment, ensure you have the following installed:

### Required Software

1. **Node.js** (v18.0.0 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** or **Yarn**
   - npm comes with Node.js
   - For Yarn: `npm install -g yarn`

3. **Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

4. **Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

### Mobile Development Tools

#### For iOS Development (macOS only)

1. **Xcode** (latest version)
   - Download from Mac App Store
   - Install iOS Simulator

2. **iOS Simulator**
   - Included with Xcode
   - Launch via Xcode → Developer Tools → Simulator

#### For Android Development

1. **Android Studio**
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Install Android SDK and emulator

2. **Android SDK Setup**
   - Open Android Studio
   - Go to SDK Manager
   - Install latest Android SDK
   - Set up environment variables:
     ```bash
     export ANDROID_HOME=$HOME/Library/Android/sdk
     export PATH=$PATH:$ANDROID_HOME/emulator
     export PATH=$PATH:$ANDROID_HOME/tools
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     ```

3. **Android Emulator**
   - Create virtual device in Android Studio
   - Choose API level 30 or higher

## Project Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd safe-foods-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create environment configuration files:

#### `.env` (if needed)
```env
API_URL=https://api.safefoods.com.bd/api
NODE_ENV=development
```

#### `app.config.js` (if using dynamic config)
```javascript
export default {
  expo: {
    name: "Safe Food",
    slug: "Safe-Foods-App",
    // ... other config
  },
};
```

### 4. Start Development Server

```bash
npx expo start
```

This will open the Expo Developer Tools in your browser.

## Development Workflow

### Running on Different Platforms

#### iOS Simulator
```bash
npx expo start --ios
```
Or press `i` in the terminal after running `npx expo start`

#### Android Emulator
```bash
npx expo start --android
```
Or press `a` in the terminal after running `npx expo start`

#### Web Browser
```bash
npx expo start --web
```
Or press `w` in the terminal after running `npx expo start`

#### Physical Device

1. Install Expo Go app on your device
2. Scan QR code from terminal or browser
3. App will load on your device

### Development Scripts

Available npm scripts:

```bash
# Start development server
npm start

# Start with specific platform
npm run android
npm run ios
npm run web

# Run tests
npm test

# Lint code
npm run lint

# Reset project (removes example code)
npm run reset-project
```

## Code Editor Setup

### VS Code (Recommended)

Install these extensions:

1. **ES7+ React/Redux/React-Native snippets**
2. **TypeScript Importer**
3. **Prettier - Code formatter**
4. **ESLint**
5. **React Native Tools**
6. **Auto Rename Tag**
7. **Bracket Pair Colorizer**

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "typescriptreact"
  }
}
```

### Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2
}
```

### ESLint Configuration

The project uses Expo's ESLint config. Extend as needed in `.eslintrc.js`:

```javascript
module.exports = {
  extends: ["expo", "@expo/eslint-config-expo"],
  rules: {
    // Add custom rules here
  },
};
```

## Debugging

### React Native Debugger

1. Install React Native Debugger
2. Enable debugging in Expo app
3. Open debugger on port 19000

### Flipper (Advanced)

1. Install Flipper desktop app
2. Configure for React Native
3. Use for network inspection, layout debugging

### Chrome DevTools

1. Open Expo app
2. Shake device or press Cmd+D (iOS) / Cmd+M (Android)
3. Select "Debug JS Remotely"
4. Chrome DevTools will open

## Testing Setup

### Jest Configuration

Jest is pre-configured with Expo. Test files should be:
- `__tests__/**/*.test.ts(x)`
- `**/*.test.ts(x)`
- `**/*.spec.ts(x)`

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

Example component test:

```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import { CustomHeader } from '../customHeader';

describe('CustomHeader', () => {
  it('renders correctly', () => {
    const { getByText } = render(<CustomHeader title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });
});
```

## Performance Monitoring

### Flipper Performance Plugin

1. Install Flipper
2. Enable Performance plugin
3. Monitor FPS, memory usage

### React DevTools Profiler

1. Install React DevTools browser extension
2. Use Profiler tab to analyze component performance

## Build Configuration

### EAS Build Setup

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login to Expo:
   ```bash
   eas login
   ```

3. Configure build:
   ```bash
   eas build:configure
   ```

### Build Profiles

The `eas.json` file contains build configurations:

```json
{
  "cli": {
    "version": ">= 2.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## Troubleshooting

### Common Issues

#### Metro bundler issues
```bash
npx expo start --clear
```

#### iOS Simulator not opening
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

#### Android emulator issues
- Ensure ANDROID_HOME is set correctly
- Check if emulator is running
- Try cold boot of emulator

#### Package installation issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Getting Help

1. **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev)
2. **React Native Documentation**: [reactnative.dev](https://reactnative.dev)
3. **Stack Overflow**: Tag questions with `expo` and `react-native`
4. **Expo Discord**: [chat.expo.dev](https://chat.expo.dev)

## Development Best Practices

### 1. Code Organization
- Keep components small and focused
- Use TypeScript for type safety
- Follow consistent naming conventions

### 2. Performance
- Use FlatList for large lists
- Implement proper image optimization
- Avoid unnecessary re-renders

### 3. State Management
- Use Zustand for global state
- Keep local state minimal
- Implement proper error handling

### 4. Navigation
- Use Expo Router file-based routing
- Implement proper deep linking
- Handle navigation state properly

### 5. API Integration
- Implement proper error handling
- Use loading states
- Cache data when appropriate

### 6. Testing
- Write tests for critical functionality
- Test on multiple devices
- Use automated testing where possible

## Deployment Preparation

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] Code linted and formatted
- [ ] Performance optimized
- [ ] Error handling implemented
- [ ] API endpoints configured
- [ ] App icons and splash screens ready
- [ ] Store listings prepared
- [ ] Privacy policy and terms ready

### Build Commands

```bash
# Development build
eas build --profile development --platform ios
eas build --profile development --platform android

# Production build
eas build --profile production --platform all
```