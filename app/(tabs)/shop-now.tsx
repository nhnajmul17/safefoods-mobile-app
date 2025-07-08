import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";

import { Picker } from "@react-native-picker/picker";
import { useCartStore } from "@/store/cartStore";
import Toast from "react-native-toast-message";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Colors, greenColor } from "@/constants/Colors";
import ShopNowProductCard, {
  ShopNowProduct,
} from "@/components/shopNowScreen/shopNowProductCard";

export default function ShopNowScreen() {
  const { addItem } = useCartStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<ShopNowProduct[]>(
    []
  ); // Fixed type

  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("None");
  const [page, setPage] = useState(1);

  const allProducts: ShopNowProduct[] = [
    {
      id: "1",
      name: "Apple",
      category: "Fruits",
      price: 0.5,
      image:
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=60",
      unit: "kg",
    },
    {
      id: "2",
      name: "Milk",
      category: "Dairy",
      price: 2.99,
      image: "https://via.placeholder.com/50",
      unit: "litre",
    },
    {
      id: "3",
      name: "Bread",
      category: "Bakery",
      price: 1.99,
      image: "https://via.placeholder.com/50",
      unit: "item",
    },
    {
      id: "4",
      name: "Carrots",
      category: "Vegetables",
      price: 0.75,
      image:
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=60",
      unit: "kg",
    },
    {
      id: "5",
      name: "Cheese",
      category: "Dairy",
      price: 3.49,
      image:
        "https://images.unsplash.com/photo-1669908978664-485e69bc26cd?auto=format&fit=crop&w=500&q=60",
      unit: "kg",
    },
    {
      id: "6",
      name: "Banana",
      category: "Fruits",
      price: 0.6,
      image:
        "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=500&q=60",
      unit: "kg",
    },
    {
      id: "7",
      name: "Orange",
      category: "Fruits",
      price: 0.8,
      image: "https://via.placeholder.com/50",
      unit: "kg",
    },
    {
      id: "8",
      name: "Yogurt",
      category: "Dairy",
      price: 1.2,
      image: "https://via.placeholder.com/50",
      unit: "litre",
    },
    {
      id: "9",
      name: "Lettuce",
      category: "Vegetables",
      price: 0.9,
      image: "https://via.placeholder.com/50",
      unit: "item",
    },
  ];

  useEffect(() => {
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
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "High to Low") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result.slice(0, page * 6));
  }, [searchQuery, selectedCategory, sortOption, page]);

  interface QuantityMap {
    [productId: string]: number;
  }

  const handleQuantityChange = (item: ShopNowProduct, delta: number) => {
    setQuantities((prev: QuantityMap) => {
      const newQty = Math.max((prev[item.id] || 0) + delta, 0);
      return { ...prev, [item.id]: newQty };
    });
  };

  const handleAddToCart = (item: ShopNowProduct) => {
    const quantity = quantities[item.id] || 0;
    if (quantity > 0) {
      addItem({ ...item, quantity });
      Toast.show({
        type: "success",
        text1: "Added to Cart",
        text2: `${item.name} x${quantity} added to cart.`,
      });
      setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
    }
  };

  const isFilterActive = selectedCategory !== "All" || sortOption !== "None";

  return (
    <View style={styles.container}>
      {/* Search Bar */}
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
            <Picker.Item label="Fruits" value="Fruits" />
            <Picker.Item label="Dairy" value="Dairy" />
            <Picker.Item label="Bakery" value="Bakery" />
            <Picker.Item label="Vegetables" value="Vegetables" />
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
        numColumns={3} // Changed to 3 columns
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={{ paddingBottom: 100 }}
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
