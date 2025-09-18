import { View, Text, StyleSheet } from "react-native";

interface OrderHeaderProps {
  isGuest?: boolean;
}

export default function OrderHeader({ isGuest = false }: OrderHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.subtitle}>View and track your order history</Text>
      {isGuest && (
        <Text style={styles.guestNote}>
          Note: Guest orders are stored on this device only
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  guestNote: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
    fontStyle: "italic",
  },
});
