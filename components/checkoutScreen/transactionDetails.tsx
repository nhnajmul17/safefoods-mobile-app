import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { FILE_UPLOAD_URL, UPLOADED_CDN_BASE_URL } from "@/constants/variables";
import { deepGreenColor, yellowColor } from "@/constants/Colors";

const getUploadFileType = (asset: ImagePicker.ImagePickerAsset): string => {
  if (asset.mimeType) return asset.mimeType;
  if (asset.type === "image") return "image/jpeg";
  return "application/octet-stream";
};

interface TransactionDetailsSectionProps {
  transactionNo: string;
  transactionPhoneNo: string;
  transactionDate: Date | null;
  paymentProof: string;
  onTransactionNoChange: (text: string) => void;
  onTransactionPhoneNoChange: (text: string) => void;
  onTransactionDateChange: (visible: boolean) => void;
  onPaymentProofChange: (url: string) => void;
}

export default function TransactionDetailsSection({
  transactionNo,
  transactionPhoneNo,
  transactionDate,
  paymentProof,
  onTransactionNoChange,
  onTransactionPhoneNoChange,
  onTransactionDateChange,
  onPaymentProofChange,
}: TransactionDetailsSectionProps) {
  const [uploadingProof, setUploadingProof] = useState(false);

  const handleDateConfirm = (date: Date) => {
    onTransactionDateChange(false); // Hide picker
    // No need to set state here; parent handles it
  };

  const handleUploadPaymentProof = async () => {
    try {
      // Request permissions
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission required",
          "Permission to access camera roll is required!",
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      if (!asset) return;

      // Process the URI for React Native
      let fileUri = asset.uri;
      const fileName = asset.fileName || `payment-proof-${Date.now()}.jpg`;

      // On Android, fetch upload can fail with content:// URIs; copy into cache as file:// first.
      if (Platform.OS === "android" && fileUri.startsWith("content://")) {
        const cachedFileUri = `${FileSystem.cacheDirectory}${fileName}`;
        await FileSystem.copyAsync({ from: fileUri, to: cachedFileUri });
        fileUri = cachedFileUri;
      }

      setUploadingProof(true);

      // Get file info using legacy API
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      // Create FormData as expected by server
      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        type: getUploadFileType(asset),
        name: fileName,
      } as any);
      formData.append("folder", "assets/payment-proofs");
      formData.append("bucketName", "assets");

      const uploadUrl = FILE_UPLOAD_URL;

      // Try fetch with proper headers for React Native file upload
      try {
        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
            // Don't set Content-Type for FormData - RN will set boundary
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response error:", errorText);
          throw new Error(`Upload failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        if (data?.data?.fileKey) {
          const fileName = data.data.fileKey;
          const uploadedUrl = `${UPLOADED_CDN_BASE_URL}/${fileName}`;
          onPaymentProofChange(uploadedUrl);
          Alert.alert("Success", "Payment proof uploaded successfully.");
        } else {
          throw new Error("Upload failed - no file key returned");
        }
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        // If fetch fails, show more specific error
        if (
          fetchError instanceof TypeError &&
          fetchError.message.includes("Network request failed")
        ) {
          Alert.alert(
            "Upload Failed",
            "Unable to connect to the upload server. Please check your internet connection and try again.",
          );
        } else {
          const errorMessage =
            fetchError instanceof Error
              ? fetchError.message
              : "Could not upload payment proof. Please try again.";
          Alert.alert("Upload failed", errorMessage);
        }
        throw fetchError;
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert(
        "Upload failed",
        "Could not upload payment proof. Please try again.",
      );
    } finally {
      setUploadingProof(false);
    }
  };

  const handleRemovePaymentProof = () => {
    Alert.alert(
      "Remove Payment Proof",
      "Are you sure you want to remove the uploaded payment proof?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => onPaymentProofChange(""),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Transaction No *"
        placeholderTextColor="#666"
        value={transactionNo}
        onChangeText={onTransactionNoChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Transaction Phone No *"
        placeholderTextColor="#666"
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
      <View style={styles.paymentProofContainer}>
        <Text style={styles.paymentProofLabel}>Payment Proof (Optional)</Text>
        {!paymentProof ? (
          <TouchableOpacity
            style={[
              styles.uploadButton,
              uploadingProof && styles.disabledButton,
            ]}
            onPress={handleUploadPaymentProof}
            disabled={uploadingProof}
          >
            <Text style={styles.uploadButtonText}>
              {uploadingProof ? "Uploading..." : "Select Image"}
            </Text>
            {uploadingProof && (
              <ActivityIndicator size="small" color={yellowColor} />
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.imagePreviewContainer}>
            <Text style={styles.previewLabel}>Uploaded proof</Text>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: paymentProof }}
                style={styles.imagePreview}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemovePaymentProof}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={handleUploadPaymentProof}
            >
              <Text style={styles.changeButtonText}>Change Image</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    paddingVertical: Platform.OS === "ios" ? 12 : 8, // Adjust padding for better visibility
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
  paymentProofContainer: {
    marginTop: 12,
  },
  paymentProofLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  uploadButton: {
    backgroundColor: deepGreenColor,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  uploadButtonText: {
    color: yellowColor,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  imagePreviewContainer: {
    alignItems: "center",
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ff4444",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 18,
  },
  changeButton: {
    backgroundColor: deepGreenColor,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  changeButtonText: {
    color: yellowColor,
    fontSize: 14,
    fontWeight: "600",
  },
});
