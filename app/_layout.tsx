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
import { deepGreenColor } from "@/constants/Colors";
import {
  CUSTOM_HEADER_OPTIONS,
  SHARED_HEADER_OPTIONS,
} from "@/constants/headerConfig";
import { CustomHeader } from "@/components/common/customHeader";

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
        <StatusBar
          style="light"
          backgroundColor={deepGreenColor}
          translucent={false}
        />
        <Stack screenOptions={CUSTOM_HEADER_OPTIONS}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="checkout"
            options={{
              headerShown: true,
              header: () => <CustomHeader title="Checkout" canGoBack={true} />,
            }}
          />
          <Stack.Screen
            name="my-orders"
            options={{
              headerShown: true,
              header: () => <CustomHeader title="My Orders" canGoBack={true} />,
            }}
          />
          <Stack.Screen
            name="my-profile"
            options={{
              headerShown: true,
              header: () => (
                <CustomHeader title="My Profile" canGoBack={true} />
              ),
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              headerShown: true,
              header: () => <CustomHeader title="Settings" canGoBack={true} />,
            }}
          />
          <Stack.Screen
            name="webview"
            options={{
              headerShown: true,
              header: () => <CustomHeader title="Safe Food" canGoBack={true} />,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
      <Toast />
    </>
  );
}
