import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const NoInternetScreen = () => {
  const [spinAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleRetry = () => {
    // Optionally, you can trigger a NetInfo refresh or reload the app
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Image
          source={require("../assets/images/safefoods-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.subtitle}>
        Oops! It looks like you're offline. Please check your internet
        connection and try again.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleRetry}
        activeOpacity={0.8}
      >
        <MaterialIcons name="refresh" size={24} color="#fff" />
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    padding: 24,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 28,
    borderRadius: 32,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#a5d6a7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1b5e20",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#388e3c",
    textAlign: "center",
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#43a047",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});

export default NoInternetScreen;
