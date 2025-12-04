import { Address } from "@/app/my-profile";
import { deepGreenColor, yellowColor } from "@/constants/Colors";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
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
  // Required field: Address Line
  if (!data.addressLine || data.addressLine.trim().length === 0) {
    return "Address Line is required";
  }
  if (data.addressLine.length > 500) {
    return "Address Line must not exceed 500 characters";
  }

  // Required field: Name
  if (!data.name || data.name.trim().length === 0) {
    return "Name is required";
  }
  if (data.name.length > 100) {
    return "Name must not exceed 100 characters";
  }

  // Required field: Phone Number
  if (!data.phoneNo || data.phoneNo.trim().length === 0) {
    return "Phone Number is required";
  }
  if (data.phoneNo.length < 11) {
    return "Phone Number must be at least 11 digits";
  }

  // Required field: City
  if (!data.city || data.city.trim().length === 0) {
    return "City is required";
  }
  if (data.city.length > 100) {
    return "City must not exceed 100 characters";
  }

  // Optional field validations
  if (data.flatNo && data.flatNo.length > 50) {
    return "Flat No must not exceed 50 characters";
  }
  if (data.floorNo && data.floorNo.length > 50) {
    return "Floor No must not exceed 50 characters";
  }
  if (data.deliveryNotes && data.deliveryNotes.length > 500) {
    return "Delivery Notes must not exceed 500 characters";
  }
  if (data.state && data.state.length > 100) {
    return "State must not exceed 100 characters";
  }
  if (data.country && data.country.length > 100) {
    return "Country must not exceed 100 characters";
  }
  if (data.postalCode && data.postalCode.length > 20) {
    return "Postal Code must not exceed 20 characters";
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

  // Create refs for each input field
  const flatNoRef = useRef<TextInput>(null);
  const floorNoRef = useRef<TextInput>(null);
  const addressLineRef = useRef<TextInput>(null);
  const nameRef = useRef<TextInput>(null);
  const phoneNoRef = useRef<TextInput>(null);
  const deliveryNotesRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const countryRef = useRef<TextInput>(null);
  const postalCodeRef = useRef<TextInput>(null);

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

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const { height: screenHeight } = Dimensions.get("window");

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { maxHeight: screenHeight * 0.85 }]}
          >
            <Text style={styles.modalTitle}>
              {initialData ? "Edit Address" : "Add New Address"}
            </Text>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.inputLabel}>Flat No</Text>
              <TextInput
                ref={flatNoRef}
                style={styles.formInput}
                placeholder="Flat No"
                placeholderTextColor="#999"
                value={formData.flatNo}
                onChangeText={(text) =>
                  setFormData({ ...formData, flatNo: text })
                }
                returnKeyType="next"
                onSubmitEditing={() => floorNoRef.current?.focus()}
                blurOnSubmit={false}
              />
              <Text style={styles.inputLabel}>Floor No</Text>
              <TextInput
                ref={floorNoRef}
                style={styles.formInput}
                placeholder="Floor No"
                placeholderTextColor="#999"
                value={formData.floorNo}
                onChangeText={(text) =>
                  setFormData({ ...formData, floorNo: text })
                }
                returnKeyType="next"
                onSubmitEditing={() => addressLineRef.current?.focus()}
                blurOnSubmit={false}
              />
              <Text style={styles.inputLabel}>Address Line *</Text>
              <TextInput
                ref={addressLineRef}
                style={styles.formInput}
                placeholder="Address Line *"
                placeholderTextColor="#999"
                value={formData.addressLine}
                onChangeText={(text) =>
                  setFormData({ ...formData, addressLine: text })
                }
                returnKeyType="next"
                onSubmitEditing={() => nameRef.current?.focus()}
                blurOnSubmit={false}
              />
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                ref={nameRef}
                style={styles.formInput}
                placeholder="Name *"
                placeholderTextColor="#999"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                returnKeyType="next"
                onSubmitEditing={() => phoneNoRef.current?.focus()}
                blurOnSubmit={false}
              />
              <Text style={styles.inputLabel}>Phone No *</Text>
              <TextInput
                ref={phoneNoRef}
                style={styles.formInput}
                placeholder="Phone No *"
                placeholderTextColor="#999"
                value={formData.phoneNo}
                onChangeText={(text) =>
                  setFormData({ ...formData, phoneNo: text })
                }
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => deliveryNotesRef.current?.focus()}
                blurOnSubmit={false}
              />
              <Text style={styles.inputLabel}>Delivery Notes</Text>
              <TextInput
                ref={deliveryNotesRef}
                style={styles.formInput}
                placeholder="Delivery Notes"
                placeholderTextColor="#999"
                value={formData.deliveryNotes}
                onChangeText={(text) =>
                  setFormData({ ...formData, deliveryNotes: text })
                }
                returnKeyType="next"
                onSubmitEditing={() => cityRef.current?.focus()}
                blurOnSubmit={false}
              />
              <Text style={styles.inputLabel}>City *</Text>
              <TextInput
                ref={cityRef}
                style={styles.formInput}
                placeholder="City *"
                placeholderTextColor="#999"
                value={formData.city}
                onChangeText={(text) =>
                  setFormData({ ...formData, city: text })
                }
                returnKeyType="next"
                onSubmitEditing={() => stateRef.current?.focus()}
                blurOnSubmit={false}
              />
              <Text style={styles.inputLabel}>State</Text>
              <TextInput
                ref={stateRef}
                style={styles.formInput}
                placeholder="State"
                placeholderTextColor="#999"
                value={formData.state}
                onChangeText={(text) =>
                  setFormData({ ...formData, state: text })
                }
                returnKeyType="next"
                onSubmitEditing={() => countryRef.current?.focus()}
                blurOnSubmit={false}
              />
              <Text style={styles.inputLabel}>Country</Text>
              <TextInput
                ref={countryRef}
                style={styles.formInput}
                placeholder="Country"
                placeholderTextColor="#999"
                value={formData.country}
                onChangeText={(text) =>
                  setFormData({ ...formData, country: text })
                }
                returnKeyType="next"
                onSubmitEditing={() => postalCodeRef.current?.focus()}
                blurOnSubmit={false}
              />
              <Text style={styles.inputLabel}>Postal Code</Text>
              <TextInput
                ref={postalCodeRef}
                style={styles.formInput}
                placeholder="Postal Code"
                placeholderTextColor="#999"
                value={formData.postalCode}
                onChangeText={(text) =>
                  setFormData({ ...formData, postalCode: text })
                }
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={dismissKeyboard}
              />
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>
                  {initialData ? "Update" : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
    justifyContent: "flex-end",
    paddingBottom: Platform.OS === "android" ? 0 : 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: "100%",
    overflow: "hidden",
  },
  scrollView: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: Platform.OS === "android" ? 20 : 16,
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
