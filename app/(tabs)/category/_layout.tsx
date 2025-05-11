import { lightGreenColor } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function CategoryLayout() {
  const colorScheme = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Category",
          headerStyle: {
            backgroundColor:
              colorScheme === "dark" ? lightGreenColor : lightGreenColor,
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
        }}
        // options={{ headerShown: false, title: "Category" }}
      />
      <Stack.Screen
        name="[productId]"
        options={{
          headerShown: true,
          title: "Product Details",
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#1a1a1a" : "#87ceeb",
          },
        }}
      />
      <Stack.Screen
        name="fruits"
        options={{
          title: "Fruits",
          headerStyle: { backgroundColor: "#ff6347" },
        }}
      />
      <Stack.Screen
        name="vegetables"
        options={{
          title: "Vegetables",
          headerStyle: { backgroundColor: "#98fb98" },
        }}
      />
      <Stack.Screen
        name="cheese"
        options={{
          title: "Chesses",
          headerStyle: { backgroundColor: "#f0e68c" },
        }}
      />
      <Stack.Screen
        name="meat"
        options={{ title: "Meat", headerStyle: { backgroundColor: "#ff4500" } }}
      />
    </Stack>
  );
}
