import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/constants/variables";

const verifyOtpAPI = async (email: string, token: string, code: string) => {
  const response = await fetch(`${API_URL}/v2/auth/email-verification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      email_verification_token: token,
    },
    body: JSON.stringify({ email, otp: parseInt(code) }),
  });
  return response.json();
};

export default function RegisterOTPVerificationScreen() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const router = useRouter();
  const { registerEmail, registerToken, setOtpCode, logout } = useAuthStore(); // Access authStore state and setter

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  interface HandleOtpChangeParams {
    text: string;
    index: number;
  }

  const handleOtpChange = ({ text, index }: HandleOtpChangeParams) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus to next input
    if (text && index < 5) {
      (refs[index + 1].current as TextInput | null)?.focus();
    }
  };

  const handleResend = () => {
    setTimer(60);
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "New OTP sent to your email",
      text2Style: { fontSize: 12, fontWeight: "bold" },
    });
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length === 6 && /^\d+$/.test(otpString)) {
      if (!registerEmail || !registerToken) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Missing email or token. Please try again.",
          text2Style: { fontSize: 12, fontWeight: "bold" },
        });
        return;
      }

      try {
        setOtpCode(otpString); // Store the OTP code in authStore
        const response = await verifyOtpAPI(
          registerEmail,
          registerToken,
          otpString
        );
        if (response.success) {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "OTP verified successfully",
            text2Style: { fontSize: 12, fontWeight: "bold" },
          });
          logout(); // Clear authStore state after successful verification
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
          text2: "Failed to verify OTP. Please try again.",
          text2Style: { fontSize: 12, fontWeight: "bold" },
        });
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

  const refs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

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
          OTP Verification
        </Text>
        <Text style={{ fontSize: 20, color: "#999", textAlign: "center" }}>
          Enter the 6-digit code sent to your email
        </Text>
      </View>

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
          />
        ))}
      </View>

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          Didn't receive the code?{" "}
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </Text>
      </View>

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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
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
  verifyButton: {
    backgroundColor: "#55796d",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
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
