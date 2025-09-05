import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  ProductVariant,
  ShopNowProduct,
} from "../shopNowScreen/shopNowProductCard";
import { Colors, deepGreenColor, yellowColor } from "@/constants/Colors";
import { Link } from "expo-router";

interface QuantityMap {
  [productId: string]: number;
}

interface CategoryProductCardProps {
  item: ShopNowProduct;
  quantity: number;
  selectedVariant: ProductVariant;
  setSelectedVariants: React.Dispatch<
    React.SetStateAction<{ [productId: string]: ProductVariant }>
  >;
  setQuantities: React.Dispatch<React.SetStateAction<QuantityMap>>;
  handleAddToCart: (
    item: ShopNowProduct,
    selectedVariant: ProductVariant
  ) => void;
  isSingleItem?: boolean;
}

const { width: screenWidth } = Dimensions.get("window");

const CategoryProductCard = ({
  item,
  quantity,
  selectedVariant,
  setSelectedVariants,
  setQuantities,
  handleAddToCart,
  isSingleItem = false,
}: CategoryProductCardProps) => {
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.95);

  // Function to ensure HTTPS
  const ensureHttps = (url: string): string => {
    if (url.startsWith("http://")) {
      return url.replace("http://", "https://");
    }
    return url;
  };

  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 300 });
    cardScale.value = withTiming(1, { duration: 300 });
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariants((prev) => ({ ...prev, [item.id]: variant }));
  };

  const handleQuantityChange = (delta: number) => {
    setQuantities((prev: QuantityMap) => {
      const newQty = Math.max((prev[item.id] || 0) + delta, 0);
      return { ...prev, [item.id]: newQty };
    });
  };

  const cardWidth = isSingleItem
    ? screenWidth / 2 - 24 // Half screen width minus padding (16 from container + 8 for margins)
    : "48%";

  return (
    <Animated.View
      style={[styles.productCard, { width: cardWidth }, cardStyle]}
    >
      <Link href={`/(tabs)/category/(product-details)/${item.slug}`}>
        <Image
          source={{
            uri: selectedVariant.mediaItems?.[0]?.mediaUrl
              ? ensureHttps(selectedVariant.mediaItems[0].mediaUrl)
              : "https://via.placeholder.com/50",
          }}
          style={styles.productImage}
          resizeMode="cover"
          onError={(e) =>
            console.log(
              `Product image load error (${item.title}):`,
              e.nativeEvent.error
            )
          }
        />
      </Link>
      <View style={styles.contentContainer}>
        <Text style={styles.productName}>{item.title}</Text>
        <Text style={styles.productCategory}>{item.categoryTitle}</Text>

        <View style={styles.variantContainer}>
          {item.variants.map((variant) => (
            <TouchableOpacity
              key={variant.id}
              style={[
                styles.variantBadge,
                selectedVariant.id === variant.id &&
                  styles.selectedVariantBadge,
              ]}
              onPress={() => handleVariantChange(variant)}
            >
              <Text
                style={[
                  styles.variantText,
                  selectedVariant.id === variant.id &&
                    styles.selectedVariantText,
                ]}
              >
                {variant.unitTitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>৳{selectedVariant.price}</Text>
          {selectedVariant.originalPrice > selectedVariant.price && (
            <Text style={styles.originalPrice}>
              ৳{selectedVariant.originalPrice}
            </Text>
          )}
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => handleQuantityChange(-1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => handleQuantityChange(1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {quantity > 0 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item, selectedVariant)}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

export default CategoryProductCard;

const styles = StyleSheet.create({
  productCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    backgroundColor: Colors.light.background,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  contentContainer: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
    textAlign: "center",
  },
  productCategory: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    textAlign: "center",
  },
  variantContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 4,
  },
  variantBadge: {
    backgroundColor: "#eee",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 2,
  },
  selectedVariantBadge: {
    backgroundColor: deepGreenColor,
  },
  variantText: {
    fontSize: 12,
    color: "#333",
  },
  selectedVariantText: {
    color: yellowColor,
    fontWeight: "600",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: deepGreenColor,
    fontWeight: "600",
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
    marginLeft: 4,
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
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: deepGreenColor,
    marginHorizontal: 4,
  },
  quantityButtonText: {
    fontSize: 16,
    color: deepGreenColor,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 4,
  },
  addButton: {
    backgroundColor: deepGreenColor,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  addButtonText: {
    color: yellowColor,
    fontSize: 12,
    fontWeight: "600",
  },
});
