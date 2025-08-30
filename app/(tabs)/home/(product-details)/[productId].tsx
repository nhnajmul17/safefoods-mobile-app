import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { useCartStore } from "@/store/cartStore";
import Toast from "react-native-toast-message";
import { deepGreenColor, yellowColor } from "@/constants/Colors";
import {
  ProductVariant,
  ShopNowProduct,
} from "@/components/shopNowScreen/shopNowProductCard";
import { API_URL } from "@/constants/variables";
import { useAuthStore } from "@/store/authStore";
import { CustomLoader } from "@/components/common/loader";

export default function ProductDetailsScreen() {
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState<ShopNowProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const { addItem } = useCartStore();
  const { userId, accessToken } = useAuthStore();

  // Animation values
  const imageOpacity = useSharedValue(0);
  const detailsTranslateY = useSharedValue(100);
  const decrementScale = useSharedValue(1);
  const incrementScale = useSharedValue(1);
  const addToCartScale = useSharedValue(1);
  const variantScale = useSharedValue(1);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/v1/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.data);
        setSelectedVariant(data.data.variants[0] || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setError("Failed to load product details. Please try again.");
        setLoading(false);
      });
  }, [productId]);

  // Trigger animations on mount
  useEffect(() => {
    if (product && selectedVariant) {
      imageOpacity.value = withTiming(1, {
        duration: 800,
        easing: Easing.ease,
      });
      detailsTranslateY.value = withTiming(0, {
        duration: 800,
        easing: Easing.ease,
      });
    }
  }, [product, selectedVariant]);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    incrementScale.value = withSpring(0.9, {}, () => {
      incrementScale.value = withSpring(1);
    });
  };

  const handleDecrement = () => {
    setQuantity(quantity > 0 ? quantity - 1 : 0);
    decrementScale.value = withSpring(0.9, {}, () => {
      decrementScale.value = withSpring(1);
    });
  };

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    variantScale.value = withSpring(0.95, {}, () => {
      variantScale.value = withSpring(1);
    });
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    if (quantity > 0) {
      const cartItem = {
        id: product.id,
        variantId: selectedVariant.id,
        name: product.title,
        image:
          selectedVariant.mediaItems?.[0]?.mediaUrl ||
          "https://via.placeholder.com/50",
        price: selectedVariant.price,
        unit: selectedVariant.unitTitle,
        quantity,
      };
      addItem(cartItem);
      if (userId && accessToken) {
        fetch(`${API_URL}/v1/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId: userId,
            variantProductId: selectedVariant.id,
            quantity,
          }),
        })
          .then((response) => response.json())
          .catch((error) => console.error("Cart API Error:", error));
      }
      Toast.show({
        type: "success",
        text1: "Added to Cart",
        text2: `${quantity} ${product.title} (${selectedVariant.unitTitle}) added to your cart.`,
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });

      setQuantity(1);
    } else {
      Toast.show({
        type: "error",
        text1: "Invalid Quantity",
        text2: "Please select a quantity greater than 0.",
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
    }

    addToCartScale.value = withRepeat(withSpring(0.95), 2, true, () => {
      addToCartScale.value = withSpring(1);
    });
  };

  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }));

  const detailsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: detailsTranslateY.value }],
  }));

  const decrementStyle = useAnimatedStyle(() => ({
    transform: [{ scale: decrementScale.value }],
  }));

  const incrementStyle = useAnimatedStyle(() => ({
    transform: [{ scale: incrementScale.value }],
  }));

  const addToCartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addToCartScale.value }],
  }));

  const variantStyle = useAnimatedStyle(() => ({
    transform: [{ scale: variantScale.value }],
  }));

  if (loading) {
    return (
      <CustomLoader
        isLoading={loading}
        loadingText="Loading product details..."
      />
    );
  }

  if (error || !product || !selectedVariant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorText}>{error || "Product not found"}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header Section */}
      <Animated.View style={[styles.imageContainer, imageStyle]}>
        <Image
          source={{
            uri:
              selectedVariant.mediaItems?.[0]?.mediaUrl ||
              "https://via.placeholder.com/200",
          }}
          style={styles.productImage}
          onError={(e) =>
            console.log(
              `Product image load error (${product.title}):`,
              e.nativeEvent.error
            )
          }
        />
      </Animated.View>

      <Animated.View style={[styles.detailsContainer, detailsStyle]}>
        {/* Fixed Product Info */}
        <View style={styles.header}>
          <Text style={styles.name}>{product.title}</Text>
          <View style={styles.quantityContainer}>
            <Animated.View style={decrementStyle}>
              <TouchableOpacity
                onPress={handleDecrement}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.quantity}>{quantity}</Text>
            <Animated.View style={incrementStyle}>
              <TouchableOpacity
                onPress={handleIncrement}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        <View style={styles.variantContainer}>
          {product.variants.map((variant) => (
            <Animated.View key={variant.id} style={variantStyle}>
              <TouchableOpacity
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
            </Animated.View>
          ))}
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.weightPrice}>৳{selectedVariant.price}</Text>
          {selectedVariant.originalPrice > selectedVariant.price && (
            <Text style={styles.originalPrice}>
              ৳{selectedVariant.originalPrice}
            </Text>
          )}
        </View>

        {/* Scrollable Description Section */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.description}>{selectedVariant.description}</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/2927/2927216.png",
                }}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>100% Organic</Text>
            </View>
            <View style={styles.infoItem}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/2927/2927217.png",
                }}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>1 Month</Text>
            </View>
            <View style={styles.infoItem}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
                }}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>4.5 (320) Reviews</Text>
            </View>
            <View style={styles.infoItem}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/3170/3170733.png",
                }}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>Varies by product</Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Fixed Add to Cart Button */}
      <Animated.View style={[styles.addToCartContainer, addToCartStyle]}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      </Animated.View>

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  errorText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
  imageContainer: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  quantityButton: {
    padding: 6,
  },
  quantityText: {
    fontSize: 24,
    fontWeight: "bold",
    color: deepGreenColor,
  },
  quantity: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 16,
    color: "#333",
  },
  variantContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  variantBadge: {
    backgroundColor: "#eee",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedVariantBadge: {
    backgroundColor: deepGreenColor,
  },
  variantText: {
    fontSize: 14,
    color: "#333",
  },
  selectedVariantText: {
    color: yellowColor,
    fontWeight: "600",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  weightPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: deepGreenColor,
  },
  originalPrice: {
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 80, // Space for the fixed add to cart button
  },
  scrollContent: {
    paddingBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 8,
  },
  infoItem: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
  },
  addToCartContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  addToCartButton: {
    backgroundColor: deepGreenColor,
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  addToCartText: {
    fontSize: 18,
    color: yellowColor,
    fontWeight: "bold",
  },
});
