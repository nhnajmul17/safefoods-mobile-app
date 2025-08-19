import { SHARED_HEADER_OPTIONS } from "@/constants/headerConfig";
import { Stack } from "expo-router";

export default function MenuLayout() {
  return (
    <Stack screenOptions={SHARED_HEADER_OPTIONS}>
      <Stack.Screen
        name="index"
        options={{
          title: "Menu",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
