import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useEffect } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { greenColor } from "@/constants/Colors";

export type ShopNowProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  unit?: string;
};

type ProductCardProps = {
  item: ShopNowProduct;
  quantity: number;
  onIncrease: (item: ShopNowProduct) => void;
  onDecrease: (item: ShopNowProduct) => void;
  onAddToCart: (item: ShopNowProduct) => void;
};

const ShopNowProductCard = ({
  item,
  quantity,
  onIncrease,
  onDecrease,
  onAddToCart,
}: ProductCardProps) => {
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.95);

  useEffect(() => {
    cardOpacity.value = withDelay(
      parseInt(item.id) * 100,
      withTiming(1, { duration: 400 })
    );
    cardScale.value = withSpring(1, { damping: 10, stiffness: 100 });
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  return (
    <Animated.View style={[styles.productCard, cardStyle]}>
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        resizeMode="cover"
      />
      {/* <View style={styles.gradientOverlay} /> */}
      <View style={styles.contentContainer}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>
          ${item.price.toFixed(2)} / {item.unit || "item"}
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => onDecrease(item)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => onIncrease(item)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        {quantity > 0 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onAddToCart(item)}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

export default ShopNowProductCard;

const styles = StyleSheet.create({
  productCard: {
    width: "32%", // Adjusted for 3 columns with spacing
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  productImage: {
    width: "100%",
    height: 120, // Reduced height for 3-column layout
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120, // Match image height
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  contentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 2, // Reduced padding
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  productName: {
    fontSize: 14, // Reduced font size for compactness
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 12, // Reduced font size
    color: greenColor,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  quantityButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: greenColor,
    marginHorizontal: 3,
  },
  quantityButtonText: {
    fontSize: 16,
    color: greenColor,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 6,
  },
  addButton: {
    backgroundColor: greenColor,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 2,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12, // Reduced font size
    fontWeight: "600",
  },
});
