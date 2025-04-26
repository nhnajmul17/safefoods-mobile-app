import { Stack } from "expo-router";

export default function HomeLayout() {
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
          { headerShown: false, title: "Home" } // false to Hide the header for the home screen
        }
      />
      <Stack.Screen name="details" options={{ title: "Details" }} />
    </Stack>
  );
}
