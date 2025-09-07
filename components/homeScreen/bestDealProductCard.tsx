import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
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
import { Link, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useCartStore } from "@/store/cartStore";
import { ensureHttps } from "@/utils/imageUtils";

interface QuantityMap {
  [productId: string]: number;
}

interface BestSellingProductCardProps {
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
}

const BestDealProductCard = ({
  item,
  quantity,
  selectedVariant,
  setSelectedVariants,
  setQuantities,
  handleAddToCart,
}: BestSellingProductCardProps) => {
  const { cartItems } = useCartStore();
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.95);
  const navigation = useRouter();

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

  return (
    <Animated.View style={[styles.productCard, cardStyle]}>
      <TouchableOpacity
        onPress={() =>
          navigation.push(`/(tabs)/home/(product-details)/${item.slug}` as any)
        }
      >
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
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Link
          href={`/(tabs)/home/(product-details)/${item.slug}` as any}
          asChild
        >
          <Text style={styles.productName}>{item.title}</Text>
        </Link>
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

export default BestDealProductCard;

const styles = StyleSheet.create({
  productCard: {
    width: 150,
    marginRight: 16,
    marginBottom: 8, // Reduced from 12 to 8 to decrease space between cards
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
    padding: 6, // Reduced from 8 to 6 to decrease overall padding
    paddingBottom: 4, // Explicitly set to minimize space below cart section
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
  cartSection: {
    alignSelf: "center",
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
