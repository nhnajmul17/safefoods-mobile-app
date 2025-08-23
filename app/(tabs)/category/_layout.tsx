import { CustomHeader } from "@/components/common/customHeader";
import { CUSTOM_HEADER_OPTIONS } from "@/constants/headerConfig";

import { Stack } from "expo-router";

export default function CategoryLayout() {
  const categoryTitles: { [key: string]: string } = {
    protein: "Protein",
    dairy: "Dairy",
    meat: "Meat",
    egg: "Egg",
    chicken: "Chicken",
    fish: "Fish",
    fruits: "Fruits",
    vegetables: "Vegetables",
    oil: "Oil",
    honey: "Honey",
  };

  return (
    <Stack screenOptions={CUSTOM_HEADER_OPTIONS}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          header: () => <CustomHeader title="Category" />,
        }}
      />
      <Stack.Screen
        name="[category]"
        options={({ route }) => {
          const params = route.params as { category?: string };
          const category = params?.category || "";
          const title = categoryTitles[category] || "Category";

          return {
            headerShown: true,
            header: () => <CustomHeader title={title} canGoBack={true} />,
          };
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
