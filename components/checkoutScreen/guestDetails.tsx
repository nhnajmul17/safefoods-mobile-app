import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
} from "react-native";
import { deepGreenColor, yellowColor } from "@/constants/Colors";

export interface GuestDetails {
  fullName: string;
  phoneNumber: string;
  email: string;
  flatNo: string;
  floorNo: string;
  addressLine: string;
  deliveryNotes: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface GuestDetailsSectionProps {
  guestDetails: GuestDetails;
  onDetailsChange: (field: keyof GuestDetails, value: string) => void;
  onAccountCreated?: (userId: string, accessToken: string, refreshToken: string) => void;
  createAccount: boolean;
  onCreateAccountChange: (value: boolean) => void;
}


export const GuestDetailsSection: React.FC<GuestDetailsSectionProps> = ({
  guestDetails,
  onDetailsChange,
  createAccount,
  onCreateAccountChange,
}) => {

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Details</Text>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.subTitle}>Personal Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={guestDetails.fullName}
            onChangeText={(value) => onDetailsChange("fullName", value)}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={guestDetails.phoneNumber}
            onChangeText={(value) => onDetailsChange("phoneNumber", value)}
            placeholder="Enter your phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={guestDetails.email}
            onChangeText={(value) => onDetailsChange("email", value)}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Create Account Switch */}
        <View style={styles.inputContainer}>
          <View style={styles.switchContainer}>
            <Switch
              value={createAccount}
              onValueChange={onCreateAccountChange}
              trackColor={{ false: "#767577", true: deepGreenColor }}
              thumbColor={createAccount ? yellowColor : "#f4f3f4"}
            />
            <Text style={styles.switchLabel}>Create account during checkout</Text>
          </View>
          {createAccount && (
            <Text style={styles.createAccountInfo}>
              Account will be created when you place your order
            </Text>
          )}
        </View>
      </View>

      {/* Address Information */}
      <View style={styles.section}>
        <Text style={styles.subTitle}>Delivery Address</Text>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Flat No</Text>
            <TextInput
              style={styles.input}
              value={guestDetails.flatNo}
              onChangeText={(value) => onDetailsChange("flatNo", value)}
              placeholder="Flat/Unit"
              placeholderTextColor="#999"
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Floor No</Text>
            <TextInput
              style={styles.input}
              value={guestDetails.floorNo}
              onChangeText={(value) => onDetailsChange("floorNo", value)}
              placeholder="Floor"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address Line *</Text>
          <TextInput
            style={styles.input}
            value={guestDetails.addressLine}
            onChangeText={(value) => onDetailsChange("addressLine", value)}
            placeholder="Street address, area"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              value={guestDetails.city}
              onChangeText={(value) => onDetailsChange("city", value)}
              placeholder="City"
              placeholderTextColor="#999"
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              value={guestDetails.state}
              onChangeText={(value) => onDetailsChange("state", value)}
              placeholder="State"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              value={guestDetails.country}
              onChangeText={(value) => onDetailsChange("country", value)}
              placeholder="Country"
              placeholderTextColor="#999"
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Postal Code</Text>
            <TextInput
              style={styles.input}
              value={guestDetails.postalCode}
              onChangeText={(value) => onDetailsChange("postalCode", value)}
              placeholder="Postal Code"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Delivery Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={guestDetails.deliveryNotes}
            onChangeText={(value) => onDetailsChange("deliveryNotes", value)}
            placeholder="Special delivery instructions (optional)"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: deepGreenColor,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 80,
    paddingTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginLeft: 8,
  },
  createAccountInfo: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginTop: 4,
  },
});
