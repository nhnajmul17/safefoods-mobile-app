import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useState, useMemo } from "react";
import { Picker } from "@react-native-picker/picker";
import { useCartStore } from "@/store/cartStore";
import Toast from "react-native-toast-message";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Colors, greenColor } from "@/constants/Colors";
import ShopNowProductCard, {
  ShopNowProduct,
  ProductVariant,
} from "@/components/shopNowScreen/shopNowProductCard";
import { allProductsData } from "@/hooks/productsData";

export default function ShopNowScreen() {
  const { addItem } = useCartStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("None");
  const [page, setPage] = useState(1);

  const allProducts = allProductsData;

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (searchQuery) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (sortOption === "Low to High") {
      result.sort((a, b) => a.variants[0].price - b.variants[0].price);
    } else if (sortOption === "High to Low") {
      result.sort((a, b) => b.variants[0].price - a.variants[0].price);
    }

    return result.slice(0, page * 4);
  }, [searchQuery, selectedCategory, sortOption, page, allProducts]);

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
        name: item.name,
        image:
          selectedVariant.mediaItems[0]?.image ||
          "https://via.placeholder.com/50",
        price: selectedVariant.price,
        unit: selectedVariant.unit,
        quantity,
      });
      Toast.show({
        type: "success",
        text1: "Added to Cart",
        text2: `${item.name} (${selectedVariant.unit}) x${quantity} added to cart.`,
      });
      setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
    }
  };

  const isFilterActive = selectedCategory !== "All" || sortOption !== "None";

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
            <Picker.Item label="Protein" value="Protein" />
            <Picker.Item label="Meat" value="Meat" />
            <Picker.Item label="Vegetables" value="Vegetables" />
            <Picker.Item label="Dairy" value="Dairy" />
            <Picker.Item label="Oil" value="Oil" />
            <Picker.Item label="Fruits" value="Fruits" />
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
      />

      {filteredProducts.length < allProducts.length && (
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
});
