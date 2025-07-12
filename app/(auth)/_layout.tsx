import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          headerTitle: "Sign in",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
          headerTitle: "Sign up",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
        }}
      />
      <Stack.Screen
        name="register-otp-verification"
        options={{
          headerShown: false,
          headerTitle: "Register OTP Verification",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
        }}
      />

      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: false,
          headerTitle: "Forgot Password",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
        }}
      />
      <Stack.Screen
        name="otp-verification"
        options={{
          headerShown: false,
          headerTitle: "OTP Verification",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          headerShown: false,
          headerTitle: "Reset Password",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
        }}
      />
    </Stack>
  );
}
