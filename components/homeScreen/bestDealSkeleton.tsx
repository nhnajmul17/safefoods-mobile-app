import { View, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";

const BestDealSkeleton = () => {
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
      {/* Horizontal Scrollable Skeleton List */}
      <View style={styles.productsContainer}>
        {[1, 2, 3, 4].map((item) => (
          <Animated.View
            key={item}
            style={[styles.skeletonCard, { opacity: opacityAnim }]}
          >
            {/* Image placeholder */}
            <View style={styles.skeletonImage} />

            <View style={styles.skeletonContent}>
              {/* Product name placeholder */}
              <View style={styles.skeletonTextLine} />

              {/* Category placeholder */}
              <View style={[styles.skeletonTextLine, { width: "60%" }]} />

              {/* Variants placeholder */}
              <View style={styles.skeletonVariantContainer}>
                <View style={styles.skeletonVariant} />
                <View style={styles.skeletonVariant} />
              </View>

              {/* Price placeholder */}
              <View style={styles.skeletonPriceContainer}>
                <View style={styles.skeletonPrice} />
                <View style={[styles.skeletonPrice, { width: 40 }]} />
              </View>

              {/* Quantity controls placeholder */}
              <View style={styles.skeletonQuantityContainer}>
                <View style={styles.skeletonQuantityButton} />
                <View style={styles.skeletonQuantityText} />
                <View style={styles.skeletonQuantityButton} />
              </View>

              {/* Add to cart button placeholder */}
              <View style={styles.skeletonAddButton} />
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
  },
  productsContainer: {
    flexDirection: "row",
    paddingLeft: 0,
    marginTop: 16,
    marginBottom: 16,
  },
  skeletonCard: {
    width: 150,
    marginRight: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    backgroundColor: "#fff",
  },
  skeletonImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#e0e0e0",
  },
  skeletonContent: {
    padding: 8,
  },
  skeletonTextLine: {
    height: 14,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 6,
    width: "80%",
  },
  skeletonVariantContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  skeletonVariant: {
    width: 40,
    height: 24,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginHorizontal: 2,
  },
  skeletonPriceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  skeletonPrice: {
    width: 50,
    height: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginHorizontal: 2,
  },
  skeletonQuantityContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  skeletonQuantityButton: {
    width: 24,
    height: 24,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginHorizontal: 4,
  },
  skeletonQuantityText: {
    width: 20,
    height: 14,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  skeletonAddButton: {
    height: 32,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
  },
});

export default BestDealSkeleton;
