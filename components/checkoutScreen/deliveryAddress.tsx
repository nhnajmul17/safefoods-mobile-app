import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
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
              label={`${address.fullName}, ${address.addressLine1}`}
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
