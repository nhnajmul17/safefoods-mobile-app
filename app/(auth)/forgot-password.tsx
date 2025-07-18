import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/constants/variables";

const forgotPasswordAPI = async (email: string) => {
  const response = await fetch(`${API_URL}/v1/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return response.json();
};

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { setResetData } = useAuthStore(); // Access setResetData from authStore

  const handleSubmit = async () => {
    if (email) {
      try {
        const response = await forgotPasswordAPI(email);
        if (response.success) {
          const token = response.token;
          setResetData(email, token); // Store email and token in authStore
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "An OTP has been sent to your email",
            text2Style: { fontSize: 12, fontWeight: "bold" },
          });
          router.replace("/otp-verification");
        } else if (!response.success) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2:
              response.message || "Failed to verify OTP. Please try again.",
            text2Style: { fontSize: 12, fontWeight: "bold" },
          });
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to send OTP. Please try again.",
          text2Style: { fontSize: 12, fontWeight: "bold" },
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your email",
        text2Style: { fontSize: 12, fontWeight: "bold" },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", marginBottom: 32 }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Forgot Password
        </Text>
        <Text style={{ fontSize: 20, color: "#999", textAlign: "center" }}>
          Enter your email to reset your password
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="johncharles@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <View style={styles.backContainer}>
        <Text style={styles.backText}>Remember your password? </Text>
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.backLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#55796d",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 14,
    color: "#000",
  },
  backLink: {
    fontSize: 14,
    color: "#4f998e",
    fontWeight: "bold",
  },
});
