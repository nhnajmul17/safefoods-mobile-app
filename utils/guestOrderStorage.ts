import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem } from "@/store/storeTypes";

// Storage key for guest orders
const GUEST_ORDERS_STORAGE_KEY = "@GuestOrders";

// Maximum number of orders to store
const MAX_GUEST_ORDERS = 5;

// Guest order interface based on the API response structure
export interface GuestOrder {
  id: string;
  guestUserId: string;
  subTotal: number;
  discount: number;
  couponId: string | null;
  afterDiscountTotal: number;
  deliveryCharge: number;
  deliveryZoneId: string;
  total: number;
  preferredDeliveryDateAndTime: string | null;
  paymentMethodId: string;
  paymentMethodTitle?: string;
  transactionNo: string | null;
  transactionPhoneNo: string | null;
  transactionDate: string | null;
  paymentStatus: string;
  orderStatus: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  // Product orders
  productOrders: {
    id: string;
    variantProductId: string;
    orderId: string;
    price: string;
    quantity: string;
    productTitle?: string;
    productImage?: string;
    productUnit?: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
  // Guest user info
  guestUserInfo: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
  };
  // Guest address info
  guestUserAddressInfo: {
    id: string;
    userId: null;
    guestUserId: string;
    flatNo: string;
    floorNo: string;
    addressLine: string;
    name: string;
    phoneNo: string;
    deliveryNotes: string | null;
    city: string;
    state: string | null;
    country: string;
    postalCode: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
  };
}

// Function to get payment method title by ID (you might need to adjust this)
const getPaymentMethodTitle = (
  paymentMethodId: string,
  paymentMethods: any[] = []
): string => {
  const method = paymentMethods.find((pm) => pm.id === paymentMethodId);
  return method?.title || "Unknown Payment Method";
};

// Save guest order to storage
export const saveGuestOrder = async (
  orderResponse: any,
  cartItems: CartItem[],
  paymentMethods: any[] = []
): Promise<void> => {
  try {
    const { order, productOrders, guestUserInfo, guestUserAddressInfo } =
      orderResponse.data;

    // Enhance product orders with cart item details
    const enhancedProductOrders = productOrders.map((productOrder: any) => {
      const cartItem = cartItems.find(
        (item) => item.variantId === productOrder.variantProductId
      );
      return {
        ...productOrder,
        productTitle: cartItem?.name || "Unknown Product",
        productImage: cartItem?.image || "",
        productUnit: cartItem?.unit || "pcs",
      };
    });

    // Create the guest order object
    const guestOrder: GuestOrder = {
      ...order,
      paymentMethodTitle: getPaymentMethodTitle(
        order.paymentMethodId,
        paymentMethods
      ),
      productOrders: enhancedProductOrders,
      guestUserInfo,
      guestUserAddressInfo,
    };

    // Get existing orders
    const existingOrders = await getGuestOrders();

    // Add new order to the beginning of the array
    const updatedOrders = [guestOrder, ...existingOrders];

    // Keep only the last 5 orders
    const ordersToKeep = updatedOrders.slice(0, MAX_GUEST_ORDERS);

    // Save to AsyncStorage
    await AsyncStorage.setItem(
      GUEST_ORDERS_STORAGE_KEY,
      JSON.stringify(ordersToKeep)
    );

    console.log(`Guest order saved. Total orders: ${ordersToKeep.length}`);
  } catch (error) {
    console.error("Error saving guest order:", error);
  }
};

// Get all guest orders from storage
export const getGuestOrders = async (): Promise<GuestOrder[]> => {
  try {
    const storedOrders = await AsyncStorage.getItem(GUEST_ORDERS_STORAGE_KEY);
    return storedOrders ? JSON.parse(storedOrders) : [];
  } catch (error) {
    console.error("Error loading guest orders:", error);
    return [];
  }
};

// Get a specific guest order by ID
export const getGuestOrderById = async (
  orderId: string
): Promise<GuestOrder | null> => {
  try {
    const orders = await getGuestOrders();
    return orders.find((order) => order.id === orderId) || null;
  } catch (error) {
    console.error("Error getting guest order by ID:", error);
    return null;
  }
};

// Clear all guest orders (useful for testing or user preference)
export const clearGuestOrders = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(GUEST_ORDERS_STORAGE_KEY);
    console.log("Guest orders cleared");
  } catch (error) {
    console.error("Error clearing guest orders:", error);
  }
};

// Get guest order count
export const getGuestOrderCount = async (): Promise<number> => {
  try {
    const orders = await getGuestOrders();
    return orders.length;
  } catch (error) {
    console.error("Error getting guest order count:", error);
    return 0;
  }
};

// Convert guest order to the format expected by the order list component
export const convertGuestOrderToOrderFormat = (guestOrder: GuestOrder): any => {
  return {
    id: guestOrder.id,
    userId: null,
    subTotal: guestOrder.subTotal,
    discount: guestOrder.discount,
    couponId: guestOrder.couponId,
    afterDiscountTotal: guestOrder.afterDiscountTotal,
    deliveryCharge: guestOrder.deliveryCharge,
    deliveryZoneId: guestOrder.deliveryZoneId,
    total: guestOrder.total,
    preferredDeliveryDateAndTime: guestOrder.preferredDeliveryDateAndTime,
    paymentMethodId: guestOrder.paymentMethodId,
    paymentMethodTitle: guestOrder.paymentMethodTitle || "Unknown",
    transactionNo: guestOrder.transactionNo,
    transactionPhoneNo: guestOrder.transactionPhoneNo,
    transactionDate: guestOrder.transactionDate,
    address: {
      id: guestOrder.guestUserAddressInfo.id,
      flatNo: guestOrder.guestUserAddressInfo.flatNo,
      floorNo: guestOrder.guestUserAddressInfo.floorNo,
      addressLine: guestOrder.guestUserAddressInfo.addressLine,
      name: guestOrder.guestUserAddressInfo.name,
      phoneNo: guestOrder.guestUserAddressInfo.phoneNo,
      deliveryNotes: guestOrder.guestUserAddressInfo.deliveryNotes || "",
      city: guestOrder.guestUserAddressInfo.city,
      state: guestOrder.guestUserAddressInfo.state || "",
      country: guestOrder.guestUserAddressInfo.country,
      postalCode: guestOrder.guestUserAddressInfo.postalCode,
      createdAt: guestOrder.guestUserAddressInfo.createdAt,
      updatedAt: guestOrder.guestUserAddressInfo.updatedAt,
      isActive: guestOrder.guestUserAddressInfo.isActive,
    },
    paymentStatus: guestOrder.paymentStatus,
    orderStatus: guestOrder.orderStatus,
    isDeleted: guestOrder.isDeleted,
    createdAt: guestOrder.createdAt,
    updatedAt: guestOrder.updatedAt,
    productList: guestOrder.productOrders.map((productOrder) => ({
      id: productOrder.id,
      variantProductId: productOrder.variantProductId,
      productId: productOrder.variantProductId, // Using variantProductId as productId
      productTitle: productOrder.productTitle || "Unknown Product",
      productSlug: "", // Not available in guest orders
      orderId: productOrder.orderId,
      quantity: productOrder.quantity,
      price: productOrder.price,
      media: productOrder.productImage
        ? [{ id: "", url: productOrder.productImage }]
        : [],
    })),
    orderHistory: [
      {
        id: guestOrder.id,
        status: guestOrder.orderStatus,
        changedBy: "system",
        createdAt: guestOrder.createdAt,
      },
    ],
  };
};
