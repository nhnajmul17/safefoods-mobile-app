import { Address } from "@/app/my-profile";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onSetActive: (id: string, currentActive: boolean) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetActive,
}) => {
  return (
    <View style={styles.addressCard}>
      <View style={styles.addressDetails}>
        <Text style={styles.addressText}>
          {`${address.flatNo}, ${address.floorNo}, ${address.addressLine}, ${address.city}, ${address.postalCode}`}
        </Text>
        <Text style={styles.addressSubText}>
          {address.name} - {address.phoneNo}
        </Text>
        <Text style={styles.addressSubText}>{address.deliveryNotes}</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Active</Text>
          <TouchableOpacity
            style={styles.switch}
            onPress={() => onSetActive(address.id!, address.isActive)}
          >
            <View
              style={[
                styles.switchToggle,
                address.isActive && styles.switchToggleActive,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.addressActions}>
        <TouchableOpacity onPress={onEdit}>
          <Icon name="edit" size={20} color="#007BFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(address.id!)}
        >
          <Icon name="delete" size={20} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  addressCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addressDetails: {
    flex: 1,
  },
  addressText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  addressSubText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  switchLabel: {
    fontSize: 14,
    color: "#333",
    marginRight: 10,
  },
  switch: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ccc",
    justifyContent: "center",
    padding: 2,
  },
  switchToggle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  switchToggleActive: {
    transform: [{ translateX: 20 }],
    backgroundColor: "#28a745",
  },
  addressActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    marginLeft: 10,
  },
});

export default AddressCard;
