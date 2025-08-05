import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import Modal from "react-native-modal";
import { useState, useEffect, useCallback } from "react";

import { useAuthStore } from "@/store/authStore";
import {
  API_URL,
  ORDER_STATUS_DELIVERED,
  ORDER_STATUS_PROCESSING,
} from "@/constants/variables";

// Define TypeScript types based on API response
type OrderHistory = {
  id: string;
  status: string;
  changedBy: string;
  createdAt: string;
};

type Order = {
  id: string;
  userId: string;
  subTotal: number;
  discount: number;
  couponId: string | null;
  afterDiscountTotal: number;
  deliveryCharge: number;
  deliveryZoneId: string;
  total: number;
  preferredDeliveryDateAndTime: string;
  paymentMethodId: string;
  transactionNo: string | null;
  transactionPhoneNo: string | null;
  transactionDate: string | null;
  addressId: string;
  paymentStatus: string;
  orderStatus: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  orderHistory: OrderHistory[];
};

type Pagination = {
  offset: number;
  limit: number;
  total: number;
  currentCount: number;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: Order[];
  pagination: Pagination;
  _links: {
    self: { href: string };
    next: string | null;
    previous: string | null;
    collection: { href: string };
  };
};

type OrderDetail = {
  date: string;
  timeline: { status: string; time: string; description: string }[];
  items: { name: string; quantity: number; price: number }[];
  shipping: { name: string; address: string; method: string };
  payment: {
    method: string;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
};

export default function MyOrdersScreen() {
  const { userId, accessToken } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  const fetchOrders = useCallback(
    async (offset: number = 0) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/v1/orders/user/${userId}?offset=${offset}&limit=10`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data: ApiResponse = await response.json();
        if (data.success) {
          setOrders((prev) =>
            offset === 0 ? data.data : [...prev, ...data.data]
          );
          setPagination(data.pagination);
        } else {
          console.error("Failed to fetch orders:", data.message);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    },
    [accessToken, userId]
  );

  useEffect(() => {
    fetchOrders(0);
  }, [fetchOrders]);

  const toggleModal = (orderId: string | null) => {
    if (orderId) {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        setSelectedOrder({
          date: new Date(order.createdAt).toLocaleString(),
          timeline: order.orderHistory.map((history) => ({
            status: history.status,
            time: new Date(history.createdAt).toLocaleString(),
            description: `Order status updated to ${history.status} by user.`,
          })),
          items: [], // Placeholder; API doesn't provide items, consider a separate API call if needed
          shipping: {
            name: "User", // Placeholder; API doesn't provide shipping details
            address: "Address not available", // Placeholder
            method: "Standard Shipping", // Placeholder
          },
          payment: {
            method: order.paymentMethodId || "Unknown", // Placeholder; map paymentMethodId to method if possible
            subtotal: order.subTotal,
            shipping: order.deliveryCharge,
            tax: 0, // Placeholder; API doesn't provide tax
            total: order.total,
          },
        });
      }
    } else {
      setSelectedOrder(null);
    }
    setModalVisible(!isModalVisible);
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const statusColor =
      item.orderStatus === ORDER_STATUS_DELIVERED
        ? "#27ae60"
        : item.orderStatus === ORDER_STATUS_PROCESSING
        ? "#3498db"
        : "#f1c40f";
    const statusBackgroundColor =
      item.orderStatus === ORDER_STATUS_DELIVERED
        ? "#e8f5e9"
        : item.orderStatus === ORDER_STATUS_PROCESSING
        ? "#e6f3fa"
        : "#fef9e7";

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{item.id.slice(0, 8)}</Text>
          <Text style={styles.orderDate}>
            Placed on {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.orderItems}>
            {item.subTotal > 0 ? "Multiple items" : "1 item"}
          </Text>
          <Text style={styles.orderTotal}>৳{item.total.toFixed(2)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusBackgroundColor },
          ]}
        >
          <Text style={[styles.statusText, { color: statusColor }]}>
            {item.orderStatus}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => toggleModal(item.id)}
        >
          <Text style={styles.viewButtonText}>View Order</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleLoadMore = () => {
    if (pagination && orders.length < pagination.total) {
      fetchOrders(orders.length);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>View and track your order history</Text>
      </View>
      {loading && orders.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text>Loading orders...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.noOrdersContainer}>
          <Text style={styles.noOrdersText}>No orders found.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            pagination && orders.length < pagination.total ? (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={handleLoadMore}
                disabled={loading}
              >
                <Text style={styles.loadMoreText}>
                  {loading ? "Loading..." : "Load More"}
                </Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => toggleModal(null)}
        style={styles.modal}
      >
        {selectedOrder && (
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Order #{selectedOrder.date.split(" at ")[0]}
              </Text>
              <TouchableOpacity onPress={() => toggleModal(null)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalStatus}>Processing</Text>
            <Text style={styles.modalDate}>Placed on {selectedOrder.date}</Text>
            <Text style={styles.modalSection}>Order Timeline</Text>
            {selectedOrder.timeline.map((event, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View>
                  <Text style={styles.timelineStatus}>{event.status}</Text>
                  <Text style={styles.timelineTime}>{event.time}</Text>
                  <Text style={styles.timelineDescription}>
                    {event.description}
                  </Text>
                </View>
              </View>
            ))}
            <Text style={styles.modalSection}>
              Items ({selectedOrder.items.length})
            </Text>
            {selectedOrder.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemPlaceholder} />
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>৳{item.price}</Text>
              </View>
            ))}
            <View style={styles.infoRow}>
              <View style={styles.infoColumn}>
                <Text style={styles.infoTitle}>Shipping Information</Text>
                <Text style={styles.infoText}>
                  {selectedOrder.shipping.name}
                </Text>
                <Text style={styles.infoText}>
                  {selectedOrder.shipping.address}
                </Text>
                <Text style={styles.infoText}>
                  Method: {selectedOrder.shipping.method}
                </Text>
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.infoTitle}>Payment Information</Text>
                <Text style={styles.infoText}>
                  Method: {selectedOrder.payment.method}
                </Text>
                <Text style={styles.infoText}>
                  Subtotal: ৳{selectedOrder.payment.subtotal}
                </Text>
                <Text style={styles.infoText}>
                  Shipping: ৳{selectedOrder.payment.shipping}
                </Text>
                <Text style={styles.infoText}>
                  Tax: ৳{selectedOrder.payment.tax}
                </Text>
                <Text style={styles.infoTotal}>
                  Total: ৳{selectedOrder.payment.total}
                </Text>
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.closeButtonContainer}
                onPress={() => toggleModal(null)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  orderItems: {
    fontSize: 14,
    color: "#666",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  viewButton: {
    padding: 8,
  },
  viewButtonText: {
    fontSize: 14,
    color: "#3498db",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    fontSize: 24,
    color: "#666",
  },
  modalStatus: {
    fontSize: 14,
    color: "#3498db",
    marginBottom: 8,
  },
  modalDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  modalSection: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3498db",
    marginTop: 4,
    marginRight: 8,
  },
  timelineStatus: {
    fontSize: 14,
    color: "#333",
  },
  timelineTime: {
    fontSize: 12,
    color: "#666",
  },
  timelineDescription: {
    fontSize: 12,
    color: "#666",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: "#eee",
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    color: "#333",
  },
  itemQuantity: {
    fontSize: 12,
    color: "#666",
  },
  itemPrice: {
    fontSize: 14,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  infoColumn: {
    flex: 1,
    padding: 8,
    backgroundColor: "#e6f3fa",
    borderRadius: 8,
    marginRight: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  infoTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  closeButtonContainer: {
    flex: 1,
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  noOrdersText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loadMoreButton: {
    backgroundColor: "#55796d",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  loadMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
