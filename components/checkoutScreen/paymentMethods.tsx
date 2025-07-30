import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export interface PaymentMethod {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaymentMethodSectionProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId: string | null;
  onPaymentMethodSelect: (id: string) => void;
}

export const PaymentMethodSection = ({
  paymentMethods,
  selectedPaymentMethodId,
  onPaymentMethodSelect,
}: PaymentMethodSectionProps) => {
  return (
    <View style={styles.paymentMethods}>
      <Text style={styles.paymentTitle}>Payment Method</Text>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={styles.paymentOption}
          onPress={() => onPaymentMethodSelect(method.id)}
          disabled={!method.isActive || method.isDeleted}
        >
          <View style={styles.radio}>
            {selectedPaymentMethodId === method.id && (
              <View style={styles.radioSelected} />
            )}
          </View>
          <View>
            <Text style={styles.paymentText}>{method.title}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  paymentMethods: {
    marginTop: 16,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radio: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 8,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#27ae60",
  },
  paymentText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});
