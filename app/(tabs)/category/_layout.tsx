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
          headerStyle: { backgroundColor: "#98fb98" },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
          // headerStyle: {
          //   backgroundColor:
          //     colorScheme === "dark" ? lightGreenColor : lightGreenColor,
          // },
        }}
        // options={{ headerShown: false, title: "Category" }}
      />
      <Stack.Screen
        name="fruits"
        options={{
          title: "Fruits",
          headerStyle: { backgroundColor: "#98fb98" },
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
        name="dairy"
        options={{
          title: "Dairy",
          headerStyle: { backgroundColor: "#98fb98" },
          // headerStyle: { backgroundColor: "#f0e68c" },
        }}
      />
      <Stack.Screen
        name="meat"
        options={{ title: "Meat", headerStyle: { backgroundColor: "#98fb98" } }}
      />
      <Stack.Screen
        name="protein"
        options={{
          title: "Protein",
          headerStyle: { backgroundColor: "#98fb98" },
        }}
      />
      <Stack.Screen
        name="[productId]"
        options={{
          headerShown: true,
          title: "",
          headerStyle: { backgroundColor: "#98fb98" },
        }}
      />
    </Stack>
  );
}
