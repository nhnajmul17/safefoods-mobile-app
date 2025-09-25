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
import Icon from "react-native-vector-icons/MaterialIcons";
import { ensureHttps } from "@/utils/imageUtils";

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
  slug: string;
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

  // Check if product has discount
  const hasDiscount = selectedVariant.originalPrice > selectedVariant.price;

  return (
    <Animated.View
      style={[styles.productCard, cardStyle, { width: cardWidth }]}
    >
      {/* Discount badge */}
      {hasDiscount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            {Math.round(
              ((selectedVariant.originalPrice - selectedVariant.price) /
                selectedVariant.originalPrice) *
                100
            )}
            % OFF
          </Text>
        </View>
      )}

      <View style={styles.cardContent}>
        {/* Product Image */}
        <Link
          href={`/(tabs)/shop-now/(product-details)/${item.slug}` as any}
          asChild
        >
          <TouchableOpacity style={styles.imageContainer}>
            <Image
              source={{
                uri: selectedVariant.mediaItems?.[0]?.mediaUrl
                  ? ensureHttps(selectedVariant.mediaItems[0].mediaUrl)
                  : "https://cdn-icons-png.flaticon.com/512/2153/2153788.png",
              }}
              style={styles.productImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </Link>

        {/* Product Details */}
        <View style={styles.productDetails}>
          {/* Product Name */}
          <Link
            href={`/(tabs)/shop-now/(product-details)/${item.slug}` as any}
            asChild
          >
            <Text style={styles.productName} numberOfLines={2}>
              {item.title}
            </Text>
          </Link>

          {/* Variants */}
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
                  numberOfLines={1}
                >
                  {variant.unitTitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View> */}

          {/* Price and Add to Cart / Quantity Controls in a row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Price */}
            <View style={styles.priceContainer}>
              <Text style={styles.productPrice}>৳{selectedVariant.price}</Text>
              {hasDiscount && (
                <Text style={styles.originalPrice}>
                  ৳{selectedVariant.originalPrice}
                </Text>
              )}
            </View>

            {/* Add to Cart / Quantity Controls */}
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
                    <Icon name="remove" size={15} color={yellowColor} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
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
        </View>
      </View>
    </Animated.View>
  );
};

export default ShopNowProductCard;

const styles = StyleSheet.create({
  productCard: {
    marginBottom: 12,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: "relative",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF4757",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  discountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  cardContent: {
    flexDirection: "row",
    padding: 10,
  },
  imageContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    lineHeight: 18,
  },
  variantContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  variantBadge: {
    backgroundColor: "#f1f3f4",
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginRight: 4,
    marginBottom: 4,
  },
  selectedVariantBadge: {
    backgroundColor: deepGreenColor,
  },
  variantText: {
    fontSize: 16,
    color: "#555",
  },
  selectedVariantText: {
    color: yellowColor,
    fontWeight: "600",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 6,
  },
  productPrice: {
    fontSize: 18,
    color: deepGreenColor,
    fontWeight: "700",
  },
  originalPrice: {
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
    marginLeft: 4,
  },
  cartSection: {
    alignSelf: "flex-start",
  },
  addButton: {
    backgroundColor: deepGreenColor,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: yellowColor,
    fontSize: 14,
    fontWeight: "600",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: deepGreenColor,
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  quantityButton: {
    paddingHorizontal: 4,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "600",
    color: yellowColor,
    marginHorizontal: 6,
  },
});
