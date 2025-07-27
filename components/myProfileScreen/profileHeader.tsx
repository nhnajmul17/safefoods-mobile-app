import { greenColor } from "@/constants/Colors";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";

interface ProfileHeaderProps {
  name: string;
  email: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onNameChange: (text: string) => void;
  onEmailChange: (text: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onNameChange,
  onEmailChange,
}) => {
  return (
    <View style={styles.profileSection}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/44.jpg" }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.name}>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={onNameChange}
                autoFocus
              />
            ) : (
              name
            )}
          </Text>
          <Text style={styles.email}>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={onEmailChange}
                keyboardType="email-address"
              />
            ) : (
              email
            )}
          </Text>
        </View>
      </View>
      {isEditing ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  input: {
    fontSize: 16,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
    width: 200,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  editButton: {
    backgroundColor: greenColor,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#28a745",
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileHeader;
