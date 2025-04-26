import { View, Text, StyleSheet } from "react-native";

export default function VegetablesScreen() {
  return (
    <View style={styles.container}>
      <Text>All Vegetables Here</Text>
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
