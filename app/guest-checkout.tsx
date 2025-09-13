import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useCartStore } from "@/store/cartStore";
import { DeliveryZoneSection } from "@/components/checkoutScreen/deliveryZoneSection";
import { CouponSection } from "@/components/checkoutScreen/couponSection";
import { OrderSummarySection } from "@/components/checkoutScreen/orderSummary";
import { PaymentMethodSection } from "@/components/checkoutScreen/paymentMethods";
import {
  API_URL,
  PAYMENT_METHOD_CASH_ON_DELIVERY,
} from "@/constants/variables";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import TransactionDetailsSection from "@/components/checkoutScreen/transactionDetails";
import { deepGreenColor, yellowColor } from "@/constants/Colors";
import { GuestDetailsSection } from "@/components/checkoutScreen/guestDetails";
import { GuestPlaceOrderButton } from "@/components/checkoutScreen/guestPlaceOrderButton";

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

export interface GuestDetails {
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

export default function GuestCheckoutScreen() {
  const { cartItems, getTotalPrice } = useCartStore();
  const flatListRef = useRef<FlatList>(null);

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

  // Guest details state
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    fullName: "",
    phoneNumber: "",
    email: "",
    flatNo: "",
    floorNo: "",
    addressLine: "",
    deliveryNotes: "",
    city: "",
    state: "",
    country: "Bangladesh",
    postalCode: "",
  });

  // Transaction details state
  const [transactionNo, setTransactionNo] = useState<string>("");
  const [transactionPhoneNo, setTransactionPhoneNo] = useState<string>("");
  const [transactionDate, setTransactionDate] = useState<Date | null>(null);
  const [isTransactionDatePickerVisible, setTransactionDatePickerVisibility] =
    useState(false);

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

    const fetchPaymentMethods = async () => {
      try {
        const paymentResponse = await fetch(`${API_URL}/v1/payment-methods`);
        const paymentData = await paymentResponse.json();
        if (paymentData.success) {
          setPaymentMethods(paymentData.data);
          const activePaymentMethod = paymentData.data.find(
            (method: PaymentMethod) => method.isActive
          );
          setSelectedPaymentMethodId(
            activePaymentMethod
              ? activePaymentMethod.id
              : paymentData.data[0]?.id || null
          );
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchDeliveryZones();
    fetchPaymentMethods();
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

  const handleTransactionDateConfirm = (date: Date) => {
    setTransactionDate(date);
    setTransactionDatePickerVisibility(false);
  };

  const handleGuestDetailsChange = (
    field: keyof GuestDetails,
    value: string
  ) => {
    setGuestDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const data = [
    { type: "delivery", key: "delivery" },
    { type: "guestDetails", key: "guestDetails" },
    { type: "order", key: "order" },
    { type: "coupon", key: "coupon" },
    { type: "payment", key: "payment" },
    { type: "transaction", key: "transaction" },
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
      case "guestDetails":
        return (
          <GuestDetailsSection
            guestDetails={guestDetails}
            onDetailsChange={handleGuestDetailsChange}
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
      case "transaction":
        const isCashOnDelivery =
          paymentMethods
            .find((method) => method.id === selectedPaymentMethodId)
            ?.title.toLocaleLowerCase() !== PAYMENT_METHOD_CASH_ON_DELIVERY;
        return isCashOnDelivery ? (
          <TransactionDetailsSection
            transactionNo={transactionNo}
            transactionPhoneNo={transactionPhoneNo}
            transactionDate={transactionDate}
            onTransactionNoChange={setTransactionNo}
            onTransactionPhoneNoChange={setTransactionPhoneNo}
            onTransactionDateChange={setTransactionDatePickerVisibility}
          />
        ) : null;
      case "placeOrder":
        return (
          <GuestPlaceOrderButton
            selectedZoneId={selectedZoneId}
            deliveryCharge={deliveryCharge}
            getTotalPrice={getTotalPrice}
            appliedDiscount={appliedDiscount}
            discountType={discountType}
            preferredDeliveryDateTime={preferredDeliveryDateTime}
            paymentMethods={paymentMethods}
            paymentMethodId={selectedPaymentMethodId}
            productOrders={mapCartToProductOrders()}
            couponId={couponId}
            guestDetails={guestDetails}
            transactionNo={transactionNo}
            transactionPhoneNo={transactionPhoneNo}
            transactionDate={transactionDate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisibility(false)}
          minimumDate={new Date()}
        />
        <DateTimePickerModal
          isVisible={isTransactionDatePickerVisible}
          mode="datetime"
          onConfirm={handleTransactionDateConfirm}
          onCancel={() => setTransactionDatePickerVisibility(false)}
          minimumDate={new Date()}
        />
        <FlatList
          ref={flatListRef}
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
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
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
