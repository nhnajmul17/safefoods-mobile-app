import { Address } from "@/app/my-profile";
import { deepGreenColor, yellowColor } from "@/constants/Colors";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

interface AddressFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (
    formData: Omit<
      Address,
      "id" | "createdAt" | "updatedAt" | "userId" | "isActive"
    > & {
      isActive?: boolean;
    }
  ) => void;
  initialData: Address | null;
}

const validateAddress = (
  data: Omit<
    Address,
    "id" | "createdAt" | "updatedAt" | "userId" | "isActive"
  > & {
    isActive?: boolean;
  }
): string | null => {
  if (
    !data.addressLine ||
    data.addressLine.length < 1 ||
    data.addressLine.length > 500
  ) {
    return "Address line is required";
  }
  if (!data.flatNo && (data.flatNo.length < 1 || data.flatNo.length > 100)) {
    return "Flat number is required";
  }
  if (!data.floorNo && (data.floorNo.length < 1 || data.floorNo.length > 100)) {
    return "Floor number is required";
  }
  if (!data.name || data.name.length < 1 || data.name.length > 100) {
    return "Name is required";
  }
  if (!data.phoneNo || data.phoneNo.length < 11) {
    return "Phone number is required";
  }
  if (data.deliveryNotes && data.deliveryNotes.length > 500) {
    return "Delivery notes must not exceed 500 characters";
  }
  if (!data.city || data.city.length < 1 || data.city.length > 100) {
    return "City is required ";
  }
  if (data.state && data.state.length > 100) {
    return "State must not exceed 100 characters";
  }
  if (data.country && data.country.length > 100) {
    return "Country must not exceed 100 characters";
  }
  if (
    !data.postalCode &&
    (data.postalCode.length < 1 || data.postalCode.length > 20)
  ) {
    return "Postal code is required";
  }
  return null; // No errors
};

const AddressFormModal: React.FC<AddressFormModalProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<
    Omit<Address, "id" | "createdAt" | "updatedAt" | "userId" | "isActive"> & {
      isActive?: boolean;
    }
  >({
    flatNo: "",
    floorNo: "",
    addressLine: "",
    name: "",
    phoneNo: "",
    deliveryNotes: "",
    city: "",
    state: "",
    country: "Bangladesh",
    postalCode: "",
    isActive: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        flatNo: initialData.flatNo || "",
        floorNo: initialData.floorNo || "",
        addressLine: initialData.addressLine,
        name: initialData.name,
        phoneNo: initialData.phoneNo,
        deliveryNotes: initialData.deliveryNotes || "",
        city: initialData.city,
        state: initialData.state || "",
        country: initialData.country,
        postalCode: initialData.postalCode || "",
        isActive: initialData.isActive,
      });
    } else {
      setFormData({
        flatNo: "",
        floorNo: "",
        addressLine: "",
        name: "",
        phoneNo: "",
        deliveryNotes: "",
        city: "",
        state: "",
        country: "Bangladesh",
        postalCode: "",
        isActive: false,
      });
    }
  }, [initialData]);

  const handleSave = () => {
    const error = validateAddress(formData);
    console.log("error----------------------", error);
    if (error) {
      Alert.alert("Validation Error", error);
      return;
    }
    onSave(formData);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {initialData ? "Edit Address" : "Add New Address"}
              </Text>

              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.inputLabel}>Flat No *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Flat No *"
                  placeholderTextColor="#999"
                  value={formData.flatNo}
                  onChangeText={(text) =>
                    setFormData({ ...formData, flatNo: text })
                  }
                  returnKeyType="next"
                />
                <Text style={styles.inputLabel}>Floor No *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Floor No *"
                  placeholderTextColor="#999"
                  value={formData.floorNo}
                  onChangeText={(text) =>
                    setFormData({ ...formData, floorNo: text })
                  }
                  returnKeyType="next"
                />
                <Text style={styles.inputLabel}>Address Line *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Address Line *"
                  placeholderTextColor="#999"
                  value={formData.addressLine}
                  onChangeText={(text) =>
                    setFormData({ ...formData, addressLine: text })
                  }
                  returnKeyType="next"
                />
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Name *"
                  placeholderTextColor="#999"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                  returnKeyType="next"
                />
                <Text style={styles.inputLabel}>Phone No *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Phone No *"
                  placeholderTextColor="#999"
                  value={formData.phoneNo}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phoneNo: text })
                  }
                  keyboardType="phone-pad"
                  returnKeyType="next"
                />
                <Text style={styles.inputLabel}>Delivery Notes</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Delivery Notes"
                  placeholderTextColor="#999"
                  value={formData.deliveryNotes}
                  onChangeText={(text) =>
                    setFormData({ ...formData, deliveryNotes: text })
                  }
                  returnKeyType="next"
                />
                <Text style={styles.inputLabel}>City *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="City *"
                  placeholderTextColor="#999"
                  value={formData.city}
                  onChangeText={(text) =>
                    setFormData({ ...formData, city: text })
                  }
                  returnKeyType="next"
                />
                <Text style={styles.inputLabel}>State</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="State"
                  placeholderTextColor="#999"
                  value={formData.state}
                  onChangeText={(text) =>
                    setFormData({ ...formData, state: text })
                  }
                  returnKeyType="next"
                />
                <Text style={styles.inputLabel}>Country *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Country *"
                  placeholderTextColor="#999"
                  value={formData.country}
                  onChangeText={(text) =>
                    setFormData({ ...formData, country: text })
                  }
                  returnKeyType="next"
                />
                <Text style={styles.inputLabel}>Postal Code *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Postal Code *"
                  placeholderTextColor="#999"
                  value={formData.postalCode}
                  onChangeText={(text) =>
                    setFormData({ ...formData, postalCode: text })
                  }
                  keyboardType="number-pad"
                  returnKeyType="done"
                />
              </ScrollView>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>
                    {initialData ? "Update" : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
    marginLeft: 2,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoidingView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "90%",
    maxHeight: "85%",
    overflow: "hidden",
  },
  scrollView: {
    maxHeight: "75%",
  },
  scrollViewContent: {
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    textAlign: "center",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: deepGreenColor,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  saveButtonText: {
    color: yellowColor,
    fontSize: 14,
    fontWeight: "600",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default AddressFormModal;
