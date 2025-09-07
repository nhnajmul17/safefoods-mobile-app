import {
  DISCOUNT_TYPE_FIXED,
  DISCOUNT_TYPE_PERCENTAGE,
} from "@/constants/variables";
import { formatWithThousandSeparator } from "@/utils/helperFunctions";
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

interface CartItem {
  id: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  quantity: number;
}

interface OrderSummarySectionProps {
  cartItems: CartItem[];
  getTotalPrice: () => number;
  deliveryCharge: number;
  appliedDiscount: number;
  discountType: string;
}

export const OrderSummarySection = ({
  cartItems,
  getTotalPrice,
  deliveryCharge,
  appliedDiscount,
  discountType,
}: OrderSummarySectionProps) => {
  const subtotal = getTotalPrice();
  let discountAmount = 0;
  if (discountType === DISCOUNT_TYPE_PERCENTAGE) {
    discountAmount = (subtotal * appliedDiscount) / 100;
  } else if (discountType === DISCOUNT_TYPE_FIXED) {
    discountAmount = appliedDiscount;
  }

  const calculateDiscountedTotal = () => {
    return (
      subtotal +
      deliveryCharge -
      (discountAmount > subtotal ? subtotal : discountAmount)
    );
  };

  const renderOrderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderItemText}>
        {item.name} ({item.unit}) x{item.quantity}
      </Text>
      <Text style={styles.orderItemPrice}>
        ৳ {formatWithThousandSeparator(item.price * item.quantity)}
      </Text>
    </View>
  );

  return (
    <View style={styles.orderSection}>
      <Text style={styles.sectionTitle}>Your Order</Text>
      <FlatList
        data={cartItems}
        renderItem={renderOrderItem}
        keyExtractor={(item) => `${item.id}-${item.variantId}`}
        ListFooterComponent={
          <>
            <View style={styles.orderSummary}>
              <Text style={styles.summaryText}>Subtotal</Text>
              <Text style={styles.summaryPrice}>
                ৳ {formatWithThousandSeparator(getTotalPrice())}
              </Text>
            </View>
            <View style={styles.orderSummary}>
              <Text style={styles.summaryText}>Delivery Charge</Text>
              <Text style={styles.summaryPrice}>
                ৳ {formatWithThousandSeparator(deliveryCharge)}
              </Text>
            </View>
            {appliedDiscount > 0 && (
              <View style={styles.orderSummary}>
                <Text style={styles.summaryText}>Discount</Text>
                <Text style={styles.summaryPrice}>
                  -৳ {formatWithThousandSeparator(discountAmount)}
                </Text>
              </View>
            )}
            <View style={styles.orderSummary}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalPrice}>
                ৳ {formatWithThousandSeparator(calculateDiscountedTotal())}
              </Text>
            </View>
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  orderSection: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  orderItemText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 16,
    color: "#333",
  },
  orderSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  summaryText: {
    fontSize: 16,
    color: "#666",
  },
  summaryPrice: {
    fontSize: 16,
    color: "#333",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
