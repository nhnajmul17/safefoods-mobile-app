import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { deepGreenColor } from "@/constants/Colors";
import { API_URL } from "@/constants/variables";
import { ShopNowProduct } from "@/components/shopNowScreen/shopNowProductCard";

interface RelatedProductsProps {
  productSlug: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ productSlug }) => {
  const router = useRouter();
  const [relatedProducts, setRelatedProducts] = useState<ShopNowProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_URL}/v1/products/related/${productSlug}`
        );
        const data = await response.json();

        if (data.success) {
          setRelatedProducts(data.data);
        } else {
          setError("Failed to load related products");
        }
      } catch (err) {
        console.error("Error fetching related products:", err);
        setError("Failed to load related products");
      } finally {
        setLoading(false);
      }
    };

    if (productSlug) {
      fetchRelatedProducts();
    }
  }, [productSlug]);

  const handleProductPress = (productId: string) => {
    router.replace(`/(tabs)/home/(product-details)/${productId}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Related Products</Text>
        <Text style={styles.loadingText}>Loading related products...</Text>
      </View>
    );
  }

  if (error || relatedProducts.length === 0) {
    return null; // Don't show anything if there's an error or no related products
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>People Bought Together</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {relatedProducts.map((product) => {
          const firstVariant = product.variants[0];
          const imageUrl =
            firstVariant?.mediaItems?.[0]?.mediaUrl ||
            "https://via.placeholder.com/100";

          return (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => handleProductPress(product.id)}
            >
              <Image
                source={{ uri: imageUrl }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <Text style={styles.productName} numberOfLines={2}>
                {product.title}
              </Text>
              <Text style={styles.productPrice}>
                ৳{firstVariant?.price || "N/A"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 16,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    padding: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 5,
    gap: 12,
  },
  productCard: {
    width: 120,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  productImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: deepGreenColor,
    textAlign: "center",
  },
});

export default RelatedProducts;
