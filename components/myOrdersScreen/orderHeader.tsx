import { View, Text, StyleSheet } from "react-native";

export default function OrderHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.subtitle}>View and track your order history</Text>
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
});
