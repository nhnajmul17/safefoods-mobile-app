import { Stack } from "expo-router";

export default function CategoryLayout() {
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
        options={{ headerShown: false, title: "Category" }}
      />
      <Stack.Screen name="details" options={{ title: "Details" }} />
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
