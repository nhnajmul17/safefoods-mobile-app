import { CustomHeader } from "@/components/common/customerHeader";
import { CUSTOM_HEADER_OPTIONS } from "@/constants/headerConfig";
import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={CUSTOM_HEADER_OPTIONS}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          header: () => <CustomHeader title="Home" />,
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
