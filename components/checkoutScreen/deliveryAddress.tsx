import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { deepGreenColor, yellowColor } from "@/constants/Colors";

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

interface DeliveryAddressSectionProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onAddressSelect: (id: string) => void;
  onEditAddress?: (address: Address) => void;
}

export const DeliveryAddressSection = ({
  addresses,
  selectedAddressId,
  onAddressSelect,
  onEditAddress,
}: DeliveryAddressSectionProps) => {
  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  return (
    <View style={styles.deliveryZones}>
      <Text style={styles.sectionTitle}>Delivery Address</Text>

      {/* Address Picker Dropdown */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedAddressId}
          onValueChange={(itemValue) => onAddressSelect(itemValue as string)}
          style={styles.picker}
          dropdownIconColor="#333"
        >
          {addresses.map((address) => (
            <Picker.Item
              key={address.id}
              label={`${[
                address.flatNo && `${address.flatNo}`,
                address.floorNo && `${address.floorNo}`,
                address.addressLine,
                address.city,
                address.postalCode && `${address.postalCode}`,
              ]
                .filter(Boolean)
                .join(", ")}`}
              value={address.id}
            />
          ))}
        </Picker>
      </View>

      {/* Selected Address Details with Edit Button */}
      {selectedAddress && (
        <View style={styles.selectedAddressContainer}>
          <View style={styles.addressDetails}>
            <Text style={styles.addressText}>
              {[
                selectedAddress.flatNo && `${selectedAddress.flatNo}`,
                selectedAddress.floorNo && `${selectedAddress.floorNo}`,
                selectedAddress.addressLine,
                selectedAddress.city,
                selectedAddress.postalCode && `${selectedAddress.postalCode}`,
              ]
                .filter(Boolean)
                .join(", ")}
            </Text>
            <Text style={styles.addressSubText}>
              {selectedAddress.name} - {selectedAddress.phoneNo}
            </Text>
            {selectedAddress.deliveryNotes && (
              <Text style={styles.addressSubText}>
                Note: {selectedAddress.deliveryNotes}
              </Text>
            )}
          </View>

          {/* Edit Button */}
          {onEditAddress && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => onEditAddress(selectedAddress)}
            >
              <Icon name="edit" size={20} color={yellowColor} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  deliveryZones: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
  },
  selectedAddressContainer: {
    backgroundColor: "#f8fff8",
    borderWidth: 1,
    borderColor: deepGreenColor,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  addressDetails: {
    flex: 1,
    marginRight: 12,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
    lineHeight: 20,
  },
  addressSubText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
    lineHeight: 16,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: deepGreenColor,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  deliveryChargeText: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
});
