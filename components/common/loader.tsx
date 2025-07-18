import { Colors, lightGreenColor } from "@/constants/Colors";
import { useRef } from "react";
import { Animated, SafeAreaView, StyleSheet, Text, View } from "react-native";

export const CustomLoader = () => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  <SafeAreaView style={[styles.container, styles.loaderContainer]}>
    <Animated.View
      style={[
        styles.loader,
        { transform: [{ scale: scaleValue }] }, // Apply scale animation
      ]}
    >
      <View
        style={[
          styles.loaderCircle,
          { width: 60, height: 60, backgroundColor: lightGreenColor },
        ]}
      />
      <View
        style={[
          styles.loaderCircle,
          {
            width: 40,
            height: 40,
            backgroundColor: "#fff",
            position: "absolute",
          },
        ]}
      />
      <View
        style={[
          styles.loaderCircle,
          {
            width: 20,
            height: 20,
            backgroundColor: lightGreenColor,
            position: "absolute",
          },
        ]}
      />
    </Animated.View>
    <Text style={styles.loaderText}>Loading categories...</Text>
  </SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loader: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderCircle: {
    borderRadius: 30,
    position: "absolute",
    opacity: 0.7,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
});
