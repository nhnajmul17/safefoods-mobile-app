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
import NetInfo from "@react-native-community/netinfo";
import NoInternetScreen from "../components/NoInternetScreen";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import Toast from "react-native-toast-message";
import { deepGreenColor } from "@/constants/Colors";
import {
  CUSTOM_HEADER_OPTIONS,
  SHARED_HEADER_OPTIONS,
} from "@/constants/headerConfig";
import { CustomHeader } from "@/components/common/customHeader";
import { UpdateManager } from "@/utils/updateManager";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || isConnected === null) {
    return null;
  }

  if (!isConnected) {
    return <NoInternetScreen />;
  }

  return (
    <UpdateManager>
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
            name="guest-checkout"
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
    </UpdateManager>
  );
}
