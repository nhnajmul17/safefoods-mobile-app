import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Image,
} from "react-native";
import Modal from "react-native-modal";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function MyOrdersScreen() {
  const router = useRouter();

  // Mock order data (replace with real data from API or store)
  const [orders] = useState([
    {
      id: "ORD-12345",
      date: "2023-05-15",
      items: 3,
      total: 125.99,
      status: "Delivered",
    },
    {
      id: "ORD-12346",
      date: "2023-05-10",
      items: 2,
      total: 89.5,
      status: "Processing",
    },
    {
      id: "ORD-12347",
      date: "2023-05-05",
      items: 4,
      total: 210.75,
      status: "Shipped",
    },
    {
      id: "ORD-12348",
      date: "2023-04-28",
      items: 1,
      total: 45.25,
      status: "Delivered",
    },
  ]);

  // State for modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  // Mock order details for the modal (replace with real data)
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

  const orderDetails: { [orderId: string]: OrderDetail } = {
    "ORD-12345": {
      date: "May 15, 2023 at 09:00 AM",
      timeline: [
        {
          status: "Order Placed",
          time: "May 15, 2023 at 09:15 AM",
          description: "Your order has been received and is being processed.",
        },
        {
          status: "Processing",
          time: "May 15, 2023 at 10:00 AM",
          description: "Your order is being prepared for shipping.",
        },
        {
          status: "Shipped",
          time: "May 16, 2023 at 08:00 AM",
          description: "Your order has been shipped.",
        },
        {
          status: "Delivered",
          time: "May 18, 2023 at 02:30 PM",
          description: "Your order has been delivered.",
        },
      ],
      items: [
        { name: "Apple", quantity: 2, price: 3.99 },
        { name: "Banana", quantity: 5, price: 2.49 },
        { name: "Orange", quantity: 3, price: 3.29 },
      ],
      shipping: {
        name: "Jane Smith",
        address: "456 Oak St, Los Angeles, CA 90001, United States",
        method: "Standard Shipping (3-5 business days)",
      },
      payment: {
        method: "Credit Card",
        subtotal: 115.99,
        shipping: 5.0,
        tax: 5.0,
        total: 125.99,
      },
    },
    "ORD-12346": {
      date: "May 10, 2023 at 06:00 AM",
      timeline: [
        {
          status: "Order Placed",
          time: "May 10, 2023 at 03:45 PM",
          description: "Your order has been received and is being processed.",
        },
        {
          status: "Processing",
          time: "May 10, 2023 at 04:30 PM",
          description: "Your order is being prepared for shipping.",
        },
      ],
      items: [
        { name: "Organic Apples", quantity: 3, price: 6.99 },
        { name: "Free Range Eggs", quantity: 2, price: 4.99 },
      ],
      shipping: {
        name: "John Doe",
        address: "123 Main St, New York, NY 10001, United States",
        method: "Express Shipping (1-2 business days)",
      },
      payment: {
        method: "PayPal",
        subtotal: 79.5,
        shipping: 5.0,
        tax: 5.0,
        total: 89.5,
      },
    },
    "ORD-12347": {
      date: "May 05, 2023 at 11:00 AM",
      timeline: [
        {
          status: "Order Placed",
          time: "May 05, 2023 at 11:15 AM",
          description: "Your order has been received and is being processed.",
        },
        {
          status: "Processing",
          time: "May 05, 2023 at 12:00 PM",
          description: "Your order is being prepared for shipping.",
        },
        {
          status: "Shipped",
          time: "May 06, 2023 at 09:00 AM",
          description: "Your order has been shipped.",
        },
      ],
      items: [
        { name: "Chicken Breast", quantity: 2, price: 9.99 },
        { name: "Beef Steak", quantity: 3, price: 14.99 },
        { name: "Mutton Leg", quantity: 1, price: 12.49 },
        { name: "Lamb Chop", quantity: 2, price: 19.99 },
      ],
      shipping: {
        name: "Alice Johnson",
        address: "789 Pine St, Chicago, IL 60601, United States",
        method: "Express Shipping (1-2 business days)",
      },
      payment: {
        method: "Credit Card",
        subtotal: 200.75,
        shipping: 5.0,
        tax: 5.0,
        total: 210.75,
      },
    },
    "ORD-12348": {
      date: "April 28, 2023 at 02:00 PM",
      timeline: [
        {
          status: "Order Placed",
          time: "April 28, 2023 at 02:15 PM",
          description: "Your order has been received and is being processed.",
        },
        {
          status: "Processing",
          time: "April 28, 2023 at 03:00 PM",
          description: "Your order is being prepared for shipping.",
        },
        {
          status: "Shipped",
          time: "April 29, 2023 at 10:00 AM",
          description: "Your order has been shipped.",
        },
        {
          status: "Delivered",
          time: "May 01, 2023 at 01:30 PM",
          description: "Your order has been delivered.",
        },
      ],
      items: [{ name: "Cheddar", quantity: 1, price: 7.99 }],
      shipping: {
        name: "Bob Wilson",
        address: "321 Elm St, Houston, TX 77001, United States",
        method: "Standard Shipping (3-5 business days)",
      },
      payment: {
        method: "PayPal",
        subtotal: 35.25,
        shipping: 5.0,
        tax: 5.0,
        total: 45.25,
      },
    },
  };

  const toggleModal = (orderId: string | null) => {
    setSelectedOrder(orderId ? orderDetails[orderId] : null);
    setModalVisible(!isModalVisible);
  };

  const renderOrder = ({ item }: { item: any }) => {
    const statusColor =
      item.status === "Delivered"
        ? "#27ae60"
        : item.status === "Processing"
        ? "#3498db"
        : "#f1c40f";
    const statusBackgroundColor =
      item.status === "Delivered"
        ? "#e8f5e9"
        : item.status === "Processing"
        ? "#e6f3fa"
        : "#fef9e7";

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>ORD-{item.id}</Text>
          <Text style={styles.orderDate}>Placed on {item.date}</Text>
          <Text style={styles.orderItems}>{item.items} items</Text>
          <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusBackgroundColor },
          ]}
        >
          <Text style={[styles.statusText, { color: statusColor }]}>
            {item.status}
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>View and track your order history</Text>
      </View>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
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
                <Text style={styles.itemPrice}>${item.price}</Text>
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
                  Subtotal: ${selectedOrder.payment.subtotal}
                </Text>
                <Text style={styles.infoText}>
                  Shipping: ${selectedOrder.payment.shipping}
                </Text>
                <Text style={styles.infoText}>
                  Tax: ${selectedOrder.payment.tax}
                </Text>
                <Text style={styles.infoTotal}>
                  Total: ${selectedOrder.payment.total}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
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
});
