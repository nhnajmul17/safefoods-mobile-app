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

export default function CheckoutScreen() {
  const { cartItems, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();

  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "",
    streetAddress: "",
    apartment: "",
    townCity: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setBillingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    console.log("Order placed with details:", {
      ...billingDetails,
      cartItems,
      total: getTotalPrice(),
    });

    Toast.show({
      type: "success",
      text1: "Order Placed",
      text2: `Your order has been placed successfully.`,
      text1Style: { fontSize: 16, fontWeight: "bold" },
      text2Style: { fontSize: 14, fontWeight: "bold" },
    });
    clearCart(); // Clear the cart after placing the order
    router.push("/(tabs)/(home)");
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderItemText}>
        {item.name} x{item.quantity}
      </Text>
      <Text style={styles.orderItemPrice}>${item.price * item.quantity}</Text>
    </View>
  );

  const renderSection = ({ item }: { item: any }) => {
    switch (item.type) {
      case "billing":
        return (
          <View style={styles.billingSection}>
            <Text style={styles.sectionTitle}>Billing Details</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name*"
              value={billingDetails.firstName}
              onChangeText={(text) => handleInputChange("firstName", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name*"
              value={billingDetails.lastName}
              onChangeText={(text) => handleInputChange("lastName", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Company Name (Optional)"
              value={billingDetails.companyName}
              onChangeText={(text) => handleInputChange("companyName", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Country / Region*"
              value={billingDetails.country}
              onChangeText={(text) => handleInputChange("country", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Street Address*"
              value={billingDetails.streetAddress}
              onChangeText={(text) => handleInputChange("streetAddress", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Apartment, suite, unit, etc. (optional)"
              value={billingDetails.apartment}
              onChangeText={(text) => handleInputChange("apartment", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Town / City*"
              value={billingDetails.townCity}
              onChangeText={(text) => handleInputChange("townCity", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="State*"
              value={billingDetails.state}
              onChangeText={(text) => handleInputChange("state", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="ZIP Code*"
              value={billingDetails.zipCode}
              onChangeText={(text) => handleInputChange("zipCode", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone*"
              value={billingDetails.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address*"
              value={billingDetails.email}
              onChangeText={(text) => handleInputChange("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.checkboxContainer}>
              <View style={styles.checkbox} />
              <Text style={styles.checkboxText}>Create an account?</Text>
            </TouchableOpacity>
          </View>
        );
      case "order":
        return (
          <View style={styles.orderSection}>
            <Text style={styles.sectionTitle}>Your Order</Text>
            <FlatList
              data={cartItems}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.id}
              ListFooterComponent={
                <>
                  <View style={styles.orderSummary}>
                    <Text style={styles.summaryText}>Subtotal</Text>
                    <Text style={styles.summaryPrice}>
                      ${getTotalPrice().toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.orderSummary}>
                    <Text style={styles.summaryText}>Shipping</Text>
                    <Text style={styles.summaryPrice}>$5.00</Text>
                  </View>
                  <TouchableOpacity style={styles.couponButton}>
                    <Text style={styles.couponText}>Have a coupon?</Text>
                  </TouchableOpacity>
                  <View style={styles.orderSummary}>
                    <Text style={styles.totalText}>Total</Text>
                    <Text style={styles.totalPrice}>
                      ${(getTotalPrice() + 5).toFixed(2)}
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
              <TouchableOpacity style={styles.checkboxContainer}>
                <View style={styles.checkbox} />
                <Text style={styles.checkboxText}>
                  Save my information for faster checkout
                </Text>
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
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderSection}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.content}
      />
    </SafeAreaView>
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#27ae60",
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxText: {
    fontSize: 14,
    color: "#666",
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
  couponButton: {
    paddingVertical: 8,
  },
  couponText: {
    fontSize: 14,
    color: "#27ae60",
    textDecorationLine: "underline",
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
