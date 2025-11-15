import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { useEffect, useRef } from "react";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48) / 2;

const SliderCarouselSkeleton = () => {
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
      <View style={styles.carouselContainer}>
        {[1, 2].map((item) => (
          <Animated.View
            key={item}
            style={[
              styles.skeletonItem,
              { opacity: opacityAnim, width: ITEM_WIDTH },
            ]}
          />
        ))}
      </View>

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
    marginVertical: 10,
  },
  carouselContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  skeletonItem: {
    height: 180,
    backgroundColor: "#e0e0e0",
    borderRadius: 15,
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

export default SliderCarouselSkeleton;
