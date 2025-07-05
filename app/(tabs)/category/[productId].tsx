import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useCartStore } from "@/store/cartStore";
import Toast from "react-native-toast-message";

const products = [
  // Fruits
  {
    id: "1",
    name: "Apple",
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    weight: "1kg",
    price: "3.99$",
    description:
      "Apples are crisp, juicy fruits, perfect for snacking or baking.",
    organic: "100% Organic",
    expiration: "1 Month",
    reviews: "4.5 (320) Reviews",
    calories: "95 kcal 100 Gram",
  },
  {
    id: "2",
    name: "Banana",
    image:
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmFuYW5hfGVufDB8fDB8fHww",
    weight: "1kg",
    price: "2.49$",
    description:
      "Bananas are sweet, energy-packed fruits, great for smoothies.",
    organic: "100% Organic",
    expiration: "2 Weeks",
    reviews: "4.7 (150) Reviews",
    calories: "89 kcal 100 Gram",
  },
  {
    id: "3",
    name: "Orange",
    image:
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    weight: "1kg",
    price: "3.29$",
    description:
      "Oranges are juicy and rich in vitamin C, ideal for a healthy diet.",
    organic: "100% Organic",
    expiration: "1 Month",
    reviews: "4.6 (200) Reviews",
    calories: "47 kcal 100 Gram",
  },
  {
    id: "4",
    name: "Strawberry",
    image:
      "https://plus.unsplash.com/premium_photo-1667049291185-6270613405aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3RyYXdiZWVyeXxlbnwwfHwwfHx8MA%3D%3D",
    weight: "500g",
    price: "4.99$",
    description: "Strawberries are sweet, red berries, perfect for desserts.",
    organic: "100% Organic",
    expiration: "1 Week",
    reviews: "4.8 (180) Reviews",
    calories: "32 kcal 100 Gram",
  },
  // Meat
  {
    id: "5",
    name: "Chicken Breast",
    image:
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    weight: "1kg",
    price: "9.99$",
    description: "Chicken breast is lean, versatile meat, great for grilling.",
    organic: "Free Range",
    expiration: "1 Week",
    reviews: "4.4 (90) Reviews",
    calories: "165 kcal 100 Gram",
  },
  {
    id: "6",
    name: "Beef Steak",
    image:
      "https://images.unsplash.com/photo-1680538491591-7ce20c900f4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhZnxlbnwwfHwwfHx8MA%3D%3D",
    weight: "1kg",
    price: "14.99$",
    description: "Beef steak is a juicy cut, perfect for barbecues.",
    organic: "Grass Fed",
    expiration: "1 Week",
    reviews: "4.7 (120) Reviews",
    calories: "271 kcal 100 Gram",
  },
  {
    id: "7",
    name: "Mutton Leg",
    image:
      "https://images.unsplash.com/photo-1630334337820-84afb05acf3a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFtYiUyMG1lYXR8ZW58MHx8MHx8fDA%3D",
    weight: "1kg",
    price: "12.49$",
    description: "Mutton leg is tender and flavorful, ideal for roasting.",
    organic: "Free Range",
    expiration: "1 Week",
    reviews: "4.5 (80) Reviews",
    calories: "242 kcal 100 Gram",
  },
  {
    id: "8",
    name: "Lamb Chop",
    image:
      "https://plus.unsplash.com/premium_photo-1667545932065-59f39c3c4f2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGFtYiUyMG1lYXR8ZW58MHx8MHx8fDA%3D",
    weight: "1kg",
    price: "19.99$",
    description: "Lamb chops are succulent, perfect for grilling.",
    organic: "Grass Fed",
    expiration: "1 Week",
    reviews: "4.8 (100) Reviews",
    calories: "294 kcal 100 Gram",
  },
  // Cheese
  {
    id: "9",
    name: "Cheddar",
    image:
      "https://images.unsplash.com/photo-1683314573422-649a3c6ad784?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hlZGRhciUyMGNoZWVzZXxlbnwwfHwwfHx8MA%3D%3D",
    weight: "500g",
    price: "7.99$",
    description: "Cheddar is a sharp, tangy cheese, great for sandwiches.",
    organic: "100% Organic",
    expiration: "6 Months",
    reviews: "4.6 (150) Reviews",
    calories: "403 kcal 100 Gram",
  },
  {
    id: "10",
    name: "Brie",
    image:
      "https://images.unsplash.com/photo-1607127368565-0fc09ac36028?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z291ZGElMjBjaGVlc2V8ZW58MHx8MHx8fDA%3D",
    weight: "500g",
    price: "9.49$",
    description: "Brie is a creamy, soft cheese, perfect for cheese boards.",
    organic: "100% Organic",
    expiration: "1 Month",
    reviews: "4.9 (200) Reviews",
    calories: "334 kcal 100 Gram",
  },
  {
    id: "11",
    name: "Gouda",
    image:
      "https://images.unsplash.com/photo-1632200729570-1043effd1b77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBhcm1lYXNhbiUyMGNoZWVzZXxlbnwwfHwwfHx8MA%3D%3D",
    weight: "500g",
    price: "8.99$",
    description: "Gouda is a mild, nutty cheese, ideal for snacking.",
    organic: "100% Organic",
    expiration: "3 Months",
    reviews: "4.7 (130) Reviews",
    calories: "356 kcal 100 Gram",
  },
  {
    id: "12",
    name: "Parmesan",
    image:
      "https://images.unsplash.com/photo-1669908978664-485e69bc26cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGFybWVhc2FuJTIwY2hlZXNlfGVufDB8fDB8fHww",
    weight: "500g",
    price: "10.99$",
    description: "Parmesan is a hard, salty cheese, perfect for grating.",
    organic: "100% Organic",
    expiration: "1 Year",
    reviews: "4.8 (180) Reviews",
    calories: "431 kcal 100 Gram",
  },

  //vegetables
  {
    id: "13",
    name: "Bell Pepper Red",
    image:
      "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    weight: "1kg",
    price: "5.99$",
    description:
      "Bell peppers are sweet, crunchy vegetables, great for salads.",
    organic: "100% Organic",
    expiration: "1 Month",
    reviews: "4.5 (320) Reviews",
  },
  {
    id: "14",
    name: "Broccoli",
    image:
      "https://plus.unsplash.com/premium_photo-1702403157830-9df749dc6c1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YnJvY2NvbGl8ZW58MHx8MHx8fDA%3D",
    weight: "500g",
    price: "2.79$",
    description: "Broccoli is a nutrient-rich vegetable, great for steaming.",
    organic: "100% Organic",
    expiration: "1 Week",
    reviews: "4.6 (200) Reviews",
  },
  {
    id: "15",
    name: "Papaya",
    image:
      "https://plus.unsplash.com/premium_photo-1675639895212-696149c275f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGFwYXlhfGVufDB8fDB8fHww",
    weight: "1kg",
    price: "3.49$",
    description:
      "Papaya is a tropical fruit, sweet and juicy, great for smoothies.",
    organic: "100% Organic",
    expiration: "1 Week",
    reviews: "4.7 (150) Reviews",
  },
  {
    id: "16",
    name: "Lettuce",
    image:
      "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGV0dHVjZXxlbnwwfHwwfHx8MA%3D%3D",
    weight: "500g",
    price: "1.99$",
    description:
      "Lettuce is a leafy green vegetable, perfect for salads and wraps.",
    organic: "100% Organic",
    expiration: "1 Week",
    reviews: "4.8 (180) Reviews",
  },
  {
    id: "17",
    name: "Carrot",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    weight: "1kg",
    price: "2.49$",
    description: "Carrots are crunchy, sweet vegetables, great for snacking.",
    organic: "100% Organic",
    expiration: "1 Month",
    reviews: "4.5 (320) Reviews",
  },
  {
    id: "18",
    name: "Cabbage",
    image:
      "https://images.unsplash.com/photo-1730815046052-75a1b90117e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FiYmFnZXxlbnwwfHwwfHx8MA%3D%3D",
    weight: "1kg",
    price: "2.99$",
    description:
      "Cabbage is a leafy green vegetable, great for salads and stir-fries.",
    organic: "100% Organic",
    expiration: "1 Month",
    reviews: "4.6 (200) Reviews",
  },
  {
    id: "19",
    name: "Tomato",
    image:
      "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dG9tYXRvfGVufDB8fDB8fHww",
    weight: "1kg",
    price: "3.29$",
    description:
      "Tomatoes are juicy, red fruits, perfect for salads and sauces.",
    organic: "100% Organic",
    expiration: "1 Week",
    reviews: "4.7 (150) Reviews",
  },
  {
    id: "20",
    name: "Zucchini",
    image:
      "https://images.unsplash.com/photo-1596056094719-10ba4f7ea650?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8enVjY2hpbml8ZW58MHx8MHx8fDA%3D",
    weight: "1kg",
    price: "2.69$",
    description:
      "Zucchini is a versatile vegetable, great for grilling and baking.",
    organic: "100% Organic",
    expiration: "1 Week",
    reviews: "4.8 (180) Reviews",
  },
];

