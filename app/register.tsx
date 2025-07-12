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

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const handleRegister = () => {
    if (username && password && confirmPassword) {
      login(username);
      router.replace("/(tabs)/home");
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter username and password and confirm password",
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
          Welcome Back to <Text style={{ color: "#4f998e" }}>Safe Foods</Text>
        </Text>
        <Text style={{ fontSize: 20, color: "#999", textAlign: "center" }}>
          Register your account with valid info
        </Text>
      </View>
      <Text style={styles.title}>Sign up</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="johncharles@example.com"
          value={username}
          onChangeText={setUsername}
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

      <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
        <Text style={styles.loginButtonText}>Sign up</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.signupLink}>Sign in</Text>
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
