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
    id: "13",
    name: "Bell Pepper Red",
    image:
      "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    weight: "1kg",
    price: "5.99$",
  },
  {
    id: "14",
    name: "Broccoli",
    image:
      "https://plus.unsplash.com/premium_photo-1702403157830-9df749dc6c1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YnJvY2NvbGl8ZW58MHx8MHx8fDA%3D",
    weight: "500g",
    price: "2.79$",
  },
  {
    id: "15",
    name: "Papaya",
    image:
      "https://plus.unsplash.com/premium_photo-1675639895212-696149c275f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGFwYXlhfGVufDB8fDB8fHww",
    weight: "1kg",
    price: "3.49$",
  },
  {
    id: "16",
    name: "Lettuce",
    image:
      "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGV0dHVjZXxlbnwwfHwwfHx8MA%3D%3D",
    weight: "500g",
    price: "1.99$",
  },
  {
    id: "17",
    name: "Carrot",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    weight: "1kg",
    price: "2.49$",
  },
  {
    id: "18",
    name: "Cabbage",
    image:
      "https://images.unsplash.com/photo-1730815046052-75a1b90117e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FiYmFnZXxlbnwwfHwwfHx8MA%3D%3D",
    weight: "1kg",
    price: "2.99$",
  },
  {
    id: "19",
    name: "Tomato",
    image:
      "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dG9tYXRvfGVufDB8fDB8fHww",
    weight: "1kg",
    price: "3.29$",
  },
  {
    id: "20",
    name: "Zucchini",
    image:
      "https://images.unsplash.com/photo-1596056094719-10ba4f7ea650?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8enVjY2hpbml8ZW58MHx8MHx8fDA%3D",
    weight: "1kg",
    price: "2.69$",
  },
];

export default function VegetableScreen() {
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
