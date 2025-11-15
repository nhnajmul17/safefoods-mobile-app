import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useCartStore } from "@/store/cartStore";
import {
  API_URL,
  DISCOUNT_TYPE_FIXED,
  DISCOUNT_TYPE_PERCENTAGE,
  PAYMENT_METHOD_BKASH,
  PAYMENT_METHOD_CASH_ON_DELIVERY,
} from "@/constants/variables";
import { deepGreenColor, yellowColor } from "@/constants/Colors";
import { formatWithThousandSeparator } from "@/utils/helperFunctions";
import { clearCartInDatabaseInOrderPlaced } from "@/utils/cartUtils";
import { saveGuestOrder } from "@/utils/guestOrderStorage";
import { OTPVerificationModal } from "@/components/checkoutScreen/OTPVerificationModal";

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

interface UnifiedPlaceOrderButtonProps {
  isGuest: boolean;
  selectedZoneId: string | null;
  deliveryCharge: number;
  getTotalPrice: () => number;
  appliedDiscount: number;
  discountType: string;
  preferredDeliveryDateTime: Date | null;
  paymentMethods: PaymentMethod[];
  paymentMethodId: string | null;
  addressId?: string | null; // Only for authenticated users
  productOrders: ProductOrder[];
  userId?: string | null; // Only for authenticated users
  couponId: string;
  guestDetails?: GuestDetails; // Only for guest users
  transactionNo: string;
  transactionPhoneNo: string;
  transactionDate: Date | null;
  createAccount?: boolean; // For guest account creation
  onAccountCreated?: (
    userId: string,
    accessToken: string,
    refreshToken: string
  ) => void;
}

export const UnifiedPlaceOrderButton: React.FC<
  UnifiedPlaceOrderButtonProps
