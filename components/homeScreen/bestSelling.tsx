import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
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
    id: "6",
    name: "Beef Steak",
    image:
      "https://images.unsplash.com/photo-1680538491591-7ce20c900f4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhZnxlbnwwfHwwfHx8MA%3D%3D",
    weight: "1kg",
    price: 14.99,
  },
];

export default function HomeBestSelling() {
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
  };

  return (
    <>
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
    </>
  );
}

const styles = StyleSheet.create({
  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginBottom: 80,
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
