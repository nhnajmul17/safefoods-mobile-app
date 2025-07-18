import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";
import ProtectedRoute from "@/components/auth/protectedRoute";

interface CartItem {
  id: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  quantity: number;
}

export default function CheckoutScreen() {
  const { cartItems, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();

  const handlePlaceOrder = () => {
    // Basic validation for required fields

    console.log("Order placed with details:", {
      cartItems,
      total: getTotalPrice(),
    });

    Toast.show({
      type: "success",
      text1: "Order Placed",
      text2: "Your order has been placed successfully.",
      text1Style: { fontSize: 16, fontWeight: "bold" },
      text2Style: { fontSize: 14, fontWeight: "bold" },
    });
    clearCart();
    router.push("/(tabs)/home");
  };

  const renderOrderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderItemText}>
        {item.name} ({item.unit}) x{item.quantity}
      </Text>
      <Text style={styles.orderItemPrice}>
        ৳{(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  const renderSection = ({ item }: { item: { type: string; key: string } }) => {
    switch (item.type) {
      case "order":
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
                      ৳{getTotalPrice().toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.orderSummary}>
                    <Text style={styles.summaryText}>Shipping</Text>
                    <Text style={styles.summaryPrice}>৳0.00</Text>
                  </View>
                  <View style={styles.orderSummary}>
                    <Text style={styles.totalText}>Total</Text>
                    <Text style={styles.totalPrice}>
                      ৳{getTotalPrice().toFixed(2)}
                    </Text>
                  </View>
                </>
              }
            />
            <View style={styles.paymentMethods}>
              <Text style={styles.paymentTitle}>Payment Method</Text>
              <TouchableOpacity style={styles.paymentOption}>
                <View style={[styles.radio, styles.radioSelected]} />
                <Text style={styles.paymentText}>Credit Card</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.paymentOption}>
                <View style={styles.radio} />
                <Text style={styles.paymentText}>PayPal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.paymentOption}>
                <View style={styles.radio} />
                <Text style={styles.paymentText}>Direct Bank Transfer</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.placeOrderButton}
              onPress={handlePlaceOrder}
            >
              <Text style={styles.placeOrderText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  const data = [
    { type: "billing", key: "billing" },
    { type: "order", key: "order" },
  ];

  return (
    <ProtectedRoute>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderSection}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.content}
        />
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  billingSection: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
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
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
    fontSize: 16,
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
  paymentMethods: {
    marginTop: 16,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radio: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 8,
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: "#27ae60",
    borderColor: "#27ae60",
  },
  paymentText: {
    fontSize: 14,
    color: "#333",
  },
  placeOrderButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
