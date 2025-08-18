import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Platform, StatusBar as RNStatusBar, View, Text } from "react-native";
// Consistent header height
export const HEADER_HEIGHT = 90;

// Custom header component for consistent height and status bar coverage
function AppHeader({ title }: { title: string }) {
  const statusBarHeight =
    Platform.OS === "android" ? RNStatusBar.currentHeight || 0 : 0;
  return (
    <View
      style={{
        backgroundColor: deepGreenColor,
        height: HEADER_HEIGHT + statusBarHeight,
        paddingTop: statusBarHeight,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.1)",
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 24,
          color: "#fff",
          textAlign: "center",
        }}
      >
        {title}
      </Text>
    </View>
  );
}

import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import Toast from "react-native-toast-message";
import { deepGreenColor } from "@/constants/Colors";

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
            options={{ header: () => <AppHeader title="Checkout" /> }}
          />
          <Stack.Screen
            name="my-orders"
            options={{ header: () => <AppHeader title="My Orders" /> }}
          />
          <Stack.Screen
            name="my-profile"
            options={{ header: () => <AppHeader title="My Profile" /> }}
          />
          <Stack.Screen
            name="settings"
            options={{ header: () => <AppHeader title="Settings" /> }}
          />
          <Stack.Screen
            name="webview"
            options={{ header: () => <AppHeader title="Safe Foods" /> }}
          />
        </Stack>
        <StatusBar style="light" backgroundColor={deepGreenColor} translucent />
      </ThemeProvider>
      <Toast />
    </>
  );
}
