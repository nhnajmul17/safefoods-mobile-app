import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { Appearance, useColorScheme } from "react-native"; // Import Appearance
import { Link } from "expo-router";

// Get device dimensions for responsive design
const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const colorScheme = useColorScheme(); // Get the current color scheme (system or overridden)

  // Toggle theme on button press
  const toggleTheme = () => {
    const newScheme = colorScheme === "dark" ? "light" : "dark";
    Appearance.setColorScheme(newScheme); // Override the system color scheme
  };

  // Sample data for categories and products
  const categories = [
    {
      id: "1",
      name: "Fruits",
      icon: "https://cdn-icons-png.flaticon.com/512/415/415682.png",
    },
    {
      id: "2",
      name: "Vegetables",
      icon: "https://cdn-icons-png.flaticon.com/512/2153/2153788.png",
    },
    {
      id: "3",
      name: "Cheeses",
      icon: "https://cdn-icons-png.flaticon.com/512/3050/3050158.png",
    },
    {
      id: "4",
      name: "Meat",
      icon: "https://cdn-icons-png.flaticon.com/512/3143/3143643.png",
    },
  ];

  const products = [
    {
      id: "1",
      name: "Bell Pepper Red",
      image:
        "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      weight: "1kg",
      price: "5.99$",
    },
    {
      id: "2",
      name: "Lamb Meat",
      image:
        "https://images.unsplash.com/photo-1603048588665-791ca8aea617?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      weight: "1kg",
      price: "44.99$",
    },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colorScheme === "dark" ? "#1a1a1a" : "#f5f5f5" },
      ]}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colorScheme === "dark" ? "#1a1a1a" : "#f5f5f5"}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/men/44.jpg",
              }}
              style={styles.avatar}
              // defaultSource={require("../assets/images/placeholder.png")}
              onError={(e) =>
                console.log("Avatar load error:", e.nativeEvent.error)
              }
            />
            <View>
              <Text
                style={[
                  styles.greeting,
                  { color: colorScheme === "dark" ? "#aaa" : "#888" },
                ]}
              >
                Good morning
              </Text>
              <Text
                style={[
                  styles.userName,
                  { color: colorScheme === "dark" ? "#fff" : "#333" },
                ]}
              >
                MSajib
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.themeButton,
              { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
            ]}
            onPress={toggleTheme}
          >
            <Feather
              name={colorScheme === "dark" ? "sun" : "moon"}
              size={24}
              color={colorScheme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
          ]}
        >
          <Feather
            name="search"
            size={20}
            color={colorScheme === "dark" ? "#ccc" : "#aaa"}
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              { color: colorScheme === "dark" ? "#fff" : "#333" },
            ]}
            placeholder="Search category"
            placeholderTextColor={colorScheme === "dark" ? "#ccc" : "#aaa"}
          />
        </View>

        {/* Promotion Banner */}
        <View
          style={[
            styles.bannerContainer,
            { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
          ]}
        >
          <View style={styles.bannerImageContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1467453678174-768ec283a940?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
              }}
              style={styles.bannerImage}
              resizeMode="cover"
              // defaultSource={require("../assets/images/placeholder.png")}
              onError={(e) =>
                console.log("Banner load error:", e.nativeEvent.error)
              }
            />
          </View>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerSmallText}>Ramadan Offers</Text>
            <Text style={styles.bannerLargeText}>Get 25%</Text>
            <TouchableOpacity style={styles.grabButton}>
              <Text style={styles.grabButtonText}>Grab Offer</Text>
              <AntDesign name="arrowright" size={16} color="#27ae60" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colorScheme === "dark" ? "#fff" : "#333" },
              ]}
            >
              Categories
            </Text>
            <Text style={styles.emoji}>😊</Text>
          </View>

          <TouchableOpacity>
            <Link href={"/category"}>
              <Text style={styles.seeAllText}>See all</Text>
            </Link>
          </TouchableOpacity>
        </View>

        {/* Category Icons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryItem}>
              <View
                style={[
                  styles.categoryIconContainer,
                  { backgroundColor: colorScheme === "dark" ? "#444" : "#fff" },
                ]}
              >
                <Image
                  source={{ uri: category.icon }}
                  style={styles.categoryIcon}
                  // defaultSource={require("../assets/images/placeholder.png")}
                  onError={(e) =>
                    console.log(
                      `Category icon load error (${category.name}):`,
                      e.nativeEvent.error
                    )
                  }
                />
              </View>
              <Text
                style={[
                  styles.categoryText,
                  { color: colorScheme === "dark" ? "#fff" : "#333" },
                ]}
              >
                {category.name}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Best Selling Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colorScheme === "dark" ? "#fff" : "#333" },
              ]}
            >
              Best selling
            </Text>
            <Text style={styles.emoji}>🔥</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Product Cards */}
        <View style={styles.productsContainer}>
          {products.map((product) => (
            <View
              key={product.id}
              style={[
                styles.productCard,
                { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
              ]}
            >
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
                // defaultSource={require("../assets/images/placeholder.png")}
                onError={(e) =>
                  console.log(
                    `Product image load error (${product.name}):`,
                    e.nativeEvent.error
                  )
                }
              />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  bannerContainer: {
    flexDirection: "row",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 120,
  },
  bannerImageContainer: {
    flex: 1,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerContent: {
    flex: 1,
    backgroundColor: "#27ae60",
    padding: 16,
    justifyContent: "center",
  },
  bannerSmallText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  bannerLargeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 8,
  },
  grabButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  grabButtonText: {
    color: "#27ae60",
    fontWeight: "500",
    marginRight: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emoji: {
    fontSize: 18,
    marginLeft: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: "#27ae60",
    fontWeight: "500",
  },
  categoriesContainer: {
    paddingLeft: 16,
    marginBottom: 24,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    width: 30,
    height: 30,
  },
  categoryText: {
    fontSize: 14,
  },
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
