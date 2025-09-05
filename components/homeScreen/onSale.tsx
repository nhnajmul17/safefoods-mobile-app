import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import { Fragment, useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import Toast from "react-native-toast-message";
import {
  ShopNowProduct,
  ProductVariant,
} from "@/components/shopNowScreen/shopNowProductCard";

import { API_URL } from "@/constants/variables";
import { useAuthStore } from "@/store/authStore";
import OnSaleProductCard from "./onSaleProductCard";

// Define QuantityMap interface
interface QuantityMap {
  [productId: string]: number;
}

export default function HomeOnSale() {
  const { addItem } = useCartStore();
  const { userId, accessToken } = useAuthStore();
  const [products, setProducts] = useState<ShopNowProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [selectedVariants, setSelectedVariants] = useState<{
    [productId: string]: ProductVariant;
  }>({});

  // Fetch on-sale products from API
  useEffect(() => {
    const fetchOnSaleProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/v1/products?discountedSale=true`
        );
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
          setSelectedVariants(
            Object.fromEntries(
              data.data.map((product: ShopNowProduct) => [
                product.id,
                product.variants[0] || null,
              ])
            )
          );
        } else {
          setError("Failed to load best-selling products.");
        }
      } catch (err) {
        console.error("Error fetching best-selling products:", err);
        setError("Failed to load best-selling products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOnSaleProducts();
  }, []);

  const handleAddToCart = (
    item: ShopNowProduct,
    selectedVariant: ProductVariant
  ) => {
    const quantity = quantities[item.id] || 0;
    if (quantity > 0) {
      addItem({
        id: item.id,
        variantId: selectedVariant.id,
        name: item.title,
        image: selectedVariant.mediaItems?.[0]?.mediaUrl
          ? selectedVariant.mediaItems[0].mediaUrl.startsWith("http://")
            ? selectedVariant.mediaItems[0].mediaUrl.replace("http://", "https://")
            : selectedVariant.mediaItems[0].mediaUrl
          : "https://via.placeholder.com/50",
        price: selectedVariant.price,
        unit: selectedVariant.unitTitle,
        quantity,
      });
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
        text2: `${item.title} (${selectedVariant.unitTitle}) x${quantity} added to cart.`,
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
      setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!products.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noProducts}>
          No discounted products available at the moment.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Horizontal Scrollable Product List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.productsContainer}
        contentContainerStyle={styles.productsContent}
      >
        {products.map((item) => (
          <Fragment key={item.id}>
            <OnSaleProductCard
              item={item}
              quantity={quantities[item.id] || 0}
              selectedVariant={selectedVariants[item.id] || item.variants[0]}
              setSelectedVariants={setSelectedVariants}
              setQuantities={setQuantities}
              handleAddToCart={handleAddToCart}
            />
          </Fragment>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  productsContainer: {
    paddingLeft: 0,
    marginTop: 16,
    marginBottom: 16,
  },
  productsContent: {
    paddingRight: 16,
  },
  noProducts: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginVertical: 32,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: "#d32f2f",
    textAlign: "center",
    marginVertical: 32,
    fontWeight: "bold",
  },
});
