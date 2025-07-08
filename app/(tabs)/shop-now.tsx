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

export default function ShopNowScreen() {
  const { addItem } = useCartStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("None");
  const [page, setPage] = useState(1);

  const allProducts: ShopNowProduct[] = [
    {
      id: "909b455c-5054-4b1e-9d4b-56f206da3d54",
      name: "Safe Premium Milk",
      category: "Proteins",
      variants: [
        {
          id: "e9caf159-e9a2-4301-a5c4-944fbdf334ad",
          price: 110,
          originalPrice: 120,
          description: "Fresh milk",
          bestDeal: false,
          discountedSale: false,
          unit: "1L",
          mediaItems: [
            {
              id: "c1d37851-9779-483f-a86d-57c7b5515ddb",
              mediaId: "23f5ec04-5cd7-415e-8559-6d67005e3e55",
              image:
                "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746604594%2Fsafefoods%2Fl6gt9cdmhrmvu3ozrohc.png&w=640&q=75",
              mediaTitle: "Safe Premium Milk",
            },
          ],
        },
      ],
    },
    {
      id: "20e4cf65-ba20-4804-a0ee-b81f4fc2ea3d",
      name: "Desi Beef regular",
      category: "Meat",
      variants: [
        {
          id: "66c423c5-8789-45a3-bcbd-8ce0a9d3e6fb",
          price: 4000,
          originalPrice: 4000,
          description: "Slaughtered every Monday and Thursday.",
          bestDeal: false,
          discountedSale: false,
          unit: "5kg",
          mediaItems: [
            {
              id: "c1d37851-9779-483f-a86d-57c7b5515d0b",
              mediaId: "23f5ec04-5cd7-415e-8559-6d67005e3e57",
              image:
                "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746605224%2Fsafefoods%2Fdbtlwhttruwqn7ckunah.png&w=640&q=75",
              mediaTitle: "Desi Beef regular",
            },
          ],
        },
        {
          id: "e95f72f8-cdfc-4aa4-8595-2a60a6149397",
          price: 800,
          originalPrice: 800,
          description: "Slaughtered every Monday and Thursday.",
          bestDeal: false,
          discountedSale: false,
          unit: "1kg",
          mediaItems: [
            {
              id: "fdc2e021-a9c6-4e2f-87b3-2a06c7fb6d85",
              mediaId: "23f5ec04-5cd7-415e-8559-6d67005e3e57",
              image:
                "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746605257%2Fsafefoods%2Flnhulgb58nueewehjk5d.png&w=384&q=75",
              mediaTitle: "Desi Beef regular",
            },
          ],
        },
      ],
    },
    {
      id: "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
      name: "Organic Carrots",
      category: "Vegetables",
      variants: [
        {
          id: "b2c3d4e5-f6g7-8901-cdef-3456789012cd",
          price: 150,
          originalPrice: 160,
          description: "Fresh organic carrots",
          bestDeal: true,
          discountedSale: true,
          unit: "1kg",
          mediaItems: [
            {
              id: "d4e5f6g7-h8i9-0123-efgh-5678901234ef",
              mediaId: "e5f6g7h8-i9j0-1234-fghi-6789012345fg",
              image:
                "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=60",
              mediaTitle: "Organic Carrots",
            },
          ],
        },
      ],
    },
    {
      id: "b2c3d4e5-f6g7-8901-cdef-2345678901bc",
      name: "Cheddar Cheese",
      category: "Dairy",
      variants: [
        {
          id: "c3d4e5f6-g7h8-9012-defg-4567890123de",
          price: 200,
          originalPrice: 220,
          description: "Freshly made cheddar cheese",
          bestDeal: false,
          discountedSale: true,
          unit: "200g",
          mediaItems: [
            {
              id: "e5f6g7h8-i9j0-1234-fghi-6789012345fg",
              mediaId: "f6g7h8i9-j0k1-2345-ghij-7890123456gh",
              image:
                "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746605017%2Fsafefoods%2Fzktq65tiuaywrj7wpmvv.jpg&w=384&q=75",
              mediaTitle: "Cheddar Cheese",
            },
          ],
        },
      ],
    },
    {
      id: "c3d4e5f6-g7h8-9012-defg-3456789012cd",
      name: "Free Range Eggs",
      category: "Proteins",
      variants: [
        {
          id: "d4e5f6g7-h8i9-0123-efgh-4567890123de",
          price: 300,
          originalPrice: 300,
          description: "Fresh free-range eggs",
          bestDeal: false,
          discountedSale: false,
          unit: "dozen",
          mediaItems: [
            {
              id: "f6g7h8i9-j0k1-2345-ghij-6789012345fg",
              mediaId: "g7h8i9j0-k1l2-3456-hijk-7890123456gh",
              image:
                "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746605028%2Fsafefoods%2Fttqjdgzmamisd9qrx7jp.png&w=640&q=75",
              mediaTitle: "Free Range Eggs",
            },
          ],
        },
      ],
    },
    {
      id: "d4e5f6g7-h8i9-0123-efgh-4567890123de",
      name: "Ghee",
      category: "Oil",
      variants: [
        {
          id: "e5f6g7h8-i9j0-1234-fghi-5678901234ef",
          price: 1200,
          originalPrice: 1300,
          description: "Fresh organic ghee",
          bestDeal: true,
          discountedSale: true,
          unit: "500g",
          mediaItems: [
            {
              id: "g7h8i9j0-k1l2-3456-hijk-7890123456gh",
              mediaId: "h8i9j0k1-l2m3-4567-ijkl-8901234567hi",
              image:
                "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746605042%2Fsafefoods%2Fw3ygtedr1dvuoex9drwd.png&w=384&q=75",
              mediaTitle: "Organic Ghee",
            },
          ],
        },
      ],
    },
    {
      id: "e5f6g7h8-i9j0-1234-fghi-5678901234ef",
      name: "Fresh Chicken",
      category: "Meat",
      variants: [
        {
          id: "f6g7h8i9-j0k1-2345-ghij-6789012345fg",
          price: 600,
          originalPrice: 600,
          description: "Freshly cut chicken",
          bestDeal: false,
          discountedSale: false,
          unit: "1kg",
          mediaItems: [
            {
              id: "h8i9j0k1-l2m3-4567-ijkl-8901234567hi",
              mediaId: "i9j0k1l2-m3n4-5678-jklm-9012345678ij",
              image:
                "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746604823%2Fsafefoods%2Fz1ffllbrcrozxgvqrpsw.webp&w=384&q=75",
              mediaTitle: "Fresh Chicken",
            },
          ],
        },
        {
          id: "g7h8i9j0-k1l2-3456-hijk-7890123456gh",
          price: 2800,
          originalPrice: 2800,
          description: "Freshly cut chicken",
          bestDeal: false,
          discountedSale: false,
          unit: "5kg",
          mediaItems: [
            {
              id: "i9j0k1l2-m3n4-5678-jklm-9012345678ij",
              mediaId: "j0k1l2m3-n4o5-6789-klmn-0123456789jk",
              image:
                "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1751343613%2Fsafefoods%2Fdupvetodkgqm1vvwbjsh.webp&w=640&q=75",
              mediaTitle: "Fresh Chicken",
            },
          ],
        },
      ],
    },
  ];

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
            <Picker.Item label="Proteins" value="Proteins" />
            <Picker.Item label="Meat" value="Meat" />
            <Picker.Item label="Vegetables" value="Vegetables" />
            <Picker.Item label="Dairy" value="Dairy" />
            <Picker.Item label="Oil" value="Oil" />
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
