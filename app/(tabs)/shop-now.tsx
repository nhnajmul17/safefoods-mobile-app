import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useMemo } from "react";
import { Picker } from "@react-native-picker/picker";
import { useCartStore } from "@/store/cartStore";
import Toast from "react-native-toast-message";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Colors, greenColor } from "@/constants/Colors";
import ShopNowProductCard, {
  ShopNowProduct,
  ProductVariant,
} from "@/components/shopNowScreen/shopNowProductCard";
// import { allProductsData } from "@/hooks/productsData";
import {
  API_URL,
  DAIRY,
  FRUITS,
  MEAT,
  OIL,
  PROTEINS,
  VEGETABLES,
} from "@/constants/variables";
import { CustomLoader } from "@/components/common/loader";

const getProductsAPI = async () => {
  try {
    const response = await fetch(`${API_URL}/v1/products`, {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("None");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<ShopNowProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const allProducts = allProductsData;

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductsAPI();
        console.log("Fetched products:", data.data);
        setProducts(data.data); // Assuming data is an array of ShopNowProduct
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products]; //allProductsData

    if (searchQuery) {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.categoryTitle === selectedCategory
      );
    }

    if (sortOption === "Low to High") {
      result.sort((a, b) => a.variants[0].price - b.variants[0].price);
    } else if (sortOption === "High to Low") {
      result.sort((a, b) => b.variants[0].price - a.variants[0].price);
    }

    return result.slice(0, page * 4);
  }, [searchQuery, selectedCategory, sortOption, page, products]);

  interface QuantityMap {
    [productId: string]: number;
  }

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
          selectedVariant.mediaItems[0]?.mediaUrl ||
          "https://via.placeholder.com/50",
        price: selectedVariant.price,
        unit: selectedVariant.unitTitle,
        quantity,
      });
      Toast.show({
        type: "success",
        text1: "Added to Cart",
        text2: `${item.title} (${selectedVariant.unitTitle}) x${quantity} added to cart.`,
      });
      setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
    }
  };

  const isFilterActive = selectedCategory !== "All" || sortOption !== "None";

  if (loading) {
    return (
      <CustomLoader isLoading={loading} loadingText="Loading products..." />
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setLoading(true)} // Retry on button press
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: Colors.light.background },
        ]}
      >
        <Feather
          name="search"
          size={20}
          color={Colors.light.text}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#1a1a1a"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => setShowFilterDrawer(!showFilterDrawer)}
        >
          <Ionicons name="filter" size={26} color={greenColor} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {isFilterActive && `${filteredProducts.length} Results`}
        </Text>
        {isFilterActive && (
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory("All");
              setSortOption("None");
            }}
            style={styles.clearFilterButton}
          >
            <Text style={styles.clearFilterText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {showFilterDrawer && (
        <View style={styles.filterDrawer}>
          <Text style={styles.modalLabel}>Category</Text>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => {
              setShowFilterDrawer(!showFilterDrawer);
              setSelectedCategory(itemValue);
            }}
            style={{ color: "#1a1a1a" }}
            dropdownIconColor="#1a1a1a"
          >
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Proteins" value={PROTEINS} />
            <Picker.Item label="Meat" value={MEAT} />
            <Picker.Item label="Vegetables" value={VEGETABLES} />
            <Picker.Item label="Dairy" value={DAIRY} />
            <Picker.Item label="Oil" value={OIL} />
            <Picker.Item label="Fruits" value={FRUITS} />
          </Picker>

          <Text style={styles.modalLabel}>Sort By Price</Text>
          <Picker
            selectedValue={sortOption}
            onValueChange={(itemValue) => {
              setSortOption(itemValue);
              setShowFilterDrawer(!showFilterDrawer);
            }}
            style={{ color: "#1a1a1a" }}
            dropdownIconColor="#1a1a1a"
          >
            <Picker.Item label="None" value="None" />
            <Picker.Item label="Low to High" value="Low to High" />
            <Picker.Item label="High to Low" value="High to Low" />
          </Picker>
        </View>
      )}

      <FlatList
        data={filteredProducts}
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
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products available.</Text>
        }
      />

      {filteredProducts.length < products.length && ( //all products
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={() => setPage((prev) => prev + 1)}
        >
          <Text style={styles.loadMoreText}>Load More</Text>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterDrawer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 5,
  },
  loadMoreButton: {
    backgroundColor: greenColor,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    margin: 16,
  },
  loadMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.text,
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
    backgroundColor: greenColor,
    padding: 10,
    borderRadius: 6,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    padding: 20,
  },
});
