import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/constants/variables";

const resetPasswordAPI = async (
  email: string,
  token: string,
  code: string,
  password: string,
  confirmPassword: string
) => {
  const response = await fetch(`${API_URL}/v2/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      forgot_password_token: token,
    },
    body: JSON.stringify({ email, password, confirmPassword }),
  });
  return response.json();
};

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { resetEmail, resetToken, otpCode, logout } = useAuthStore(); // Access authStore state

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
        text2Style: { fontSize: 12, fontWeight: "bold" },
      });
    } else if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Passwords do not match",
        text2Style: { fontSize: 12, fontWeight: "bold" },
      });
    } else if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Password must be at least 6 characters",
        text2Style: { fontSize: 12, fontWeight: "bold" },
      });
    } else if (!resetEmail || !resetToken || !otpCode) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Missing required data. Please try again.",
        text2Style: { fontSize: 12, fontWeight: "bold" },
      });
    } else {
      try {
        const response = await resetPasswordAPI(
          resetEmail,
          resetToken,
          otpCode,
          password,
          confirmPassword
        );
        if (response.success) {
          logout(); // Reset all values in authStore
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Password reset successfully",
            text2Style: { fontSize: 12, fontWeight: "bold" },
          });
          router.replace("/login");
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
          text2: "Failed to reset password. Please try again.",
          text2Style: { fontSize: 12, fontWeight: "bold" },
        });
      }
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
          Reset Password
        </Text>
        <Text style={{ fontSize: 20, color: "#999", textAlign: "center" }}>
          Create a new password
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              name={showPassword ? "visibility" : "visibility-off"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon
              name={showConfirmPassword ? "visibility" : "visibility-off"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <View style={styles.backContainer}>
        <Text style={styles.backText}>Back to </Text>
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.backLink}>Login</Text>
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
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
    height: 45,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  iconWrapper: {
    paddingHorizontal: 10,
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
