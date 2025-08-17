import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProtectedRoute from "@/components/auth/protectedRoute";
import { useAuthStore } from "@/store/authStore";
import Toast from "react-native-toast-message";
import { API_URL } from "@/constants/variables";
import ProfileHeader from "@/components/myProfileScreen/profileHeader";
import Icon from "react-native-vector-icons/MaterialIcons";
import AddressCard from "@/components/myProfileScreen/addressCard";
import AddressFormModal from "@/components/myProfileScreen/addressFormModal";
import { deepGreenColor, yellowColor } from "@/constants/Colors";

export interface Address {
  id?: string;
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

export default function MyProfileScreen() {
  const { userId, userName, userEmail } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState<string>(userName ?? "John Abram");
  const [email, setEmail] = useState<string>(
    userEmail ?? "johnabram@gmail.com"
  );
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${API_URL}/v1/addresses/user/${userId}`);
      const data = await response.json();
      if (data.success) {
        setAddresses(data.data);
      } else {
        Toast.show({ type: "error", text1: "Error", text2: data.message });
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch addresses",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add save logic here (e.g., API call)
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(userName ?? "John Abram");
    setEmail(userEmail ?? "johnabram@gmail.com");
  };

  const handleAddOrEditAddress = (address?: Address) => {
    setSelectedAddress(address || null);
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (
    formData: Omit<
      Address,
      "id" | "createdAt" | "updatedAt" | "userId" | "isActive"
    > & {
      isActive?: boolean;
    }
  ) => {
    const url = selectedAddress
      ? `${API_URL}/v1/addresses/${selectedAddress.id}`
      : `${API_URL}/v1/addresses/`;
    const method = selectedAddress ? "PATCH" : "POST";
    const body = {
      userId, // Explicitly use userId from useAuthStore
      ...formData,
      ...(selectedAddress && {
        isActive: formData.isActive ?? selectedAddress.isActive,
      }),
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: `Address ${selectedAddress ? "updated" : "added"
            } successfully`,
        });
        setShowAddressModal(false);
        fetchAddresses();
      } else {
        Toast.show({ type: "error", text1: "Error", text2: data.message });
      }
    } catch (error) {
      console.error("Error saving address:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save address",
      });
    }
  };

  const handleDeleteAddress = (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/v1/addresses/${id}`, {
                method: "DELETE",
              });
              const data = await response.json();
              if (data.success) {
                Toast.show({
                  type: "success",
                  text1: "Success",
                  text2: "Address deleted",
                });
                fetchAddresses();
              } else {
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2: data.message,
                });
              }
            } catch (error) {
              console.error("Error deleting address:", error);
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to delete address",
              });
            }
          },
        },
      ]
    );
  };

  const handleSetActive = async (id: string, currentActive: boolean) => {
    const address = addresses.find((a) => a.id === id);
    if (!address) return;

    try {
      const response = await fetch(`${API_URL}/v1/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      const data = await response.json();
      if (data.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: `Address ${!currentActive ? "activated" : "deactivated"}`,
        });
        fetchAddresses();
      } else {
        Toast.show({ type: "error", text1: "Error", text2: data.message });
      }
    } catch (error) {
      console.error("Error setting active address:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update active status",
      });
    }
  };

  return (
    <ProtectedRoute>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <ProfileHeader
            name={name}
            email={email}
            isEditing={isEditing}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onNameChange={setName}
            onEmailChange={setEmail}
          />
          <View style={styles.addressSection}>
            <Text style={styles.sectionTitle}>Manage Addresses</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddOrEditAddress()}
            >
              <Icon name="add" size={20} color={yellowColor} />
              <Text style={styles.addButtonText}>Add New Address</Text>
            </TouchableOpacity>
            {addresses.length > 0 && (
              <View style={styles.addressList}>
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={() => handleAddOrEditAddress(address)}
                    onDelete={handleDeleteAddress}
                    onSetActive={handleSetActive}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
        <AddressFormModal
          visible={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          onSave={handleSaveAddress}
          initialData={selectedAddress}
        />
        <Toast />
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 20,
  },
  addressSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: deepGreenColor,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: {
    color: yellowColor,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  addressList: {},
});
