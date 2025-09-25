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
import { ensureHttps } from "@/utils/imageUtils";
import { useCartStore } from "@/store/cartStore";
import Icon from "react-native-vector-icons/MaterialIcons";

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
    selectedVariant: ProductVariant,
    newQuantity: number
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
  const { cartItems } = useCartStore();
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.95);

  // Find if this product variant is already in cart
  const cartItem = cartItems.find(
    (cartItem) =>
      cartItem.id === item.id && cartItem.variantId === selectedVariant.id
  );

  const currentQuantity = cartItem ? cartItem.quantity : 0;

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

  const handleAddToCartDirect = () => {
    handleAddToCart(item, selectedVariant, 1);
  };

  const handleIncrease = () => {
    handleAddToCart(item, selectedVariant, currentQuantity + 1);
  };

  const handleDecrease = () => {
    if (currentQuantity > 1) {
      handleAddToCart(item, selectedVariant, currentQuantity - 1);
    } else {
      handleAddToCart(item, selectedVariant, 0); // Remove from cart
    }
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
        <Link href={`/(tabs)/category/(product-details)/${item.slug}`}>
          <Text style={styles.productName}>{item.title}</Text>
        </Link>
        <Text style={styles.productCategory}>{item.categoryTitle}</Text>

        {/* <View style={styles.variantContainer}>
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
        </View> */}

        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>৳{selectedVariant.price}</Text>
          {selectedVariant.originalPrice > selectedVariant.price && (
            <Text style={styles.originalPrice}>
              ৳{selectedVariant.originalPrice}
            </Text>
          )}
        </View>

        {/* Cart Section */}
        <View style={styles.cartSection}>
          {currentQuantity === 0 ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCartDirect}
            >
              <Text style={styles.addButtonText}>ADD</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={handleDecrease}
                style={styles.quantityButton}
              >
                <Icon name="remove" size={15} color={yellowColor} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{currentQuantity}</Text>
              <TouchableOpacity
                onPress={handleIncrease}
                style={styles.quantityButton}
              >
                <Icon name="add" size={15} color={yellowColor} />
              </TouchableOpacity>
            </View>
          )}
        </View>
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
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    color: deepGreenColor,
    fontWeight: "900",
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
    marginLeft: 4,
  },
  cartSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: deepGreenColor,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    minWidth: 60,
  },
  addButtonText: {
    color: yellowColor,
    fontSize: 12,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: deepGreenColor,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 8,
    minWidth: 80,
  },
  quantityButton: {
    paddingHorizontal: 4,
  },
  quantityText: {
    fontSize: 14,
    color: yellowColor,
    fontWeight: "bold",
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: "center",
  },
});
