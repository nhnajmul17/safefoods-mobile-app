import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import Toast from "react-native-toast-message";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <ThemeProvider
        value={colorScheme === "dark" ? DefaultTheme : DefaultTheme}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="checkout"
            options={{
              headerTitle: "Checkout",
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 24,
              },
            }}
          />
          <Stack.Screen
            name="my-orders"
            options={{
              headerTitle: "My Orders",
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 24,
              },
            }}
          />
          <Stack.Screen
            name="my-profile"
            options={{
              headerTitle: "My Profile",
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 24,
              },
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              headerTitle: "Settings",
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 24,
              },
            }}
          />
          <Stack.Screen
            name="webview"
            options={{
              headerTitle: "Safe Foods",
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 20,
              },
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
      <Toast />
    </>
  );
}
