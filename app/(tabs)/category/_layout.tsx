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
        options={
          { headerShown: false, title: "Category" } // false to Hide the header for the category screen
        }
      />
      <Stack.Screen
        name="/(tabs)/category/details"
        options={{ title: "Details" }}
      />
    </Stack>
  );
}
