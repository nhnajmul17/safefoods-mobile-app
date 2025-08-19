import { CustomHeader } from "@/components/common/customerHeader";
import { CUSTOM_HEADER_OPTIONS } from "@/constants/headerConfig";
import { Stack } from "expo-router";

export default function ShopNowLayout() {
  return (
    <Stack screenOptions={CUSTOM_HEADER_OPTIONS}>
      <Stack.Screen
        name="index"
        options={{
          // title: "Shop Now",
          headerShown: true,
          header: () => <CustomHeader title="Shop Now" />,
        }}
      />
      <Stack.Screen
        name="(product-details)/[productId]"
        options={{
          headerShown: true,
          header: () => <CustomHeader title="" canGoBack={true} />,
        }}
      />
    </Stack>
  );
}
