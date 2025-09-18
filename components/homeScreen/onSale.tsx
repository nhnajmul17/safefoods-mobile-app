import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import { Fragment, useState, useEffect } from "react";
import {
  ShopNowProduct,
  ProductVariant,
} from "@/components/shopNowScreen/shopNowProductCard";

import { API_URL } from "@/constants/variables";
import OnSaleProductCard from "./onSaleProductCard";
import { handleAddToCart } from "@/utils/cartUtils";

// Define QuantityMap interface
interface QuantityMap {
  [productId: string]: number;
}

export default function HomeOnSale() {
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
          setError("Failed to load on-sale products.");
        }
      } catch (err) {
        console.error("Error fetching on-sale products:", err);
        setError("Failed to load on-sale products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOnSaleProducts();
  }, []);

  const handleAddToCartLocal = async (
    item: ShopNowProduct,
    selectedVariant: ProductVariant,
    newQuantity: number
  ) => {
    await handleAddToCart({
      productId: item.id,
      variantId: selectedVariant.id,
      productTitle: item.title,
      productImage: selectedVariant.mediaItems?.[0]?.mediaUrl
        ? selectedVariant.mediaItems[0].mediaUrl.startsWith("http://")
          ? selectedVariant.mediaItems[0].mediaUrl.replace(
              "http://",
              "https://"
            )
          : selectedVariant.mediaItems[0].mediaUrl
        : "https://via.placeholder.com/50",
      productPrice: selectedVariant.price,
      unitTitle: selectedVariant.unitTitle,
      newQuantity: newQuantity,
      showToast: true,
    });
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
              handleAddToCart={handleAddToCartLocal}
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