export default function ProductDetailsScreen() {
  const { productId } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const [quantity, setQuantity] = useState(0);
  // Access the cart store
  const { addItem } = useCartStore();
  // Animation values for buttons
  const decrementScale = useSharedValue(1);
  const incrementScale = useSharedValue(1);
  const addToCartScale = useSharedValue(1);

  // Find the product by ID
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    incrementScale.value = withSpring(0.9, {}, () => {
      incrementScale.value = withSpring(1);
    });
  };

  const handleDecrement = () => {
    setQuantity(quantity > 0 ? quantity - 1 : 0);
    decrementScale.value = withSpring(0.9, {}, () => {
      decrementScale.value = withSpring(1);
    });
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      const cartItem = {
        id: product.id,
        name: product.name,
        image: product.image,
        price: parseFloat(product.price.replace("$", "")), // Convert price string to number
        quantity: quantity,
      };
      addItem(cartItem);
      console.log(`Added ${quantity} ${product.name}(s) to cart`, cartItem);

      // Show toast notification (optional)
      Toast.show({
        type: "success",
        text1: "Added to Cart",
        text2: `${quantity} ${product.name}(s) added to your cart.`,
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });

      // Reset quantity after adding to cart (optional)
      setQuantity(0);
    } else {
      Toast.show({
        type: "error",
        text1: "Invalid Quantity",
        text2: "Please select a quantity greater than 0.",
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
    }

    addToCartScale.value = withSpring(0.95, {}, () => {
      addToCartScale.value = withSpring(1);
    });
  };

  const decrementStyle = useAnimatedStyle(() => ({
    transform: [{ scale: decrementScale.value }],
  }));

  const incrementStyle = useAnimatedStyle(() => ({
    transform: [{ scale: incrementScale.value }],
  }));

  const addToCartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addToCartScale.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            onError={(e) =>
              console.log(
                `Product image load error (${product.name}):`,
                e.nativeEvent.error
              )
            }
          />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.header}>
            <Text style={styles.name}>{product.name}</Text>
            <View style={styles.quantityContainer}>
              <Animated.View style={decrementStyle}>
                <TouchableOpacity
                  onPress={handleDecrement}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityText}>-</Text>
                </TouchableOpacity>
              </Animated.View>
              <Text style={styles.quantity}>{quantity}</Text>
              <Animated.View style={incrementStyle}>
                <TouchableOpacity
                  onPress={handleIncrement}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
          <Text
            style={styles.weightPrice}
          >{`${product.weight}, ${product.price}`}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/2927/2927216.png",
                }}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>{product.organic}</Text>
            </View>
            <View style={styles.infoItem}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/2927/2927217.png",
                }}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>{product.expiration}</Text>
            </View>
            <View style={styles.infoItem}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
                }}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>{product.reviews}</Text>
            </View>
            <View style={styles.infoItem}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/3170/3170733.png",
                }}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>{product.calories}</Text>
            </View>
          </View>
        </View>
      </View>
      <Animated.View style={addToCartStyle}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30, // Rounded edges
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8, // Reduced padding to fill space
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4, // Reduced margin to fill space
  },
  name: {
    fontSize: 28, // Increased font size
    fontWeight: "bold",
    color: "#333",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  quantityButton: {
    padding: 6,
  },
  quantityText: {
    fontSize: 24, // Increased font size
    fontWeight: "bold",
    color: "#27ae60",
  },
  quantity: {
    fontSize: 24, // Increased font size
    fontWeight: "bold",
    marginHorizontal: 16,
    color: "#333",
  },
  weightPrice: {
    fontSize: 20, // Increased font size
    fontWeight: "bold",
    color: "#27ae60",
    marginBottom: 8, // Reduced margin
  },
  description: {
    fontSize: 16, // Increased font size
    color: "#666",
    marginBottom: 8, // Reduced margin
    lineHeight: 24, // Adjusted line height for readability
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 8,
  },
  infoItem: {
    width: "48%", // Maintains two columns
    backgroundColor: "#f9f9f9", // Light background like the image
    borderRadius: 12, // Rounded corners
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2, // Slight shadow for card effect (Android)
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoIcon: {
    width: 24, // Adjusted icon size
    height: 24,
    marginRight: 8,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500", // Slightly lighter than bold
    color: "#666", // Grayish color like the image
    textAlign: "center", // Center text for better alignment
  },
  addToCartButton: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: "#27ae60",
    paddingVertical: 18, // Slightly increased for prominence
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addToCartText: {
    fontSize: 18, // Increased font size
    color: "#fff",
    fontWeight: "bold",
  },
});
