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
import { useAuthStore } from "@/store/authStore";
import { DeliveryZoneSection } from "@/components/checkoutScreen/deliveryZoneSection";
import { CouponSection } from "@/components/checkoutScreen/couponSection";
import { OrderSummarySection } from "@/components/checkoutScreen/orderSummary";
import { PaymentMethodSection } from "@/components/checkoutScreen/paymentMethods";
import { UnifiedPlaceOrderButton } from "@/components/checkoutScreen/UnifiedPlaceOrderButton";
import {
  API_URL,
  PAYMENT_METHOD_CASH_ON_DELIVERY,
} from "@/constants/variables";
import { DeliveryAddressSection } from "@/components/checkoutScreen/deliveryAddress";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import TransactionDetailsSection from "@/components/checkoutScreen/transactionDetails";
import AddressFormModal from "@/components/myProfileScreen/addressFormModal";
import Icon from "react-native-vector-icons/MaterialIcons";
import { deepGreenColor, yellowColor } from "@/constants/Colors";
import { GuestDetailsSection } from "@/components/checkoutScreen/guestDetails";

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

interface UnifiedCheckoutScreenProps {
  isGuest?: boolean;
}

export default function UnifiedCheckoutScreen({ isGuest = false }: UnifiedCheckoutScreenProps) {
  const { cartItems, getTotalPrice } = useCartStore();
  const { userId } = useAuthStore();
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

  // Authenticated user addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

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

  // Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);

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

    const fetchAddresses = async () => {
      if (!isGuest && userId) {
        try {
          const addressResponse = await fetch(
            `${API_URL}/v1/addresses/user/${userId}`
          );
          const addressData = await addressResponse.json();
          if (addressData.success) {
            setAddresses(addressData.data);
            const activeAddress = addressData.data.find(
              (addr: Address) => addr.isActive
            );
            setSelectedAddressId(
              activeAddress ? activeAddress.id : addressData.data[0]?.id || null
            );
          }
        } catch (error) {
          console.error("Error fetching addresses:", error);
        }
      }
    };

    fetchDeliveryZones();
    fetchPaymentMethods();
    fetchAddresses();
  }, [userId, isGuest]);

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

  const handleSaveAddress = async (
    formData: Omit<
      Address,
      "id" | "createdAt" | "updatedAt" | "userId" | "isActive"
    > & {
      isActive?: boolean;
    }
  ) => {
    if (!userId) {
      console.error("User ID is null");
      return;
    }

    const url = `${API_URL}/v1/addresses/`;
    const method = "POST";
    const body = {
      userId: userId,
      ...formData,
      isActive: formData.isActive ?? false,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.success) {
        const newAddress: Address = {
          id: data.data.id,
          userId: userId,
          flatNo: formData.flatNo,
          floorNo: formData.floorNo,
          addressLine: formData.addressLine,
          name: formData.name,
          phoneNo: formData.phoneNo,
          deliveryNotes: formData.deliveryNotes,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
          isActive: false,
          createdAt: data.data.createdAt || undefined,
          updatedAt: data.data.updatedAt || undefined,
        };
        setAddresses((prev) => [...prev, newAddress]);
        setShowAddressModal(false);
        setSelectedAddressId(newAddress.id);
      } else {
        console.error("Failed to save address:", data.message);
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const getSectionData = () => {
    const sections = [
      { type: "delivery", key: "delivery" },
      ...(isGuest
        ? [{ type: "guestDetails", key: "guestDetails" }]
        : [{ type: "deliveryAddress", key: "deliveryAddress" }]),
      { type: "order", key: "order" },
      { type: "coupon", key: "coupon" },
      { type: "payment", key: "payment" },
      { type: "transaction", key: "transaction" },
      { type: "placeOrder", key: "placeOrder" },
    ];
    return sections;
  };

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
          <View>
            {addresses.length > 0 && (
              <DeliveryAddressSection
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onAddressSelect={setSelectedAddressId}
              />
            )}
            <TouchableOpacity
              style={styles.addAddressButton}
              onPress={() => setShowAddressModal(true)}
            >
              <Icon name="add" size={20} color={yellowColor} />
              <Text style={styles.addAddressButtonText}>Add New Address</Text>
            </TouchableOpacity>
          </View>
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
          <UnifiedPlaceOrderButton
            isGuest={isGuest}
            selectedZoneId={selectedZoneId}
            deliveryCharge={deliveryCharge}
            getTotalPrice={getTotalPrice}
            appliedDiscount={appliedDiscount}
            discountType={discountType}
            preferredDeliveryDateTime={preferredDeliveryDateTime}
            paymentMethods={paymentMethods}
            paymentMethodId={selectedPaymentMethodId}
            addressId={selectedAddressId}
            productOrders={mapCartToProductOrders()}
            userId={userId}
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
          data={getSectionData()}
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
        {!isGuest && (
          <AddressFormModal
            visible={showAddressModal}
            onClose={() => setShowAddressModal(false)}
            onSave={handleSaveAddress}
            initialData={null}
          />
        )}
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
  addAddressButton: {
    flexDirection: "row",
    backgroundColor: deepGreenColor,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  addAddressButtonText: {
    color: yellowColor,
    fontSize: 16,
    fontWeight: "bold",
  },
});