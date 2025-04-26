import { View, Text, StyleSheet } from "react-native";

export default function CheeseScreen() {
  return (
    <View style={styles.container}>
      <Text>All Cheese Here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
