import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import { API_URL } from "@/constants/variables";

const loginAPI = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (email && password) {
      try {
        const response = await loginAPI(email, password);
        if (response.success) {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Login successful",
            text2Style: { fontSize: 12, fontWeight: "bold" },
          });
          login(
            response.data.id,
            response.data.email, // userName
            response.data.email,
            response.data.accessToken
          );
          router.replace("/(tabs)/home");
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
        console.log("Login error:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to login. Please try again.",
          text2Style: { fontSize: 12, fontWeight: "bold" },
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter email and password",
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
            // color: "#4f998e",
          }}
        >
          Welcome Back to <Text style={{ color: "#4f998e" }}>Safe Foods</Text>
        </Text>
        <Text style={{ fontSize: 20, color: "#999", textAlign: "center" }}>
          Sign in with your credentials
        </Text>
      </View>
      <Text style={styles.title}>Sign in</Text>

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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
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

      <TouchableOpacity onPress={() => router.replace("/forgot-password")}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Sign in</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.replace("/register")}>
          <Text style={styles.signupLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "left",
    color: "#4f998e",
  },
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
  forgotText: {
    color: "#333",
    textAlign: "right",
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: "#55796d",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#000",
  },
  signupLink: {
    fontSize: 14,
    color: "#4f998e",
    fontWeight: "bold",
  },
});
