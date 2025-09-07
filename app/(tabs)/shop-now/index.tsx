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

import { Category, CategoriesResponse } from "@/components/shopNowScreen/types";
import CategoryList from "@/components/shopNowScreen/categoryItem";
import SubcategoryList from "@/components/shopNowScreen/subCategoryItem";

interface QuantityMap {
  [productId: string]: number;
}

const getProductsAPI = async (
  page: number,
  limit: number,
  searchQuery: string,
  categorySlug?: string
) => {
  try {
    let url = `${API_URL}/v1/products`;

    // Use category-specific endpoint if category is provided
    if (categorySlug) {
      url = `${API_URL}/v1/products/category/${categorySlug}`;
    }

    url += `?limit=${limit}&page=${page}`;
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

const getCategoriesAPI = async (): Promise<CategoriesResponse> => {
  try {
    const response = await fetch(`${API_URL}/v1/categories`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return response.json();
  } catch (error) {
    console.error("Categories API Error:", error);
    throw error;
  }
};

export default function ShopNowScreen() {
  const { cartItems, addItem, removeItem, updateQuantity } = useCartStore();
  const { userId, accessToken } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ShopNowProduct[]>([]);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<ShopNowProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Category | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const searchTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await getCategoriesAPI();
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        Toast.show({
          type: "error",
          text1: "Categories Error",
          text2: "Failed to load categories. Please try again.",
        });
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Get subcategories based on selected category
  const subcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return selectedCategory.children || [];
  }, [selectedCategory]);

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategory(null);
  }, [selectedCategory]);

  // Enhanced search with better UX
  const performSearch = useCallback(
    async (
      query: string,
      pageNum: number = 1,
      isNewSearch: boolean = false,
      categorySlug?: string
    ) => {
      try {
        if (isNewSearch) {
          setIsSearching(true);
        }

        const data = await getProductsAPI(pageNum, 10, query, categorySlug);

        if (data.success) {
          if (isNewSearch) {
            setSearchResults(data.data);
          } else {
            setSearchResults((prev) => [
              ...prev,
              ...data.data.filter(
                (newItem: ShopNowProduct) =>
                  !prev.some((existingItem) => existingItem.id === newItem.id)
              ),
            ]);
          }
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
    []
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
        // Determine if we need to filter by category
        const categorySlug =
          selectedSubcategory?.slug || selectedCategory?.slug;
        fetchInitialProducts(1, true, categorySlug);
        return;
      }

      // Show searching state immediately
      setIsSearching(true);

      // Debounce search
      searchTimeoutRef.current = setTimeout(() => {
        setPage(1);
        const categorySlug =
          selectedSubcategory?.slug || selectedCategory?.slug;
        performSearch(text, 1, true, categorySlug);
      }, 800);
    },
    [performSearch, selectedCategory, selectedSubcategory]
  );

  // Initial data fetch
  const fetchInitialProducts = useCallback(
    async (
      pageNum: number,
      isNewFetch: boolean = false,
      categorySlug?: string
    ) => {
      try {
        if (isNewFetch) setLoading(true);
        setError(null);

        const data = await getProductsAPI(pageNum, 10, "", categorySlug);

        if (data.success) {
          if (isNewFetch) {
            setProducts(data.data);
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
        }
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Handle category selection
  const handleCategorySelect = useCallback(
    (category: Category | null) => {
      setSelectedCategory(category);
      setSelectedSubcategory(null);
      setPage(1);
      setSearchQuery("");
      setSearchResults([]);

      // Fetch products for this category or all products
      const categorySlug = category ? category.slug : undefined;
      fetchInitialProducts(1, true, categorySlug);
    },
    [fetchInitialProducts]
  );

  // Handle subcategory selection
  const handleSubcategorySelect = useCallback(
    (subcategory: Category | null) => {
      setSelectedSubcategory(subcategory);
      setPage(1);
      setSearchQuery("");
      setSearchResults([]);

      // Fetch products for this subcategory or all products in the category
      const categorySlug = subcategory
        ? subcategory.slug
        : selectedCategory?.slug;
      fetchInitialProducts(1, true, categorySlug);
    },
    [fetchInitialProducts, selectedCategory]
  );

  // Initial load
  useEffect(() => {
    fetchInitialProducts(1, true);
  }, [fetchInitialProducts]);

  // Get display products based on search state
  const displayProducts = useMemo(() => {
    if (searchQuery.trim()) {
      return searchResults;
    }
    return products;
  }, [products, searchResults, searchQuery]);

  // Handle page changes (for infinite scroll)
  const loadMoreProducts = useCallback(() => {
    if (
      !loadingMore &&
      displayProducts.length < totalProducts &&
      displayProducts.length > 0
    ) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);

      if (searchQuery.trim()) {
        const categorySlug =
          selectedSubcategory?.slug || selectedCategory?.slug;
        performSearch(searchQuery, nextPage, false, categorySlug).finally(() =>
          setLoadingMore(false)
        );
      } else {
        const categorySlug =
          selectedSubcategory?.slug || selectedCategory?.slug;
        fetchInitialProducts(nextPage, false, categorySlug);
      }
    }
  }, [
    page,
    loadingMore,
    displayProducts.length,
    totalProducts,
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    performSearch,
    fetchInitialProducts,
  ]);

  const handleAddToCart = (
    item: ShopNowProduct,
    selectedVariant: ProductVariant,
    newQuantity: number
  ) => {
    // Find the current quantity in cart
    const cartItem = cartItems.find(
      (cartItem) =>
        cartItem.id === item.id && cartItem.variantId === selectedVariant.id
    );
    const currentQuantity = cartItem ? cartItem.quantity : 0;

    if (newQuantity > 0) {
      if (currentQuantity === 0) {
        // Add new item to cart
        addItem({
          id: item.id,
          variantId: selectedVariant.id,
          name: item.title,
          image:
            selectedVariant.mediaItems?.[0]?.mediaUrl ||
            "https://via.placeholder.com/50",
          price: selectedVariant.price,
          unit: selectedVariant.unitTitle,
          quantity: newQuantity,
        });
      } else {
        // Update existing item quantity
        updateQuantity(item.id, selectedVariant.id, newQuantity);
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
        text2: `${item.title} (${selectedVariant.unitTitle}) x${newQuantity} in cart.`,
      });
    } else {
      // Remove item from cart
      removeItem(item.id, selectedVariant.id);

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
        text2: `${item.title} (${selectedVariant.unitTitle}) removed from cart.`,
      });
    }
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
      {/* Search Bar */}
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
            <View style={styles.searchRightContainer}>
              {isSearching ? (
                <ActivityIndicator
                  size="small"
                  color={deepGreenColor}
                  style={styles.searchLoadingIndicator}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    const categorySlug =
                      selectedSubcategory?.slug || selectedCategory?.slug;
                    fetchInitialProducts(1, true, categorySlug);
                  }}
                  style={styles.clearSearchButton}
                >
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Main Content with Categories and Products */}
      <View style={styles.mainContent}>
        {/* Categories Sidebar */}
        {!loadingCategories && (
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}

        {/* Products Area */}
        <View style={styles.productsContainer}>
          {/* Subcategories */}
          {selectedCategory && (
            <SubcategoryList
              subcategories={subcategories}
              selectedSubcategory={selectedSubcategory}
              onSelectSubcategory={handleSubcategorySelect}
            />
          )}

          {/* Products Grid - Single column with infinite scroll */}
          <FlatList
            data={displayProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <ShopNowProductCard item={item} onAddToCart={handleAddToCart} />
              </View>
            )}
            numColumns={1}
            initialNumToRender={4}
            maxToRenderPerBatch={4}
            windowSize={5}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMoreProducts}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              loadingMore ? (
                <View style={styles.loadingMoreContainer}>
                  <ActivityIndicator size="small" color={deepGreenColor} />
                  <Text style={styles.loadingMoreText}>
                    Loading more products...
                  </Text>
                </View>
              ) : null
            }
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
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 6,
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
    paddingVertical: 2,
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
    marginLeft: 2,
    padding: 4,
  },
  searchRightContainer: {
    marginLeft: 8,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  searchLoadingIndicator: {
    marginLeft: 4,
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
  },
  productsContainer: {
    flex: 1,
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
