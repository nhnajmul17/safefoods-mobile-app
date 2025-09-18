import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_DELIVERED,
  ORDER_STATUS_PROCESSING,
  ORDER_STATUS_SHIPPED,
} from "@/constants/variables";
import { Order } from "./orderTypes";

interface OrderCardProps {
  item: Order;
  toggleModal: (orderId: string | null) => void;
  isGuest?: boolean;
}

export default function OrderCard({ item, toggleModal, isGuest = false }: OrderCardProps) {
  const statusColor =
    item.orderStatus === ORDER_STATUS_DELIVERED
      ? "#27ae60"
      : item.orderStatus === ORDER_STATUS_PROCESSING
      ? "#3498db"
      : item.orderStatus === ORDER_STATUS_CANCELLED
      ? "#e74c3c"
      : item.orderStatus === ORDER_STATUS_SHIPPED
      ? "#f39c12"
      : "#f1c40f";
  const statusBackgroundColor =
    item.orderStatus === ORDER_STATUS_DELIVERED
      ? "#e8f5e9"
      : item.orderStatus === ORDER_STATUS_PROCESSING
      ? "#e6f3fa"
      : item.orderStatus === ORDER_STATUS_SHIPPED
      ? "#fff3e0"
      : item.orderStatus === ORDER_STATUS_CANCELLED
      ? "#fdecea"
      : "#fef9e7";

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderId}>Order #{item.id.slice(0, 8)}</Text>
        <Text style={styles.orderDate}>
          Placed on {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.orderItems}>
          {item.productList.length > 1
            ? `${item.productList.length} items`
            : "1 item"}
        </Text>
        <Text style={styles.orderTotal}>৳{item.total.toFixed(2)}</Text>
      </View>
      {!isGuest && (
        <View
          style={[styles.statusBadge, { backgroundColor: statusBackgroundColor }]}
        >
          <Text style={[styles.statusText, { color: statusColor }]}>
            {item.orderStatus}
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => toggleModal(item.id)}
      >
        <Text style={styles.viewButtonText}>View Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
