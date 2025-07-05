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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/constants/types";
import Toast from "react-native-toast-message";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");

const products = [
  {
    id: "5",
    name: "Chicken Breast",
    image:
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    weight: "1kg",
    price: 9.99,
  },
  {
    id: "6",
    name: "Beef Steak",
    image:
      "https://images.unsplash.com/photo-1680538491591-7ce20c900f4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhZnxlbnwwfHwwfHx8MA%3D%3D",
    weight: "1kg",
    price: 14.99,
  },
  {
    id: "7",
    name: "Mutton Leg",
    image:
      "https://images.unsplash.com/photo-1630334337820-84afb05acf3a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFtYiUyMG1lYXR8ZW58MHx8MHx8fDA%3D",
    weight: "1kg",
    price: 12.49,
  },
  {
    id: "8",
    name: "Lamb Chop",
    image:
      "https://plus.unsplash.com/premium_photo-1667545932065-59f39c3c4f2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGFtYiUyMG1lYXR8ZW58MHx8MHx8fDA%3D",
    weight: "1kg",
    price: 19.99,
  },
];

export default function MeatScreen() {
  const colorScheme = useColorScheme();
  const { addItem } = useCartStore();

  const handleAddToCart = (product: Product) => {
    const newItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    };
    addItem(newItem);
    // ToastAndroid.show(`1 ${product.name} added to cart!`, ToastAndroid.SHORT);
    Toast.show({
      type: "success",
      text1: "Added to Cart",
      text2: `1 ${product.name}(s) added to your cart.`,
      text1Style: { fontSize: 16, fontWeight: "bold" },
      text2Style: { fontSize: 14, fontWeight: "bold" },
    });
  };
  return (
    <ScrollView>
      <View style={styles.productsContainer}>
        {products.map((product) => (
          <View
            key={product.id}
            style={[
              styles.productCard,
              { backgroundColor: Colors.light.background },
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
            <Text style={[styles.productName, { color: Colors.light.text }]}>
              {product.name}
            </Text>

            <View style={styles.productPriceRow}>
              <Text
                style={[styles.productWeight, { color: Colors.light.text }]}
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
