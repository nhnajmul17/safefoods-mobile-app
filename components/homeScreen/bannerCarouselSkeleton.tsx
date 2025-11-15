import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { useEffect, useRef } from "react";

const { width } = Dimensions.get("window");

const BannerCarouselSkeleton = () => {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();

    return () => {
      opacityAnim.stopAnimation();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.skeletonBanner, { opacity: opacityAnim }]}
      />

      {/* Pagination dots skeleton */}
      <View style={styles.pagination}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.paginationDot} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  skeletonBanner: {
    width: width - 32,
    height: 200,
    backgroundColor: "#e0e0e0",
    borderRadius: 15,
    marginHorizontal: 16,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 4,
  },
});

export default BannerCarouselSkeleton;
