import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import Toast from "react-native-toast-message";
import CategoryProductCard from "@/components/categoryScreen/categoryProductCard";
import { allProductsData } from "@/hooks/productsData";
import {
  ShopNowProduct,
  ProductVariant,
} from "@/components/shopNowScreen/shopNowProductCard";

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
  const [products, setProducts] = useState<ShopNowProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [selectedVariants, setSelectedVariants] = useState<{
    [productId: string]: ProductVariant;
  }>({});

  useEffect(() => {
    setLoading(true);
    // Uncomment below to fetch from API
    /*
    fetch(`https://your-api-url.com/products?category=${categoryTitle}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setSelectedVariants(
          Object.fromEntries(data.products.map((product: ShopNowProduct) => [product.id, product.variants[0]]))
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
    */
    // Local data
    const filtered = allProductsData.filter(
      (product) => product.categoryTitle === categoryTitle
    );
    setProducts(filtered);
    setSelectedVariants(
      Object.fromEntries(
        filtered.map((product) => [product.id, product.variants[0]])
      )
    );
    setLoading(false);
  }, [categoryTitle]);

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

  if (!products.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noProducts}>
          No products found for this category.
        </Text>
      </View>
    );
  }

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
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={{ paddingBottom: 100 }}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  noProducts: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 32,
    fontWeight: "bold",
  },
});
