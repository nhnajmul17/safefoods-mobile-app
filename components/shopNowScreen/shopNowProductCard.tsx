import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { deepGreenColor, yellowColor } from "@/constants/Colors";
import { Link } from "expo-router";

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
  categorySlug?: string; // Optional for compatibility with existing data
  variants: ProductVariant[];
}

type ProductCardProps = {
  item: ShopNowProduct;
  quantity: number;
  onIncrease: (item: ShopNowProduct) => void;
  onDecrease: (item: ShopNowProduct) => void;
  onAddToCart: (item: ShopNowProduct, selectedVariant: ProductVariant) => void;
};

const ShopNowProductCard = ({
  item,
  quantity,
  onIncrease,
  onDecrease,
  onAddToCart,
}: ProductCardProps) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    item.variants[0]
  );
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.95);

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

  return (
    <Animated.View style={[styles.productCard, cardStyle]}>
      <Link href={`/(tabs)/shop-now/(product-details)/${item.id}`}>
        <Image
          source={{
            uri:
              selectedVariant.mediaItems?.[0]?.mediaUrl ||
              "https://via.placeholder.com/50",
          }}
          style={styles.productImage}
          resizeMode="cover"
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
            onPress={() => onAddToCart(item, selectedVariant)}
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
    width: "48%",
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
    color: "#333",
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
