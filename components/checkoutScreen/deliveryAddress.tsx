import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

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
}

export const DeliveryAddressSection = ({
  addresses,
  selectedAddressId,
  onAddressSelect,
}: DeliveryAddressSectionProps) => {
  return (
    <View style={styles.deliveryZones}>
      <Text style={styles.sectionTitle}>Delivery Address</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedAddressId}
          onValueChange={(itemValue) => onAddressSelect(itemValue as string)}
          style={styles.picker}
        >
          {addresses.map((address) => (
            <Picker.Item
              key={address.id}
              label={`${address.flatNo}, ${address.floorNo}, ${address.addressLine}, ${address.city}, ${address.postalCode}`}
              value={address.id}
            />
          ))}
        </Picker>
      </View>
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
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  deliveryChargeText: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
});
