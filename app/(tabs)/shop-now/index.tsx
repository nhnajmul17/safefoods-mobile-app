import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import Toast from "react-native-toast-message";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { deepGreenColor, yellowColor } from "@/constants/Colors";
import ShopNowProductCard, {
  ShopNowProduct,
  ProductVariant,
} from "@/components/shopNowScreen/shopNowProductCard";
import { API_URL } from "@/constants/variables";
import { CustomLoader } from "@/components/common/loader";
import { useAuthStore } from "@/store/authStore";

interface QuantityMap {
  [productId: string]: number;
}

const getProductsAPI = async (
  page: number,
  limit: number,
  searchQuery: string
) => {
  try {
    let url = `${API_URL}/v1/products?limit=${limit}&page=${page}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default function ShopNowScreen() {
  const { addItem } = useCartStore();
  const { userId, accessToken } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ShopNowProduct[]>([]);
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<ShopNowProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);

  // Enhanced search with better UX
  const performSearch = useCallback(
    async (
      query: string,
      pageNum: number = 1,
      isNewSearch: boolean = false
    ) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        if (isNewSearch) {
          setIsSearching(true);
        }

        const data = await getProductsAPI(pageNum, 6, query); // Using limit=1 for testing

        if (data.success) {
          setSearchResults((prev) =>
            isNewSearch
              ? data.data
              : [
                  ...prev,
                  ...data.data.filter(
                    (newItem: ShopNowProduct) =>
                      !prev.some(
                        (existingItem) => existingItem.id === newItem.id
                      )
                  ),
                ]
          );
          setTotalProducts(data.pagination?.totalRecords || data.data.length);
        }
      } catch (err) {
        console.error("Search error:", err);
        Toast.show({
          type: "error",
          text1: "Search Error",
          text2: "Failed to search products. Please try again.",
        });
      } finally {
        setIsSearching(false);
      }
    },
    [searchResults]
  );

  // Debounced search handler
  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (!text.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        // Fetch initial products when search is cleared
        setPage(1);
        setProducts([]);
        fetchInitialProducts(1, true);
        return;
      }

      // Show searching state immediately
      setIsSearching(true);

      // Debounce search
      searchTimeoutRef.current = setTimeout(() => {
        setPage(1);
        setProducts([]);
        performSearch(text, 1, true);
      }, 800);
    },
    [performSearch]
  );

  // Initial data fetch
  const fetchInitialProducts = useCallback(
    async (pageNum: number, isNewFetch: boolean = false) => {
      try {
        if (isNewFetch) setLoading(true);
        setError(null);

        const data = await getProductsAPI(pageNum, 6, "");

        if (data.success) {
          setProducts((prev) =>
            isNewFetch
              ? data.data
              : [
                  ...prev,
                  ...data.data.filter(
                    (newItem: ShopNowProduct) =>
                      !prev.some(
                        (existingItem) => existingItem.id === newItem.id
                      )
                  ),
                ]
          );
          setTotalProducts(data.pagination?.totalRecords || data.data.length);
        }
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    fetchInitialProducts(1, true);
  }, [fetchInitialProducts]);

  // Handle page changes (for load more)
  useEffect(() => {
    if (page > 1) {
      if (searchQuery.trim()) {
        performSearch(searchQuery, page, false);
      } else {
        fetchInitialProducts(page, false);
      }
    }
  }, [page, fetchInitialProducts, performSearch, searchQuery]);

  // Get display products based on search state
  const displayProducts = useMemo(() => {
    if (searchQuery.trim() && searchResults.length > 0) {
      return searchResults;
    }

    if (searchQuery.trim() && !isSearching) {
      return []; // Show no results when search is done but no results
    }

    return [...products];
  }, [products, searchResults, searchQuery, isSearching]);

  const handleQuantityChange = (item: ShopNowProduct, delta: number) => {
    setQuantities((prev: QuantityMap) => {
      const newQty = Math.max((prev[item.id] || 0) + delta, 0);
      return { ...prev, [item.id]: newQty };
    });
  };

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
      });
      setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
    }
  };

  const isFilterActive = searchQuery !== "";

  const handleClearFilters = () => {
    setSearchQuery("");
    setSearchResults([]);
    setPage(1);
    setProducts([]);
    // Trigger fresh fetch without search
    setTimeout(() => {
      fetchInitialProducts(1, true);
    }, 100);
  };

  if (loading && products.length === 0) {
    return (
      <CustomLoader isLoading={loading} loadingText="Loading products..." />
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setPage(1);
            setProducts([]);
            setLoading(true);
            fetchInitialProducts(1, true);
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather
            name="search"
            size={20}
            color={deepGreenColor}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for fresh products..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClearFilters}
              style={styles.clearSearchButton}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        {isSearching && (
          <View style={styles.searchLoadingContainer}>
            <ActivityIndicator size="small" color={deepGreenColor} />
            <Text style={styles.searchingText}>Searching...</Text>
          </View>
        )}
      </View>

      <View style={styles.headerRow}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {isFilterActive && `${displayProducts.length} Results`}
        </Text>
        {isFilterActive && (
          <TouchableOpacity
            onPress={handleClearFilters}
            style={styles.clearFilterButton}
          >
            <Text style={styles.clearFilterText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={displayProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ShopNowProductCard
            item={item}
            quantity={quantities[item.id] || 0}
            onIncrease={() => handleQuantityChange(item, 1)}
            onDecrease={() => handleQuantityChange(item, -1)}
            onAddToCart={handleAddToCart}
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={{ paddingBottom: 100 }}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {searchQuery.trim() && !isSearching ? (
              <>
                <Feather name="search" size={64} color="#ccc" />
                <Text style={styles.emptyTitle}>No products found</Text>
                <Text style={styles.emptyText}>
                  Try adjusting your search terms or filters
                </Text>
              </>
            ) : (
              <>
                <MaterialIcons name="inventory-2" size={64} color="#ccc" />
                <Text style={styles.emptyTitle}>No products available</Text>
                <Text style={styles.emptyText}>
                  Check back later for new products
                </Text>
              </>
            )}
          </View>
        )}
      />

      {displayProducts.length < totalProducts && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={() => setPage((prev) => prev + 1)}
          disabled={loading}
        >
          <Text style={styles.loadMoreText}>
            {loading ? "Loading..." : "Load More"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  searchContainer: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearSearchButton: {
    marginLeft: 8,
    padding: 4,
  },
  searchLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    backgroundColor: "#f0f0f0",
  },
  searchingText: {
    marginLeft: 8,
    color: deepGreenColor,
    fontSize: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  clearFilterButton: {
    backgroundColor: "#ddd",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  clearFilterText: {
    color: "#333",
    fontWeight: "600",
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  loadMoreButton: {
    backgroundColor: deepGreenColor,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    margin: 16,
  },
  loadMoreText: {
    color: yellowColor,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: deepGreenColor,
    padding: 10,
    borderRadius: 6,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
