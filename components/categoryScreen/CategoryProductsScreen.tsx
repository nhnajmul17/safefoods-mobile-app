import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useCartStore } from "@/store/cartStore";
import Toast from "react-native-toast-message";
import CategoryProductCard from "@/components/categoryScreen/categoryProductCard";
import {
  ShopNowProduct,
  ProductVariant,
} from "@/components/shopNowScreen/shopNowProductCard";
import { API_URL } from "@/constants/variables";
import { useAuthStore } from "@/store/authStore";

interface QuantityMap {
  [productId: string]: number;
}

interface CategoryProductsScreenProps {
  categoryTitle: string;
}

export default function CategoryProductsScreen({
  categoryTitle,
}: CategoryProductsScreenProps) {
  const { addItem } = useCartStore();
  const { userId, accessToken } = useAuthStore();
  const [products, setProducts] = useState<ShopNowProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [selectedVariants, setSelectedVariants] = useState<{
    [productId: string]: ProductVariant;
  }>({});

  // Fetch products for the category
  const fetchProducts = useCallback(
    async (pageNum: number, isNewFetch: boolean = false) => {
      try {
        if (isNewFetch) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const response = await fetch(
          `${API_URL}/v1/products/category/${categoryTitle}?page=${pageNum}&limit=10`
        );
        const data = await response.json();

        if (data.success) {
          if (isNewFetch) {
            setProducts(data.data);
            // Set initial selected variants
            setSelectedVariants(
              Object.fromEntries(
                data.data.map((product: ShopNowProduct) => [
                  product.id,
                  product.variants[0],
                ])
              )
            );
          } else {
            setProducts((prev) => [
              ...prev,
              ...data.data.filter(
                (newItem: ShopNowProduct) =>
                  !prev.some((existingItem) => existingItem.id === newItem.id)
              ),
            ]);
          }

          setTotalProducts(data.pagination?.totalRecords || data.data.length);
          setHasMore(
            data.data.length > 0 &&
              products.length + data.data.length <
                (data.pagination?.totalRecords || 0)
          );
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load products. Please try again.",
        });
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [categoryTitle]
  );

  // Initial load
  useEffect(() => {
    setPage(1);
    fetchProducts(1, true);
  }, [categoryTitle, fetchProducts]);

  // Load more products when page changes
  useEffect(() => {
    if (page > 1) {
      fetchProducts(page, false);
    }
  }, [page, fetchProducts]);

  // Infinite scroll handler
  const loadMoreProducts = useCallback(() => {
    if (!loadingMore && hasMore && products.length > 0) {
      setPage((prev) => prev + 1);
    }
  }, [loadingMore, hasMore, products.length]);

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
        image:
          selectedVariant.mediaItems?.[0]?.mediaUrl ||
          "https://via.placeholder.com/50",
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

  if (loading && products.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  const isSingleItem = products?.length === 1;

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CategoryProductCard
            item={item}
            quantity={quantities[item.id] || 0}
            selectedVariant={selectedVariants[item.id] || item.variants[0]}
            setSelectedVariants={setSelectedVariants}
            setQuantities={setQuantities}
            handleAddToCart={handleAddToCart}
            isSingleItem={isSingleItem}
          />
        )}
        numColumns={2}
        columnWrapperStyle={
          isSingleItem ? styles.singleColumnWrapper : styles.columnWrapper
        }
        contentContainerStyle={styles.contentContainer}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loadingMore ? (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color="#888" />
              <Text style={styles.loadingMoreText}>
                Loading more products...
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.noProducts}>No products available.</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  singleColumnWrapper: {
    justifyContent: "flex-start",
    paddingHorizontal: 4,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  noProducts: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 32,
    fontWeight: "bold",
  },
  loadingMoreContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  loadingMoreText: {
    marginLeft: 8,
    color: "#666",
  },
});
