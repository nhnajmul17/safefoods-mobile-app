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

const { width } = Dimensions.get("window");

const products = [
  {
    id: "9",
    name: "Cheddar",
    image:
      "https://images.unsplash.com/photo-1683314573422-649a3c6ad784?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hlZGRhciUyMGNoZWVzZXxlbnwwfHwwfHx8MA%3D%3D",
    weight: "500g",
    price: "7.99$",
  },
  {
    id: "10",
    name: "Brie",
    image:
      "https://images.unsplash.com/photo-1607127368565-0fc09ac36028?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z291ZGElMjBjaGVlc2V8ZW58MHx8MHx8fDA%3D",
    weight: "500g",
    price: "9.49$",
  },
  {
    id: "11",
    name: "Gouda",
    image:
      "https://images.unsplash.com/photo-1632200729570-1043effd1b77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBhcm1lYXNhbiUyMGNoZWVzZXxlbnwwfHwwfHx8MA%3D%3D",
    weight: "500g",
    price: "8.99$",
  },
  {
    id: "12",
    name: "Parmesan",
    image:
      "https://images.unsplash.com/photo-1669908978664-485e69bc26cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGFybWVhc2FuJTIwY2hlZXNlfGVufDB8fDB8fHww",
    weight: "500g",
    price: "10.99$",
  },
];

export default function CheeseScreen() {
  const colorScheme = useColorScheme();
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
              <TouchableOpacity style={styles.addButton}>
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
