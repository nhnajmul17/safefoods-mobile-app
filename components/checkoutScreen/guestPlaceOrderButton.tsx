import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useCartStore } from "@/store/cartStore";
import {
  API_URL,
  PAYMENT_METHOD_CASH_ON_DELIVERY,
} from "@/constants/variables";
import { deepGreenColor, yellowColor } from "@/constants/Colors";
import { formatWithThousandSeparator } from "@/utils/helperFunctions";

interface ProductOrder {
  variantProductId: string;
  warehouseId: string;
  price: string;
  quantity: string;
}

interface PaymentMethod {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GuestDetails {
  fullName: string;
  phoneNumber: string;
  email: string;
  flatNo: string;
  floorNo: string;
  addressLine: string;
  deliveryNotes: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface GuestPlaceOrderButtonProps {
  selectedZoneId: string | null;
  deliveryCharge: number;
  getTotalPrice: () => number;
  appliedDiscount: number;
  discountType: string;
  preferredDeliveryDateTime: Date | null;
  paymentMethods: PaymentMethod[];
  paymentMethodId: string | null;
  productOrders: ProductOrder[];
  couponId: string;
  guestDetails: GuestDetails;
  transactionNo: string;
  transactionPhoneNo: string;
  transactionDate: Date | null;
}

export const GuestPlaceOrderButton: React.FC<GuestPlaceOrderButtonProps> = ({
  selectedZoneId,
  deliveryCharge,
  getTotalPrice,
  appliedDiscount,
  discountType,
  preferredDeliveryDateTime,
  paymentMethods,
  paymentMethodId,
  productOrders,
  couponId,
  guestDetails,
  transactionNo,
  transactionPhoneNo,
  transactionDate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { clearCart } = useCartStore();
  const router = useRouter();

  const validateGuestDetails = (): boolean => {
    const requiredFields = [
      { field: guestDetails.fullName, name: "Full Name" },
      { field: guestDetails.phoneNumber, name: "Phone Number" },
      { field: guestDetails.addressLine, name: "Address Line" },
      { field: guestDetails.city, name: "City" },
    ];

    for (const { field, name } of requiredFields) {
      if (!field.trim()) {
        Alert.alert("Missing Information", `Please enter ${name}`);
        return false;
      }
    }

    // Email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(guestDetails.email)) {
    //   Alert.alert("Invalid Email", "Please enter a valid email address");
    //   return false;
    // }

    // Phone validation (basic)
    if (guestDetails.phoneNumber.length < 10) {
      Alert.alert("Invalid Phone", "Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const validateOrder = (): boolean => {
    if (!selectedZoneId) {
      Alert.alert("Missing Information", "Please select a delivery zone");
      return false;
    }

    if (!paymentMethodId) {
      Alert.alert("Missing Information", "Please select a payment method");
      return false;
    }

    if (!preferredDeliveryDateTime) {
      Alert.alert(
        "Missing Information",
        "Please select delivery date and time"
      );
      return false;
    }

    if (productOrders.length === 0) {
      Alert.alert("Empty Cart", "Your cart is empty");
      return false;
    }

    // Check if payment method requires transaction details
    const selectedPaymentMethod = paymentMethods.find(
      (method) => method.id === paymentMethodId
    );

    if (
      selectedPaymentMethod &&
      selectedPaymentMethod.title.toLowerCase() !==
        PAYMENT_METHOD_CASH_ON_DELIVERY
    ) {
      if (!transactionNo.trim()) {
        Alert.alert("Missing Information", "Please enter transaction number");
        return false;
      }
      if (!transactionPhoneNo.trim()) {
        Alert.alert(
          "Missing Information",
          "Please enter transaction phone number"
        );
        return false;
      }
      if (!transactionDate) {
        Alert.alert("Missing Information", "Please select transaction date");
        return false;
      }
    }

    return true;
  };

  const calculateTotals = () => {
    const subTotal = getTotalPrice();
    let discount = 0;

    if (discountType === "percentage") {
      discount = (subTotal * appliedDiscount) / 100;
    } else if (discountType === "fixed") {
      discount = appliedDiscount;
    }

    const afterDiscountTotal = subTotal - discount;
    const total = afterDiscountTotal + deliveryCharge;

    return {
      subTotal,
      discount,
      afterDiscountTotal,
      total,
    };
  };

  const handlePlaceOrder = async () => {
    if (!validateGuestDetails() || !validateOrder()) {
      return;
    }

    setIsLoading(true);

    try {
      const { subTotal, discount, afterDiscountTotal, total } =
        calculateTotals();

      const orderData = {
        // Cart totals
        subTotal,
        discount,
        couponId: couponId || undefined,
        afterDiscountTotal,
        deliveryCharge,
        deliveryZoneId: selectedZoneId,
        total,
        paymentStatus: "unpaid",
        orderStatus: "pending",

        // Guest details
        fullName: guestDetails.fullName,
        phoneNumber: guestDetails.phoneNumber,
        email: guestDetails.email,
        flatNo: guestDetails.flatNo,
        floorNo: guestDetails.floorNo,
        addressLine: guestDetails.addressLine,
        deliveryNotes: guestDetails.deliveryNotes,
        city: guestDetails.city,
        state: guestDetails.state,
        country: guestDetails.country,
        postalCode: guestDetails.postalCode,

        // Order details
        preferredDeliveryDateAndTime: preferredDeliveryDateTime?.toISOString(),
        paymentMethodId,
        productOrders,

        // Transaction details (if not cash on delivery)
        ...(transactionNo && {
          transactionNo,
          transactionPhoneNo,
          transactionDate: transactionDate?.toISOString(),
        }),
      };

      const response = await fetch(`${API_URL}/v1/orders/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Clear cart after successful order
        clearCart();

        Toast.show({
          type: "success",
          text1: "Order Placed Successfully!",
          text2:
            "Your order has been placed. You will receive confirmation shortly.",
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });

        // Navigate to success screen or home
        router.replace("/(tabs)/home");
      } else {
        throw new Error(result.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      Toast.show({
        type: "error",
        text1: "Order Failed",
        text2:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { total } = calculateTotals();

  return (
    <View style={styles.container}>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalAmount}>
          ৳{formatWithThousandSeparator(total)}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.placeOrderButton, isLoading && styles.disabledButton]}
        onPress={handlePlaceOrder}
        disabled={isLoading}
      >
        <Text style={styles.placeOrderButtonText}>
          {isLoading ? "Placing Order..." : "Place Order"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: deepGreenColor,
  },
  placeOrderButton: {
    backgroundColor: deepGreenColor,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  placeOrderButtonText: {
    color: yellowColor,
    fontSize: 18,
    fontWeight: "bold",
  },
});
