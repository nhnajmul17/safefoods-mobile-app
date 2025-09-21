import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { deepGreenColor, yellowColor } from "@/constants/Colors";
import { API_URL } from "@/constants/variables";

interface OTPVerificationModalProps {
  visible: boolean;
  phoneNumber: string;
  onClose: () => void;
  onVerifySuccess: (response: any) => void;
  token: string;
}

export const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  visible,
  phoneNumber,
  onClose,
  onVerifySuccess,
  token,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const otpRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus to next input
    if (text && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6 || !/^\d+$/.test(otpString)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a valid 6-digit OTP",
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/v2/auth/verify-mobile-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "otp-verification-token": token,
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          otp: parseInt(otpString),
        }),
      });

      const data = await response.json();

      if (data.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "OTP verified successfully",
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });
        onVerifySuccess(data);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data.message || "Invalid OTP. Please try again.",
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to verify OTP. Please try again.",
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOtp(["", "", "", "", "", ""]);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Verify OTP</Text>
          <Text style={styles.modalSubtitle}>
            Enter the 6-digit code sent to {phoneNumber}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={otpRefs[index]}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.verifyButton]}
              onPress={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={yellowColor} size="small" />
              ) : (
                <Text style={styles.verifyButtonText}>Verify</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: deepGreenColor,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 2,
    borderColor: deepGreenColor,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  verifyButton: {
    backgroundColor: deepGreenColor,
  },
  verifyButtonText: {
    color: yellowColor,
    fontSize: 16,
    fontWeight: "600",
  },
});