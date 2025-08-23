import { CustomHeader } from "@/components/common/customHeader";
import { CUSTOM_HEADER_OPTIONS } from "@/constants/headerConfig";
import { Stack } from "expo-router";

export default function CartLayout() {
  return (
    <Stack screenOptions={CUSTOM_HEADER_OPTIONS}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          header: () => <CustomHeader title="Cart" />,
        }}
      />
    </Stack>
  );
}
