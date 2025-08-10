import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface TransactionDetailsSectionProps {
  transactionNo: string;
  transactionPhoneNo: string;
  transactionDate: Date | null;
  onTransactionNoChange: (text: string) => void;
  onTransactionPhoneNoChange: (text: string) => void;
  onTransactionDateChange: (visible: boolean) => void;
}

export default function TransactionDetailsSection({
  transactionNo,
  transactionPhoneNo,
  transactionDate,
  onTransactionNoChange,
  onTransactionPhoneNoChange,
  onTransactionDateChange,
}: TransactionDetailsSectionProps) {
  const handleDateConfirm = (date: Date) => {
    onTransactionDateChange(false); // Hide picker
    // No need to set state here; parent handles it
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Transaction No"
        value={transactionNo}
        onChangeText={onTransactionNoChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Transaction Phone No"
        value={transactionPhoneNo}
        onChangeText={onTransactionPhoneNoChange}
        keyboardType="phone-pad"
      />
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => onTransactionDateChange(true)}
      >
        <Text style={styles.datePickerText}>
          {transactionDate
            ? transactionDate.toLocaleString()
            : "Select Transaction Date & Time"}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={false} // Controlled by parent
        mode="datetime"
        onConfirm={handleDateConfirm}
        onCancel={() => onTransactionDateChange(false)}
        minimumDate={new Date()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  datePickerButton: {
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
  },
  datePickerText: {
    fontSize: 14,
    color: "#333",
  },
});
