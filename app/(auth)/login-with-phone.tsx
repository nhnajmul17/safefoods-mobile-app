import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import Toast from "react-native-toast-message";
import { API_URL } from "@/constants/variables";

const sendOtpAPI = async (phone: string) => {
  const response = await fetch(`${API_URL}/v2/auth/send-mobile-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber: phone }),
  });
  return response.json();
};

const verifyOtpAPI = async (phone: string, otp: string, token: string) => {
  const response = await fetch(`${API_URL}/v2/auth/verify-mobile-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "otp-verification-token": token,
    },
    body: JSON.stringify({ phoneNumber: phone, otp: parseInt(otp) }),
  });
  return response.json();
};

export default function LoginWithPhoneScreen() {
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const router = useRouter();
  const { login } = useAuthStore();

  const refs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleOtpChange = ({
    text,
    index,
  }: {
    text: string;
    index: number;
  }) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus to next input
    if (text && index < 5) {
      refs[index + 1].current?.focus();
    }
    // Move focus to previous input if backspace is pressed and field is empty
    else if (!text && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const handleSendOtp = async () => {
    if (phone) {
      setLoading(true);
      try {
        const response = await sendOtpAPI(phone);
        if (response.success) {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: response.message || "OTP sent to your phone",
            text2Style: { fontSize: 12, fontWeight: "bold" },
          });
          setToken(response.token);
          setShowOtp(true);
          setTimer(60); // Start 60-second timer
          setOtp(["", "", "", "", "", ""]); // Reset OTP fields
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: response.message || "Failed to send OTP. Please try again.",
            text2Style: { fontSize: 12, fontWeight: "bold" },
          });
        }
      } catch (error) {
        // console.log("Send OTP error:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to send OTP. Please try again.",
          text2Style: { fontSize: 12, fontWeight: "bold" },
        });
      } finally {
        setLoading(false);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a phone number",
        text2Style: { fontSize: 12, fontWeight: "bold" },
      });
    }
  };

  const handleResendOtp = () => {
    setTimer(60); // Reset timer to 60 seconds
    setOtp(["", "", "", "", "", ""]); // Reset OTP fields
    handleSendOtp(); // Reuse handleSendOtp to resend
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length === 6 && /^\d+$/.test(otpString)) {
      setLoading(true);
      try {
        const response = await verifyOtpAPI(phone, otpString, token);
        if (response.success) {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Login successful",
            text2Style: { fontSize: 12, fontWeight: "bold" },
          });
          login(
            response.data.id,
            response.data.phoneNumber, // userName
            response.data.phoneNumber, //email or phoneNumber
            response.accessToken
          );
          router.replace("/(tabs)/home");
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: response.message || "Invalid OTP. Please try again.",
            text2Style: { fontSize: 12, fontWeight: "bold" },
          });
        }
      } catch (error) {
        // console.log("Verify OTP error:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to verify OTP. Please try again.",
          text2Style: { fontSize: 12, fontWeight: "bold" },
        });
      } finally {
        setLoading(false);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a valid 6-digit OTP",
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
          Welcome Back to <Text style={{ color: "#4f998e" }}>Safe Food</Text>
        </Text>
        <Text style={{ fontSize: 20, color: "#999", textAlign: "center" }}>
          Sign in with your phone
        </Text>
      </View>
      <Text style={styles.title}>Sign in with Phone</Text>

      {!showOtp && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="01234567890"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>
      )}

      {showOtp && (
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={refs[index]}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOtpChange({ text, index })}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              editable={!loading}
            />
          ))}
        </View>
      )}

      {!showOtp ? (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleSendOtp}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Sending..." : "Get OTP"}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleVerifyOtp}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Text>
        </TouchableOpacity>
      )}

      {showOtp && (
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Didn't receive the code?{" "}
            {timer > 0 ? (
              <Text style={styles.timerText}>Resend in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResendOtp}>
                <Text style={styles.resendLink}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </Text>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 20,
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
        <Text style={{ marginHorizontal: 12, fontSize: 16, color: "#999" }}>
          Or
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
      </View>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Sign in with </Text>
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.signupLink}>Email & Password</Text>
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "#fff",
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
    fontSize: 16,
    color: "#000",
  },
  signupLink: {
    fontSize: 16,
    color: "#4f998e",
    fontWeight: "bold",
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  resendText: {
    fontSize: 14,
    color: "#000",
  },
  timerText: {
    color: "#999",
  },
  resendLink: {
    fontSize: 14,
    color: "#4f998e",
    fontWeight: "bold",
  },
});
