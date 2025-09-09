import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "@/store/cartStore";
import Toast from "react-native-toast-message";
import {
  API_URL,
  DISCOUNT_TYPE_FIXED,
  DISCOUNT_TYPE_PERCENTAGE,
  PAYMENT_METHOD_BKASH,
} from "@/constants/variables";
import { deepGreenColor, yellowColor } from "@/constants/Colors";
import { PaymentMethod } from "./paymentMethods";
import { clearCartInDatabaseInOrderPlaced } from "@/utils/cartUtils";

interface PlaceOrderButtonProps {
  selectedZoneId: string | null;
  deliveryCharge: number;
  getTotalPrice: () => number;
  appliedDiscount: number;
  discountType: string;
  preferredDeliveryDateTime: Date | null;
  paymentMethods: PaymentMethod[];
  paymentMethodId: string | null;
  addressId: string | null;
  productOrders: {
    variantProductId: string;
    warehouseId: string;
    price: string;
    quantity: string;
  }[];
  userId: string | null;
  couponId: string;
  transactionNo: string;
  transactionPhoneNo: string;
  transactionDate: Date | null;
}

export const PlaceOrderButton = ({
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
  transactionNo,
  transactionPhoneNo,
  transactionDate,
}: PlaceOrderButtonProps) => {
  const { clearCart } = useCartStore();
  const router = useRouter();

  const handlePlaceOrder = async () => {
    if (
      !selectedZoneId ||
      !userId ||
      !paymentMethodId ||
      !addressId ||
      !preferredDeliveryDateTime
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          "Please fill all required fields (Zone, Payment, Address, Delivery Time).",
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
      return;
    }

    // Check if payment method is Bkash and require transactionNo and transactionPhoneNo
    const selectedPaymentMethod = paymentMethods.find(
      (method) => method.id === paymentMethodId
    );
    if (
      selectedPaymentMethod &&
      selectedPaymentMethod.title?.toLowerCase() === PAYMENT_METHOD_BKASH
    ) {
      if (!transactionNo || !transactionPhoneNo) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Bkash payment requires Transaction No and Phone No.",
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });
        return;
      }
    }

    const subtotal = getTotalPrice();
    let discountAmount = 0;
    if (discountType === DISCOUNT_TYPE_PERCENTAGE) {
      discountAmount = (subtotal * appliedDiscount) / 100;
    } else if (discountType === DISCOUNT_TYPE_FIXED) {
      discountAmount = appliedDiscount;
    }
    const afterDiscountTotal =
      subtotal - (discountAmount > subtotal ? subtotal : discountAmount);
    const total = afterDiscountTotal + deliveryCharge;

    const orderData: any = {
      subTotal: Number(subtotal.toFixed(2)),
      discount: Number(discountAmount.toFixed(2)),
      afterDiscountTotal: Number(afterDiscountTotal.toFixed(2)),
      deliveryCharge: Number(deliveryCharge.toFixed(2)),
      deliveryZoneId: selectedZoneId,
      total: Number(total.toFixed(2)),
      paymentStatus: "unpaid",
      orderStatus: "pending",
      preferredDeliveryDateAndTime: preferredDeliveryDateTime.toISOString(),
      paymentMethodId: paymentMethodId,
      addressId: addressId,
      productOrders: productOrders.map((item) => ({
        ...item,
        price: item.price,
        quantity: item.quantity,
      })),
      userId: userId,
    };

    if (couponId) {
      orderData.couponId = couponId;
    }

    // Add transaction details if they exist
    if (transactionNo) orderData.transactionNo = transactionNo;
    if (transactionPhoneNo) orderData.transactionPhoneNo = transactionPhoneNo;
    if (transactionDate)
      orderData.transactionDate = transactionDate.toISOString();

    try {
      const response = await fetch(`${API_URL}/v1/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();

      if (data.success) {
        Toast.show({
          type: "success",
          text1: "Order Placed",
          text2: "Your order has been placed successfully.",
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });

        clearCartInDatabaseInOrderPlaced();
        clearCart();
        router.push("/(tabs)/home");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data.message || "Failed to place order.",
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to place order. Please try again.",
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.placeOrderButton}
      onPress={handlePlaceOrder}
    >
      <Text style={styles.placeOrderText}>Place Order</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  placeOrderButton: {
    backgroundColor: deepGreenColor,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  placeOrderText: {
    color: yellowColor,
    fontSize: 16,
    fontWeight: "bold",
  },
});
