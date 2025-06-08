import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const handleOrderDetails = () => {
    router.push("/my-orders");
  };
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <TouchableOpacity onPress={() => handleOrderDetails()}>
        <Text style={styles.button}>Order List</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    marginTop: 20,
  },
});
