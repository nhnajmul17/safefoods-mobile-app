import { CustomHeader } from "@/components/common/customerHeader";
import { CUSTOM_HEADER_OPTIONS } from "@/constants/headerConfig";
import { Stack } from "expo-router";

export default function MenuLayout() {
  return (
    <Stack screenOptions={CUSTOM_HEADER_OPTIONS}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          header: () => <CustomHeader title="Menu" />,
        }}
      />
    </Stack>
  );
}
