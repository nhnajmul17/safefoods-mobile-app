import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Modal from "react-native-modal";
import { OrderDetail } from "./orderTypes";
import { formatWithThousandSeparator } from "@/utils/helperFunctions";
import { ensureHttps } from "@/utils/imageUtils";

interface OrderModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedOrder: OrderDetail | null;
}

export default function OrderModal({
  isVisible,
  onClose,
  selectedOrder,
}: OrderModalProps) {
  if (!selectedOrder) return null;

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            Order #{selectedOrder.date.split(" at ")[0]}
          </Text>
          <TouchableOpacity onPress={onClose}>
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
            <Image
              source={{ uri: ensureHttps(item?.media?.url) }}
              style={styles.itemPlaceholder}
              resizeMode="cover"
            />
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>
              ৳ {formatWithThousandSeparator(item.price)}
            </Text>
          </View>
        ))}
        <View style={styles.infoRow}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoTitle}>Shipping Information</Text>
            <Text style={styles.infoText}>{selectedOrder.shipping.name}</Text>
            <Text style={styles.infoText}>
              {selectedOrder.shipping.address}
            </Text>
            <Text style={styles.infoText}>
              Phone: {selectedOrder.shipping.phone}
            </Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoTitle}>Payment Information</Text>
            <Text style={styles.infoText}>
              Method: {selectedOrder.payment.method}
            </Text>
            <Text style={styles.infoText}>
              Payment Status: {selectedOrder.payment.paymentStatus}
            </Text>
            <Text style={styles.infoText}>
              Subtotal: ৳
              {formatWithThousandSeparator(selectedOrder.payment.subtotal)}
            </Text>
            <Text style={styles.infoText}>
              Shipping: ৳
              {formatWithThousandSeparator(selectedOrder.payment.shipping)}
            </Text>
            <Text style={styles.infoText}>
              Tax: ৳{formatWithThousandSeparator(selectedOrder.payment.tax)}
            </Text>
            <Text style={styles.infoTotal}>
              Total: ৳{formatWithThousandSeparator(selectedOrder.payment.total)}
            </Text>
          </View>
        </View>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={styles.closeButtonContainer}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 36,
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
    // backgroundColor: "#eee",
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
