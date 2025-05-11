import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/constants/types";

const { width } = Dimensions.get("window");

const products = [
  {
    id: "1",
    name: "Apple",
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    weight: "1kg",
    price: 3.99,
  },
  {
    id: "2",
    name: "Banana",
    image:
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmFuYW5hfGVufDB8fDB8fHww",
    weight: "1kg",
    price: 2.49,
  },
  {
    id: "3",
    name: "Orange",
    image:
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    weight: "1kg",
    price: 3.29,
  },
  {
    id: "4",
    name: "Strawberry",
    image:
      "https://plus.unsplash.com/premium_photo-1667049291185-6270613405aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3RyYXdiZWVyeXxlbnwwfHwwfHx8MA%3D%3D",
    weight: "500g",
    price: 4.99,
  },
];

export default function FruitScreen() {
  const colorScheme = useColorScheme();
  const { addItem } = useCartStore();

  const handleAddToCart = (product: Product) => {
    const newItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1, // Start with a quantity of 1
    };
    addItem(newItem);
    ToastAndroid.show(`1 ${product.name} added to cart!`, ToastAndroid.SHORT);
  };
  return (
    <ScrollView>
      <View style={styles.productsContainer}>
        {products.map((product) => (
          <View
            key={product.id}
            style={[
              styles.productCard,
              { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
            ]}
          >
            <Link href={`/(tabs)/category/${product.id}`}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
                onError={(e) =>
                  console.log(
                    `Product image load error (${product.name}):`,
                    e.nativeEvent.error
                  )
                }
              />
            </Link>
            <Text
              style={[
                styles.productName,
                { color: colorScheme === "dark" ? "#fff" : "#333" },
              ]}
            >
              {product.name}
            </Text>
            <View style={styles.productPriceRow}>
              <Text
                style={[
                  styles.productWeight,
                  { color: colorScheme === "dark" ? "#aaa" : "#888" },
                ]}
              >
                {product.weight},
              </Text>
              <Text style={styles.productPrice}>{product.price}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCart(product)}
              >
                <Feather name="plus" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginBottom: 80,
    marginTop: 16,
  },
  productCard: {
    width: (width - 48) / 2,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  productPriceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  productWeight: {
    fontSize: 14,
    marginRight: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff6b6b",
    flex: 1,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#27ae60",
    justifyContent: "center",
    alignItems: "center",
  },
});
