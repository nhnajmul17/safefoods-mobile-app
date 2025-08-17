import { deepGreenColor } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function CategoryLayout() {
  // Map to convert slug to display title
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
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: deepGreenColor,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Category",
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: deepGreenColor },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
            color: "#fff",
          },
        }}
      />
      <Stack.Screen
        name="[category]"
        options={({ route }) => {
          // Safe access to route params
          const params = route.params as { category?: string };
          const category = params?.category || "";
          return {
            title: categoryTitles[category] || "Category",
          };
        }}
      />
      <Stack.Screen
        name="(product-details)/[productId]"
        options={{
          headerShown: true,
          headerTitle: "",
        }}
      />
    </Stack>
  );
}
