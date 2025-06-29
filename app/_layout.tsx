import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { View } from 'react-native';
import { useColorScheme } from "@/hooks/useColorScheme";
import Toast from "react-native-toast-message";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) console.log('Error loading fonts:', error);
  }, [error]);

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load
        if (loaded) {
          // Add minimum splash screen duration (e.g., 2 seconds)
          await new Promise(resolve => setTimeout(resolve, 2000));
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn('Error during app preparation:', e);
      }
    }

    prepare();
  }, [loaded]);

  useEffect(() => {
    async function hideSplash() {
      if (appIsReady) {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.warn('Error hiding splash screen:', e);
        }
      }
    }

    hideSplash();
  }, [appIsReady]);

  // Don't render anything until app is ready
  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <ThemeProvider
        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="/checkout" options={{ headerShown: false }} />
          <Stack.Screen name="/my-orders" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
      <Toast />
    </View>
  );
}