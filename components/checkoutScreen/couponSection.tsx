import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { API_URL } from "@/constants/variables";

interface CouponSectionProps {
  onCouponApplied: (discount: number, discountType: string, id: string) => void;
}

export const CouponSection = ({ onCouponApplied }: CouponSectionProps) => {
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string>("");

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a coupon code.",
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/v1/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponTitle: couponCode }),
      });
      const data = await response.json();

      if (data.success) {
        const { discount, discountType, id } = data.data;
        const discountValue = parseFloat(discount);
        setAppliedDiscount(discountValue);
        setDiscountType(discountType);
        onCouponApplied(discountValue, discountType, id);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Coupon applied successfully!",
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data.message,
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to validate coupon.",
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
    }
  };

  return (
    <View style={styles.couponSection}>
      {!showCouponInput && (
        <TouchableOpacity
          style={styles.haveCouponButton}
          onPress={() => setShowCouponInput(!showCouponInput)}
        >
          <Text style={styles.haveCouponText}>
            {showCouponInput ? "Hide Coupon" : "Have a Coupon?"}
          </Text>
        </TouchableOpacity>
      )}
      {showCouponInput && (
        <View style={styles.couponInputContainer}>
          <TextInput
            style={styles.couponInput}
            value={couponCode}
            onChangeText={setCouponCode}
            placeholder="Enter coupon code"
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyCoupon}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      )}
      {appliedDiscount > 0 && (
        <Text style={styles.discountText}>
          {discountType === "fixed"
            ? `Discount: ৳${appliedDiscount} `
            : `Discount: ${appliedDiscount}% off `}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  couponSection: {
    marginTop: 16,
  },
  haveCouponButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#27ae60",
    borderRadius: 4,
    alignItems: "center",
  },
  haveCouponText: {
    color: "#27ae60",
    fontSize: 16,
  },
  couponInputContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  couponInput: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    fontSize: 16,
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    justifyContent: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  discountText: {
    fontSize: 16,
    color: "#27ae60",
    marginTop: 8,
  },
});
