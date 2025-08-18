import { SHARED_HEADER_OPTIONS } from "@/constants/headerConfig";
import { Stack } from "expo-router";

export default function ShopNowLayout() {
  return (
    <Stack screenOptions={SHARED_HEADER_OPTIONS}>
      <Stack.Screen
        name="index"
        options={{
          title: "Shop Now",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="(product-details)/[productId]"
        options={{
          headerShown: true,
          headerTitle: "Product Details",
        }}
      />
    </Stack>
  );
}
