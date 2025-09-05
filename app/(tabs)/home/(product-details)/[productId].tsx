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
import RelatedProducts from "./relatedProducts";
import RenderHTML from "react-native-render-html";

export default function ProductDetailsScreen() {
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState<ShopNowProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const { cartItems, addItem, updateQuantity, removeItem } = useCartStore();
  const { userId, accessToken } = useAuthStore();

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

  // Function to ensure HTTPS
  const ensureHttps = (url: string): string => {
    if (url.startsWith("http://")) {
      return url.replace("http://", "https://");
    }
    return url;
  };

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

  const handleAddToCart = (newQuantity: number) => {
    if (!product || !selectedVariant) return;

    // Find the current quantity in cart
    const currentQuantity = quantity;

    if (newQuantity > 0) {
      if (currentQuantity === 0) {
        // Add new item to cart
        addItem({
          id: product.id,
          variantId: selectedVariant.id,
          name: product.title,
          image:
            selectedVariant.mediaItems?.[0]?.mediaUrl ||
            "https://via.placeholder.com/50",
          price: selectedVariant.price,
          unit: selectedVariant.unitTitle,
          quantity: newQuantity,
        });
      } else {
        // Update existing item quantity
        updateQuantity(product.id, selectedVariant.id, newQuantity);
      }

      // Update API if user is logged in
      if (userId && accessToken) {
        const quantityChange = newQuantity - currentQuantity;
        fetch(`${API_URL}/v1/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId: userId,
            variantProductId: selectedVariant.id,
            quantity: quantityChange,
          }),
        })
          .then((response) => response.json())
          .catch((error) => console.error("Cart API Error:", error));
      }

      Toast.show({
        type: "success",
        text1: currentQuantity === 0 ? "Added to Cart" : "Cart Updated",
        text2: `${product.title} (${selectedVariant.unitTitle}) x${newQuantity} in cart.`,
      });
    } else {
      // Remove item from cart
      removeItem(product.id, selectedVariant.id);

      // Update API if user is logged in
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
            quantity: -currentQuantity,
          }),
        })
          .then((response) => response.json())
          .catch((error) => console.error("Cart API Error:", error));
      }

      Toast.show({
        type: "info",
        text1: "Removed from Cart",
        text2: `${product.title} (${selectedVariant.unitTitle}) removed from cart.`,
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

      <Animated.View style={[styles.detailsContainer, detailsStyle]}>
        {/* Fixed Product Info */}
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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
        </View>

        {/* Scrollable Description Section */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* <Text style={styles.description}>{selectedVariant.description}</Text> */}
          <RenderHTML
            contentWidth={300} // Adjust based on your layout
            source={{ html: selectedVariant.description || "" }}
            baseStyle={styles.htmlContent}
          />
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

          {/* Related Products Section */}
          <RelatedProducts productSlug={product.slug} />
        </ScrollView>
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
    marginBottom: 16,
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
    fontSize: 20,
    color: yellowColor,
    fontWeight: "bold",
  },
  cartQuantity: {
    fontSize: 20,
    fontWeight: "bold",
    color: yellowColor,
    marginHorizontal: 12,
  },
  variantContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginBottom: 16,
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
    marginBottom: 16,
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
  },
  scrollContent: {
    paddingBottom: 30,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    lineHeight: 24,
  },
  htmlContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 8,
    marginBottom: 24,
  },
  infoItem: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
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
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
  },
});
