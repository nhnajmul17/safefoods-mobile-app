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
      <Stack.Screen name="fruits" options={{ title: "Fruits" }} />
      <Stack.Screen name="vegetables" options={{ title: "Vegetables" }} />
      <Stack.Screen name="cheese" options={{ title: "Chesses" }} />
      <Stack.Screen name="meat" options={{ title: "Meat" }} />
    </Stack>
  );
}
