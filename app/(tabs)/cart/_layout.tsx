import { SHARED_HEADER_OPTIONS } from "@/constants/headerConfig";
import { Stack } from "expo-router";

export default function CartLayout() {
  return (
    <Stack screenOptions={SHARED_HEADER_OPTIONS}>
      <Stack.Screen
        name="index"
        options={{
          title: "Cart",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