> = ({
  isGuest,
  selectedZoneId,
  deliveryCharge,
  getTotalPrice,
  appliedDiscount,
  discountType,
  preferredDeliveryDateTime,
  paymentMethods,
  paymentMethodId,
  addressId,
  productOrders,
  userId,
  couponId,
  guestDetails,
  transactionNo,
  transactionPhoneNo,
  transactionDate,
  createAccount = false,
  onAccountCreated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { clearCart, cartItems } = useCartStore();
  const router = useRouter();

  // OTP verification state
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
  const [createdAddressId, setCreatedAddressId] = useState<string | null>(null);

  const sendOTP = async (): Promise<boolean> => {
    if (!guestDetails?.phoneNumber) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a phone number",
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/v2/auth/send-mobile-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: guestDetails.phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpToken(data.token);
        setShowOTPModal(true);
        return true;
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data.message || "Failed to send OTP",
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });
        return false;
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to send OTP. Please try again.",
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
      return false;
    }
  };

  const createUserAddress = async (userId: string): Promise<string | null> => {
    if (!guestDetails) return null;

    try {
      const addressData = {
        userId: userId,
        addressLine: guestDetails.addressLine,
        name: guestDetails.fullName,
        phoneNo: guestDetails.phoneNumber,
        city: guestDetails.city,
      };

      const response = await fetch(`${API_URL}/v1/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });

      const data = await response.json();

      if (data.success) {
        return data.data.id;
      } else {
        console.error("Failed to create address:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Address creation error:", error);
      return null;
    }
  };

  const handleOTPVerifySuccess = async (verifyResponse: any) => {
    try {
      const userId = verifyResponse.data.id;
      const accessToken = verifyResponse.accessToken;
      const refreshToken = verifyResponse.refreshToken;

      // Create address for the new user
      const addressId = await createUserAddress(userId);

      if (addressId) {
        setCreatedUserId(userId);
        setCreatedAddressId(addressId);
        setShowOTPModal(false);

        // Notify parent component
        if (onAccountCreated) {
          onAccountCreated(userId, accessToken, refreshToken);
        }

        // Now place the order as an authenticated user
        await placeOrderAsAuthenticatedUser(userId, addressId);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2:
            "Account created but failed to save address. Please try again.",
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });
        setShowOTPModal(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Account creation error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create account. Please try again.",
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
      setShowOTPModal(false);
      setIsLoading(false);
    }
  };

  const validateGuestDetails = (): boolean => {
    if (!isGuest || !guestDetails) return true;

    const requiredFields = [
      { field: guestDetails.fullName, name: "Full Name" },
      { field: guestDetails.phoneNumber, name: "Phone Number" },
      { field: guestDetails.addressLine, name: "Address Line" },
      { field: guestDetails.city, name: "City" },
    ];

    for (const { field, name } of requiredFields) {
      if (!field.trim()) {
        Toast.show({
          type: "error",
          text1: "Missing Information",
          text2: `Please enter ${name}`,
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });
        return false;
      }
    }

    // Phone validation (basic)
    if (guestDetails.phoneNumber.length < 10) {
      Toast.show({
        type: "error",
        text1: "Invalid Phone",
        text2: "Please enter a valid phone number",
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
      return false;
    }

    return true;
  };

  const validateAuthenticatedUser = (): boolean => {
    if (isGuest) return true;

    if (!userId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "User authentication required.",
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
      return false;
    }

    if (!addressId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select a delivery address.",
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
      return false;
    }

    return true;
  };

  const validateCommonFields = (): boolean => {
    if (!selectedZoneId) {
      const message = "Please select a delivery zone";
      if (isGuest) {
        Alert.alert("Missing Information", message);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: message,
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });
      }
      return false;
    }

    if (!paymentMethodId) {
      const message = "Please select a payment method";
      if (isGuest) {
        Alert.alert("Missing Information", message);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: message,
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });
      }
      return false;
    }

    if (!preferredDeliveryDateTime) {
      const message = "Please select delivery date and time";
      if (isGuest) {
        Alert.alert("Missing Information", message);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: message,
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });
      }
      return false;
    }

    if (productOrders.length === 0) {
      const message = "Your cart is empty";
      if (isGuest) {
        Alert.alert("Empty Cart", message);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: message,
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });
      }
      return false;
    }

    return true;
  };

  const validateTransactionDetails = (): boolean => {
    const selectedPaymentMethod = paymentMethods.find(
      (method) => method.id === paymentMethodId
    );

    if (!selectedPaymentMethod) return true;

    const isCashOnDelivery =
      selectedPaymentMethod.title.toLowerCase() ===
      PAYMENT_METHOD_CASH_ON_DELIVERY;
    const isBkash =
      selectedPaymentMethod.title.toLowerCase() === PAYMENT_METHOD_BKASH;
    const requiresTransaction = !isCashOnDelivery;

    if (requiresTransaction) {
      if (!transactionNo.trim()) {
        const message = "Please enter transaction number";
        if (isGuest) {
          Alert.alert("Missing Information", message);
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: message,
            text1Style: { fontSize: 16, fontWeight: "bold" },
            text2Style: { fontSize: 14, fontWeight: "bold" },
          });
        }
        return false;
      }

      if (!transactionPhoneNo.trim()) {
        const message = "Please enter transaction phone number";
        if (isGuest) {
          Alert.alert("Missing Information", message);
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: message,
            text1Style: { fontSize: 16, fontWeight: "bold" },
            text2Style: { fontSize: 14, fontWeight: "bold" },
          });
        }
        return false;
      }

      if (!transactionDate) {
        const message = "Please select transaction date";
        if (isGuest) {
          Alert.alert("Missing Information", message);
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: message,
            text1Style: { fontSize: 16, fontWeight: "bold" },
            text2Style: { fontSize: 14, fontWeight: "bold" },
          });
        }
        return false;
      }

      // Additional validation for Bkash
      if (isBkash && (!transactionNo || !transactionPhoneNo)) {
        const message = "Bkash payment requires Transaction No and Phone No.";
        if (isGuest) {
          Alert.alert("Error", message);
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: message,
            text1Style: { fontSize: 16, fontWeight: "bold" },
            text2Style: { fontSize: 14, fontWeight: "bold" },
          });
        }
        return false;
      }
    }

    return true;
  };

  const calculateTotals = () => {
    const subtotal = getTotalPrice();
    let discountAmount = 0;

    if (
      discountType === DISCOUNT_TYPE_PERCENTAGE ||
      discountType === "percentage"
    ) {
      discountAmount = (subtotal * appliedDiscount) / 100;
    } else if (
      discountType === DISCOUNT_TYPE_FIXED ||
      discountType === "fixed"
    ) {
      discountAmount = appliedDiscount;
    }

    const afterDiscountTotal =
      subtotal - (discountAmount > subtotal ? subtotal : discountAmount);
    const total = afterDiscountTotal + deliveryCharge;

    return {
      subTotal: Number(subtotal.toFixed(2)),
      discount: Number(discountAmount.toFixed(2)),
      afterDiscountTotal: Number(afterDiscountTotal.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  };

  const buildOrderData = () => {
    const { subTotal, discount, afterDiscountTotal, total } = calculateTotals();

    const baseOrderData = {
      subTotal,
      discount,
      afterDiscountTotal,
      deliveryCharge: Number(deliveryCharge.toFixed(2)),
      deliveryZoneId: selectedZoneId,
      total,
      paymentStatus: "unpaid",
      orderStatus: "pending",
      preferredDeliveryDateAndTime: preferredDeliveryDateTime?.toISOString(),
      paymentMethodId,
      productOrders: productOrders.map((item) => ({
        ...item,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    // Add coupon if exists
    if (couponId) {
      (baseOrderData as any).couponId = couponId;
    }

    // Add transaction details if they exist
    if (transactionNo) (baseOrderData as any).transactionNo = transactionNo;
    if (transactionPhoneNo)
      (baseOrderData as any).transactionPhoneNo = transactionPhoneNo;
    if (transactionDate)
      (baseOrderData as any).transactionDate = transactionDate.toISOString();

    if (isGuest && guestDetails) {
      // Guest order data
      return {
        ...baseOrderData,
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
      };
    } else {
      // Authenticated user order data
      return {
        ...baseOrderData,
        userId,
        addressId,
      };
    }
  };

  const placeOrderAsAuthenticatedUser = async (
    userIdToUse: string,
    addressIdToUse: string
  ) => {
    try {
      const orderData = {
        ...buildOrderData(),
        userId: userIdToUse,
        addressId: addressIdToUse,
      };

      // Remove guest-specific fields
      delete (orderData as any).fullName;
      delete (orderData as any).phoneNumber;
      delete (orderData as any).email;
      delete (orderData as any).flatNo;
      delete (orderData as any).floorNo;
      delete (orderData as any).addressLine;
      delete (orderData as any).deliveryNotes;
      delete (orderData as any).city;
      delete (orderData as any).state;
      delete (orderData as any).country;
      delete (orderData as any).postalCode;

      const response = await fetch(`${API_URL}/v1/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        // Clear cart from database for authenticated users
        clearCartInDatabaseInOrderPlaced();

        // Clear cart after successful order
        clearCart();

        Toast.show({
          type: "success",
          text1: "Order Placed Successfully!",
          text2: "Your account has been created and order placed successfully.",
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });

        router.push("/my-orders");
      } else {
        throw new Error(data.message || "Failed to place order");
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

  const handlePlaceOrder = async () => {
    // Validate based on user type
    if (!validateCommonFields()) return;
    if (!validateGuestDetails()) return;
    if (!validateAuthenticatedUser()) return;
    if (!validateTransactionDetails()) return;

    setIsLoading(true);

    // If guest wants to create account, start OTP flow
    if (isGuest && createAccount) {
      const otpSent = await sendOTP();
      if (!otpSent) {
        setIsLoading(false);
      }
      // OTP modal will handle the rest of the flow
      return;
    }

    // Regular order placement flow
    try {
      const orderData = buildOrderData();
      const endpoint = isGuest
        ? `${API_URL}/v1/orders/guest`
        : `${API_URL}/v1/orders`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        // Save guest order to local storage if it's a guest order
        if (isGuest) {
          await saveGuestOrder(data, cartItems, paymentMethods);
        } else {
          // Clear cart from database for authenticated users
          clearCartInDatabaseInOrderPlaced();
        }

        // Clear cart after successful order
        clearCart();

        Toast.show({
          type: "success",
          text1: "Order Placed Successfully!",
          text2: isGuest
            ? "Your order has been saved and you can view it in My Orders."
            : "Your order has been placed successfully.",
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });

        router.push("/my-orders");
      } else {
        throw new Error(data.message || "Failed to place order");
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
        <Text style={styles.placeOrderText}>
          {isLoading ? "Placing Order..." : "Place Order"}
        </Text>
      </TouchableOpacity>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        visible={showOTPModal}
        phoneNumber={guestDetails?.phoneNumber || ""}
        token={otpToken}
        onClose={() => {
          setShowOTPModal(false);
          setIsLoading(false);
        }}
        onVerifySuccess={handleOTPVerifySuccess}
      />
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
  placeOrderText: {
    color: yellowColor,
    fontSize: 18,
    fontWeight: "bold",
  },
});
