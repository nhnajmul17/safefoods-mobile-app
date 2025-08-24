import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { DeliveryZone } from "@/app/checkout";

interface DeliveryZoneSectionProps {
  deliveryZones: DeliveryZone[];
  selectedZoneId: string | null;
  deliveryCharge: number;
  onZoneSelection: (zoneId: string) => void;
}

export const DeliveryZoneSection = ({
  deliveryZones,
  selectedZoneId,
  deliveryCharge,
  onZoneSelection,
}: DeliveryZoneSectionProps) => {
  return (
    <View style={styles.deliveryZones}>
      <Text style={styles.sectionTitle}>Select Delivery Zone</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedZoneId}
          onValueChange={(itemValue) => onZoneSelection(itemValue as string)}
          style={styles.picker}
          dropdownIconColor="#333"
        >
          {deliveryZones.map((zone) => (
            <Picker.Item
              key={zone.id}
              label={`${zone.areaName} (৳${zone.deliveryCharge})`}
              value={zone.id}
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
    color: "#333",
  },
  deliveryChargeText: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
});
