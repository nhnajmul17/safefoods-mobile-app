import { Colors, deepGreenColor, yellowColor } from "@/constants/Colors";
import { useRef, useEffect } from "react";
import { Animated, SafeAreaView, StyleSheet, Text, View } from "react-native";

type CustomLoaderProps = {
  isLoading: boolean;
  loadingText?: string;
};

export const CustomLoader = ({
  isLoading,
  loadingText = "Loading...",
}: CustomLoaderProps) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  // Start scale animation
  useEffect(() => {
    if (isLoading) {
      const scaleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      scaleAnimation.start();

      return () => scaleAnimation.stop(); // Cleanup on unmount or when isLoading changes
    }
  }, [isLoading, scaleValue]);

  if (!isLoading) return null; // Render nothing if not loading

  return (
    <SafeAreaView style={styles.loaderContainer}>
      <Animated.View
        style={[
          styles.loader,
          { transform: [{ scale: scaleValue }] }, // Apply scale animation
        ]}
      >
        <View
          style={[
            styles.loaderCircle,
            { width: 60, height: 60, backgroundColor: deepGreenColor },
          ]}
        />
        <View
          style={[
            styles.loaderCircle,
            {
              width: 40,
              height: 40,
              backgroundColor: yellowColor,
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
              backgroundColor: deepGreenColor,
              position: "absolute",
            },
          ]}
        />
      </Animated.View>
      <Text style={styles.loaderText}>{loadingText}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
