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
import { Colors, greenColor } from "@/constants/Colors";
import { useRouter } from "expo-router";

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
    selectedVariant: ProductVariant
  ) => void;
  isCategoryLoaded: boolean;
  setIsCategoryLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

const BestSellingProductCard = ({
  item,
  quantity,
  selectedVariant,
  setSelectedVariants,
  setQuantities,
  handleAddToCart,
  isCategoryLoaded,
  setIsCategoryLoaded,
}: BestSellingProductCardProps) => {
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.95);
  const navigation = useRouter();

  const handleProductCardPress = (href: string) => {
    // Navigate to main category page first, then to specific category
    if (!isCategoryLoaded) {
      navigation.push("/(tabs)/category");
      setIsCategoryLoaded(true);
      setTimeout(() => {
        navigation.push(href as any);
      });
    } else {
      navigation.push(href as any);
    }

    // Small delay to ensure category page is mounted
    // setTimeout(() => {
    //   navigation.push(href as any);
    // });
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

  return (
    <Animated.View style={[styles.productCard, cardStyle]}>
      <TouchableOpacity
        onPress={() => handleProductCardPress(`/category/${item.id}`)}
      >
        <Image
          source={{
            uri:
              selectedVariant.mediaItems[0]?.mediaUrl ||
              "https://via.placeholder.com/50",
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

export default BestSellingProductCard;

const styles = StyleSheet.create({
  productCard: {
    width: 150, // Changed from "48%" to a fixed width for horizontal scrolling
    marginRight: 16, // Added margin to space out cards
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
    backgroundColor: greenColor,
  },
  variantText: {
    fontSize: 12,
    color: "#333",
  },
  selectedVariantText: {
    color: "#fff",
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
    color: greenColor,
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
    borderColor: greenColor,
    marginHorizontal: 4,
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
    marginHorizontal: 4,
  },
  addButton: {
    backgroundColor: greenColor,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
