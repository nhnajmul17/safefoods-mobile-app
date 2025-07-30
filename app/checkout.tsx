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

export interface PaymentMethod {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  flatNo: string;
  floorNo: string;
  addressLine: string;
  name: string;
  phoneNo: string;
  deliveryNotes: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  createdAt?: string;
  updatedAt?: string;
  isActive: boolean;
}

export default function CheckoutScreen() {
  const { cartItems, getTotalPrice } = useCartStore();
  const { userId } = useAuthStore();

  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string>("");
  const [couponId, setCouponId] = useState<string>("");

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
        // Fetch payment methods from API
        const paymentResponse = await fetch(`${API_URL}/v1/payment-methods`);
        const paymentData = await paymentResponse.json();
        if (paymentData.success) {
          setPaymentMethods(paymentData.data);
          // Select the first active payment method by default
          const activePaymentMethod = paymentData.data.find(
            (method: PaymentMethod) => method.isActive
          );
          setSelectedPaymentMethodId(
            activePaymentMethod
              ? activePaymentMethod.id
              : paymentData.data[0]?.id || null
          );
        }

        // Fetch addresses from API
        const addressResponse = await fetch(
          `${API_URL}/v1/addresses/user/${userId}`
        );
        const addressData = await addressResponse.json();
        if (addressData.success) {
          setAddresses(addressData.data);
          // Select the active address by default
          const activeAddress = addressData.data.find(
            (addr: Address) => addr.isActive
          );
          setSelectedAddressId(
            activeAddress ? activeAddress.id : addressData.data[0]?.id || null
          );
        }
      } catch (error) {
        console.error("Error fetching payment methods and addresses:", error);
      }
    };

    fetchDeliveryZones();
    fetchPaymentMethodsAndAddresses();
  }, [userId]);

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
