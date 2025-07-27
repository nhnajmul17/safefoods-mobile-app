import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PaymentMethod {
  id: string;
  name: string;
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
        >
          <View
            style={[
              styles.radio,
              selectedPaymentMethodId === method.id && styles.radioSelected,
            ]}
          />
          <Text style={styles.paymentText}>{method.name}</Text>
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
    marginBottom: 8,
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
  },
});
