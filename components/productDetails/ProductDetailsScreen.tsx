import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  Easing,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useCartStore } from "@/store/cartStore";
import { deepGreenColor, yellowColor } from "@/constants/Colors";
import {
  ProductVariant,
  ShopNowProduct,
} from "@/components/shopNowScreen/shopNowProductCard";
import { API_URL } from "@/constants/variables";
import { useAuthStore } from "@/store/authStore";
import { CustomLoader } from "@/components/common/loader";
import RelatedProducts from "./RelatedProducts";
import RenderHTML from "react-native-render-html";
import { ensureHttps } from "@/utils/imageUtils";
import { handleAddToCart as handleAddToCartUtil } from "@/utils/cartUtils";

interface ProductDetailsScreenProps {
  /** The tab context for navigation (home, category, shop-now) */
  tabContext: "home" | "category" | "shop-now";
}

const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({
  tabContext,
}) => {
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState<ShopNowProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const { cartItems } = useCartStore();

  // Find if this product variant is already in cart
  const cartItem = cartItems.find(
    (cartItem) =>
      cartItem.id === product?.id && cartItem.variantId === selectedVariant?.id
  );

  const quantity = cartItem ? cartItem.quantity : 0;

  // Animation values
  const imageOpacity = useSharedValue(0);
  const detailsTranslateY = useSharedValue(100);
  const addToCartScale = useSharedValue(1);
  const variantScale = useSharedValue(1);
  const scrollY = useSharedValue(0);

  // Constants for collapsing header
  const HEADER_MAX_HEIGHT = 350;
  const HEADER_MIN_HEIGHT = 150;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/v1/products/slug/${productId}`)
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
    }
  }, [product, selectedVariant]);

  const handleIncrease = () => {
    if (!product || !selectedVariant) return;

    const newQuantity = quantity + 1;
    handleAddToCart(newQuantity);
  };

  const handleDecrease = () => {
    if (!product || !selectedVariant) return;

    if (quantity > 1) {
      const newQuantity = quantity - 1;
      handleAddToCart(newQuantity);
    } else {
      handleAddToCart(0); // Remove from cart
    }
  };

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    variantScale.value = withSpring(0.95, {}, () => {
      variantScale.value = withSpring(1);
    });
  };

  const handleAddToCart = async (newQuantity: number) => {
    if (!product || !selectedVariant) return;

    await handleAddToCartUtil({
      productId: product.id,
      variantId: selectedVariant.id,
      productTitle: product.title,
      productImage:
        selectedVariant.mediaItems?.[0]?.mediaUrl ||
        "https://via.placeholder.com/50",
      productPrice: selectedVariant.price,
      unitTitle: selectedVariant.unitTitle,
      newQuantity: newQuantity,
      showToast: true,
    });

    addToCartScale.value = withRepeat(withSpring(0.95), 2, true, () => {
      addToCartScale.value = withSpring(1);
    });
  };

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated header height based on scroll
  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolation.CLAMP
    );
    return {
      height,
      opacity: imageOpacity.value,
    };
  });

  const fixedInfoStyle = useAnimatedStyle(() => {
    const headerHeight = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolation.CLAMP
    );
    return {
      top: headerHeight,
    };
  });

  const scrollContentStyle = useAnimatedStyle(() => {
    const headerHeight = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolation.CLAMP
    );
    // Add fixed info height (~100px for title + price section)
    return {
      paddingTop: headerHeight + 100,
      paddingBottom: 20,
    };
  });

  const addToCartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addToCartScale.value }],
  }));

  const variantStyle = useAnimatedStyle(() => ({
    transform: [{ scale: variantScale.value }],
  }));

  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
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
      <View style={styles.container}>
        {/* Collapsing Header Section */}
        <Animated.View style={[styles.imageContainer, headerStyle]}>
          <Image
            source={{
              uri: selectedVariant.mediaItems?.[0]?.mediaUrl
                ? ensureHttps(selectedVariant.mediaItems[0].mediaUrl)
                : "https://via.placeholder.com/200",
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

        {/* Fixed Product Info Section */}
        <Animated.View style={[styles.fixedInfoContainer, fixedInfoStyle]}>
          <View style={styles.header}>
            <Text style={styles.name}>{product.title}</Text>
            <Animated.View style={addToCartStyle}>
              {quantity === 0 ? (
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => handleAddToCart(1)}
                >
                  <Text style={styles.addToCartText}>Add to cart</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.cartQuantityContainer}>
                  <TouchableOpacity
                    onPress={handleDecrease}
                    style={styles.cartQuantityButton}
                  >
                    <Text style={styles.cartQuantityText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.cartQuantity}>{quantity}</Text>
                  <TouchableOpacity
                    onPress={handleIncrease}
                    style={styles.cartQuantityButton}
                  >
                    <Text style={styles.cartQuantityText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.weightPrice}>
              ৳{selectedVariant.price.toLocaleString()}
            </Text>
            {selectedVariant.originalPrice > selectedVariant.price && (
              <Text style={styles.originalPrice}>
                ৳{selectedVariant.originalPrice.toLocaleString()}
              </Text>
            )}
          </View>
        </Animated.View>

        {/* Scrollable Content */}
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          <Animated.View style={scrollContentStyle}>
            {/* Description Section */}
            <View style={styles.descriptionContainer}>
              <RenderHTML
                contentWidth={300}
                source={{ html: selectedVariant.description || "" }}
                baseStyle={styles.htmlContent}
              />
            </View>

            {/* Related Products Section */}
            <RelatedProducts
              productSlug={product.slug}
              tabContext={tabContext}
            />
          </Animated.View>
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  errorText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    backgroundColor: "#ffffff",
    // borderBottomLeftRadius: 30,
    // borderBottomRightRadius: 30,
    overflow: "hidden",
    zIndex: 1,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    // borderBottomLeftRadius: 30,
    // borderBottomRightRadius: 30,
  },
  fixedInfoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    zIndex: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 16,
  },
  addToCartButton: {
    backgroundColor: deepGreenColor,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    minWidth: 100,
  },
  addToCartText: {
    fontSize: 14,
    color: yellowColor,
    fontWeight: "bold",
  },
  cartQuantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: deepGreenColor,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 100,
  },
  cartQuantityButton: {
    paddingHorizontal: 8,
  },
  cartQuantityText: {
    fontSize: 22,
    color: yellowColor,
    fontWeight: "bold",
  },
  cartQuantity: {
    fontSize: 22,
    color: yellowColor,
    fontWeight: "bold",
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: "center",
  },
  variantContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  variantBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedVariantBadge: {
    backgroundColor: deepGreenColor,
    borderColor: deepGreenColor,
  },
  variantText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  selectedVariantText: {
    color: "white",
  },
  priceContainer: {
    alignItems: "flex-start",
  },
  weightPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: deepGreenColor,
  },
  originalPrice: {
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  descriptionContainer: {
    marginTop: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  htmlContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  infoItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
});

export default ProductDetailsScreen;
