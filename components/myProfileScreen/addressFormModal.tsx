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
    return "Address line is required and must be between 1 and 500 characters";
  }
  if (data.flatNo && (data.flatNo.length < 1 || data.flatNo.length > 100)) {
    return "Flat number must be between 1 and 100 characters";
  }
  if (data.floorNo && (data.floorNo.length < 1 || data.floorNo.length > 100)) {
    return "Floor number must be between 1 and 100 characters";
  }
  if (!data.name || data.name.length < 1 || data.name.length > 100) {
    return "Name is required and must be between 1 and 100 characters";
  }
  if (!data.phoneNo || data.phoneNo.length < 11) {
    return "Phone number is required and must be at least 11 characters long";
  }
  if (data.deliveryNotes && data.deliveryNotes.length > 500) {
    return "Delivery notes must not exceed 500 characters";
  }
  if (!data.city || data.city.length < 1 || data.city.length > 100) {
    return "City is required and must be between 1 and 100 characters";
  }
  if (data.state && data.state.length > 100) {
    return "State must not exceed 100 characters";
  }
  if (data.country && data.country.length > 100) {
    return "Country must not exceed 100 characters";
  }
  if (
    data.postalCode &&
    (data.postalCode.length < 1 || data.postalCode.length > 20)
  ) {
    return "Postal code must be between 1 and 20 characters";
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
    if (error) {
      Alert.alert("Validation Error", error);
      return;
    }
    onSave(formData);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {initialData ? "Edit Address" : "Add New Address"}
          </Text>
          <TextInput
            style={styles.formInput}
            placeholder="Flat No *"
            value={formData.flatNo}
            onChangeText={(text) => setFormData({ ...formData, flatNo: text })}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Floor No *"
            value={formData.floorNo}
            onChangeText={(text) => setFormData({ ...formData, floorNo: text })}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Address Line *"
            value={formData.addressLine}
            onChangeText={(text) =>
              setFormData({ ...formData, addressLine: text })
            }
          />
          <TextInput
            style={styles.formInput}
            placeholder="Name *"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Phone No *"
            value={formData.phoneNo}
            onChangeText={(text) => setFormData({ ...formData, phoneNo: text })}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.formInput}
            placeholder="Delivery Notes *"
            value={formData.deliveryNotes}
            onChangeText={(text) =>
              setFormData({ ...formData, deliveryNotes: text })
            }
          />
          <TextInput
            style={styles.formInput}
            placeholder="City *"
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
          />
          <TextInput
            style={styles.formInput}
            placeholder="State *"
            value={formData.state}
            onChangeText={(text) => setFormData({ ...formData, state: text })}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Country *"
            value={formData.country}
            onChangeText={(text) => setFormData({ ...formData, country: text })}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Postal Code *"
            value={formData.postalCode}
            onChangeText={(text) =>
              setFormData({ ...formData, postalCode: text })
            }
            keyboardType="number-pad"
          />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>
                {initialData ? "Update" : "Save"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: deepGreenColor,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: yellowColor,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddressFormModal;
