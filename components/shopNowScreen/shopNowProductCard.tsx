import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { deepGreenColor, yellowColor } from "@/constants/Colors";
import { Link } from "expo-router";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import Icon from "react-native-vector-icons/MaterialIcons";
import { API_URL } from "@/constants/variables";
import Toast from "react-native-toast-message";

export interface ProductVariant {
  id: string;
  price: number;
  originalPrice: number;
  description: string;
  bestDeal: boolean;
  discountedSale: boolean;
  unitTitle: string;
  mediaItems?: Array<{
    id: string;
    mediaId: string;
    mediaUrl: string;
    mediaTitle: string;
  }>;
}

export interface ShopNowProduct {
  id: string;
  title: string;
  categoryTitle: string;
  categorySlug?: string;
  variants: ProductVariant[];
}

type ProductCardProps = {
  item: ShopNowProduct;
  onAddToCart: (
    item: ShopNowProduct,
    selectedVariant: ProductVariant,
    quantity: number
  ) => void;
};

// Get screen width to calculate card width
const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth - 16 - 80 - 8; // 16: padding, 80: category list width, 8: gap

const ShopNowProductCard = ({ item, onAddToCart }: ProductCardProps) => {
  const { cartItems } = useCartStore();
  const { userId, accessToken } = useAuthStore();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    item.variants[0]
  );
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.95);

  // Find if this product variant is already in cart
  const cartItem = cartItems.find(
    (cartItem) =>
      cartItem.id === item.id && cartItem.variantId === selectedVariant.id
  );

  const quantity = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 300 });
    cardScale.value = withTiming(1, { duration: 300 });
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCartDirect = () => {
    onAddToCart(item, selectedVariant, 1);
  };

  const handleIncrease = () => {
    onAddToCart(item, selectedVariant, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onAddToCart(item, selectedVariant, quantity - 1);
    } else {
      onAddToCart(item, selectedVariant, 0); // Remove from cart
    }
  };

  return (
    <Animated.View
      style={[styles.productCard, cardStyle, { width: cardWidth }]}
    >
      <View style={styles.cardContent}>
        {/* Product Image - Left side covering full height */}
        <Link href={`/(tabs)/shop-now/(product-details)/${item.id}`} asChild>
          <TouchableOpacity>
            <Image
              source={{
                uri:
                  selectedVariant.mediaItems?.[0]?.mediaUrl ||
                  "https://cdn-icons-png.flaticon.com/512/2153/2153788.png",
              }}
              style={styles.productImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </Link>

        {/* Product Details - Right side */}
        <View style={styles.productDetails}>
          {/* Product Name - Top section */}
          <Text style={styles.productName} numberOfLines={2}>
            {item.title}
          </Text>

          {/* Variants - Below product name */}
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
                  numberOfLines={1}
                >
                  {variant.unitTitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price - Below variants */}
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>৳{selectedVariant.price}</Text>
            {selectedVariant.originalPrice > selectedVariant.price && (
              <Text style={styles.originalPrice}>
                ৳{selectedVariant.originalPrice}
              </Text>
            )}
          </View>

          {/* Add to Cart / Quantity Controls - Bottom section */}
          <View style={styles.cartSection}>
            {quantity === 0 ? (
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
                  <Icon style={styles.quantityButtonText} name="remove" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  onPress={handleIncrease}
                  style={styles.quantityButton}
                >
                  <Icon style={styles.quantityButtonText} name="add" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default ShopNowProductCard;

const styles = StyleSheet.create({
  productCard: {
    marginBottom: 12, // Reduced from 16
    borderRadius: 10, // Reduced from 12
    overflow: "hidden",
    elevation: 3, // Reduced from 4
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 }, // Reduced from 2
    shadowOpacity: 0.1,
    shadowRadius: 4, // Reduced from 6
    backgroundColor: "#fff",
  },
  cardContent: {
    flexDirection: "row",
    padding: 10, // Reduced from 12
  },
  productImage: {
    width: 85, // Reduced from 100
    height: 85, // Reduced from 100
    borderRadius: 6, // Reduced from 8
    marginRight: 10, // Reduced from 12
  },
  productDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 14, // Reduced from 16
    fontWeight: "700",
    color: "#333",
    marginBottom: 6, // Reduced from 8
  },
  variantContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6, // Reduced from 8
  },
  variantBadge: {
    backgroundColor: "#eee",
    borderRadius: 4, // Reduced from 6
    paddingVertical: 3, // Reduced from 4
    paddingHorizontal: 6, // Reduced from 8
    marginRight: 3, // Reduced from 4
    marginBottom: 3, // Reduced from 4
  },
  selectedVariantBadge: {
    backgroundColor: deepGreenColor,
  },
  variantText: {
    fontSize: 10, // Reduced from 11
    color: "#333",
  },
  selectedVariantText: {
    color: yellowColor,
    fontWeight: "600",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6, // Reduced from 8
  },
  productPrice: {
    fontSize: 16, // Reduced from 18
    color: deepGreenColor,
    fontWeight: "600",
  },
  originalPrice: {
    fontSize: 12, // Reduced from 14
    color: "#999",
    textDecorationLine: "line-through",
    marginLeft: 4, // Reduced from 6
  },
  cartSection: {
    alignSelf: "flex-start",
  },
  addButton: {
    backgroundColor: deepGreenColor,
    paddingVertical: 6, // Reduced from 8
    paddingHorizontal: 16, // Reduced from 20
    borderRadius: 5, // Reduced from 6
    alignItems: "center",
  },
  addButtonText: {
    color: yellowColor,
    fontSize: 12, // Reduced from 14
    fontWeight: "600",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: deepGreenColor,
    borderRadius: 5, // Reduced from 6
    paddingVertical: 3, // Reduced from 4
    paddingHorizontal: 6, // Reduced from 8
  },
  quantityButton: {
    paddingHorizontal: 4, // Reduced from 6
  },
  quantityButtonText: {
    fontSize: 18, // Reduced from 20
    color: yellowColor,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 13, // Reduced from 14
    fontWeight: "600",
    color: yellowColor,
    marginHorizontal: 6, // Reduced from 8
  },
});
