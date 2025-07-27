import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import ProtectedRoute from "@/components/auth/protectedRoute";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { DeliveryZoneSection } from "@/components/checkoutScreen/deliveryZoneSection";
import { CouponSection } from "@/components/checkoutScreen/couponSection";
import { OrderSummarySection } from "@/components/checkoutScreen/orderSummary";
import { PaymentMethodSection } from "@/components/checkoutScreen/paymentMethods";
import { PlaceOrderButton } from "@/components/checkoutScreen/placeOrderButton";
import { API_URL } from "@/constants/variables";
import { DeliveryAddressSection } from "@/components/checkoutScreen/deliveryAddress";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface CartItem {
  id: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  quantity: number;
}

export interface DeliveryZone {
  id: string;
  areaName: string;
  description: string;
  deliveryCharge: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
}

interface ProductOrder {
  variantProductId: string;
  warehouseId: string;
  price: string;
  quantity: string;
}

interface PaymentMethod {
  id: string;
  name: string;
}

interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
}

export default function CheckoutScreen() {
  const { cartItems, getTotalPrice } = useCartStore();
  const { userId } = useAuthStore();

  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string>("");
  const [couponId, setCouponId] = useState<string | null>(null);

  const [preferredDeliveryDateTime, setPreferredDeliveryDateTime] =
    useState<Date | null>(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchDeliveryZones = async () => {
      try {
        const response = await fetch(`${API_URL}/v1/delivery-zones`);
        const data = await response.json();
        if (data.success) {
          setDeliveryZones(data.data);
          if (data.data.length > 0) {
            setSelectedZoneId(data.data[0].id);
            setDeliveryCharge(data.data[0].deliveryCharge);
          }
        }
      } catch (error) {
        console.error("Error fetching delivery zones:", error);
      }
    };

    const fetchPaymentMethodsAndAddresses = async () => {
      try {
        const dummyPaymentMethods: PaymentMethod[] = [
          { id: "776a855a-70c1-4fa4-8376-bae8cf3c1ad7", name: "Credit Card" },
          { id: "a1b2c3d4-e5f6-4758-9a0b-c1d2e3f4g5h6", name: "PayPal" },
          {
            id: "b2c3d4e5-f6g7-4819-8a0b-c2d3e4f5g6h7",
            name: "Direct Bank Transfer",
          },
        ];
        const dummyAddresses: Address[] = [
          {
            id: "2d1eebd1-334c-4721-88e0-52fbb878932d",
            fullName: "John Doe",
            addressLine1: "123 Main St, Dhaka",
          },
          {
            id: "3e2ff2d2-445d-4832-89f1-63caa979b43e",
            fullName: "Jane Smith",
            addressLine1: "456 Elm St, Chittagong",
          },
        ];
        setPaymentMethods(dummyPaymentMethods);
        setSelectedPaymentMethodId(dummyPaymentMethods[0].id);
        setAddresses(dummyAddresses);
        setSelectedAddressId(dummyAddresses[0].id);
      } catch (error) {
        console.error("Error fetching payment methods and addresses:", error);
      }
    };

    fetchDeliveryZones();
    fetchPaymentMethodsAndAddresses();
  }, []);

  const handleZoneSelection = (zoneId: string) => {
    const zone = deliveryZones.find((z) => z.id === zoneId);
    if (zone) {
      setSelectedZoneId(zone.id);
      setDeliveryCharge(zone.deliveryCharge);
    }
  };

  const handleCouponApplied = (
    discount: number,
    discountType: string,
    id: string
  ) => {
    setAppliedDiscount(discount);
    setDiscountType(discountType);
    setCouponId(id);
  };

  const mapCartToProductOrders = (): ProductOrder[] => {
    return cartItems.map((item) => ({
      variantProductId: item.variantId,
      warehouseId: "257b861a-50e6-4b79-a5fd-ae87ddefc88b", // Placeholder
      price: item.price.toFixed(2),
      quantity: item.quantity.toFixed(2),
    }));
  };

  const handleConfirm = (date: Date) => {
    setPreferredDeliveryDateTime(date);
    setDatePickerVisibility(false);
  };

  const data = [
    { type: "delivery", key: "delivery" },
    { type: "deliveryAddress", key: "deliveryAddress" },
    { type: "order", key: "order" },
    { type: "coupon", key: "coupon" },
    { type: "payment", key: "payment" },
    { type: "placeOrder", key: "placeOrder" },
  ];

  const renderSection = ({ item }: { item: { type: string; key: string } }) => {
    switch (item.type) {
      case "delivery":
        return (
          <DeliveryZoneSection
            deliveryZones={deliveryZones}
            selectedZoneId={selectedZoneId}
            deliveryCharge={deliveryCharge}
            onZoneSelection={handleZoneSelection}
          />
        );
      case "deliveryAddress":
        return (
          <DeliveryAddressSection
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onAddressSelect={setSelectedAddressId}
          />
        );
      case "order":
        return (
          <OrderSummarySection
            cartItems={cartItems}
            getTotalPrice={getTotalPrice}
            deliveryCharge={deliveryCharge}
            appliedDiscount={appliedDiscount}
            discountType={discountType}
          />
        );
      case "coupon":
        return <CouponSection onCouponApplied={handleCouponApplied} />;
      case "payment":
        return (
          <PaymentMethodSection
            paymentMethods={paymentMethods}
            selectedPaymentMethodId={selectedPaymentMethodId}
            onPaymentMethodSelect={setSelectedPaymentMethodId}
          />
        );
      case "placeOrder":
        return (
          <PlaceOrderButton
            selectedZoneId={selectedZoneId}
            deliveryCharge={deliveryCharge}
            getTotalPrice={getTotalPrice}
            appliedDiscount={appliedDiscount}
            discountType={discountType}
            preferredDeliveryDateTime={preferredDeliveryDateTime}
            paymentMethodId={selectedPaymentMethodId}
            addressId={selectedAddressId}
            productOrders={mapCartToProductOrders()}
            userId={userId}
            couponId={couponId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <SafeAreaView style={styles.container}>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisibility(false)}
          minimumDate={new Date()}
        />

        <FlatList
          data={data}
          renderItem={renderSection}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <View style={styles.datePickerHeader}>
              <Text style={styles.datePickerTitle}>
                Preferred Delivery Date & Time
              </Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setDatePickerVisibility(true)}
              >
                <Text style={styles.datePickerText}>
                  {preferredDeliveryDateTime
                    ? preferredDeliveryDateTime.toLocaleString()
                    : "Select Delivery Date & Time"}
                </Text>
              </TouchableOpacity>
            </View>
          }
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
  datePickerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  datePickerHeader: {
    marginBottom: 16,
  },
  datePickerButton: {
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  datePickerText: {
    fontSize: 16,
    color: "#333",
  },
});
