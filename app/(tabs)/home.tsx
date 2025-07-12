import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { useColorScheme } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import GestureHandlerRootView
import HomeCategorySection from "@/components/homeScreen/categorySection";
import HomeBestSelling from "@/components/homeScreen/bestSelling";
import WhySafeFoodsSection from "@/components/homeScreen/whySafefoods";
import { Colors, lightGreenColor } from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import BannerCarousel from "@/components/homeScreen/bannerCarousel";
// Get device dimensions for responsive design
// const { width: screenWidth } = Dimensions.get("window");

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { userId, userName } = useAuthStore();

  // Toggle theme on button press
  //   const toggleTheme = () => {
  //     const newScheme = colorScheme === "dark" ? "light" : "dark";
  //     Appearance.setColorScheme(newScheme);
  //   };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: Colors.light.background }]}
      >
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
          backgroundColor={colorScheme === "dark" ? "#1a1a1a" : "#f5f5f5"}
        />
        {/* Header */}
        <View style={styles.appHeader}>
          <Image
            source={{
              uri: "https://safefoods.com.bd/_next/image?url=%2Fassets%2Fimages%2Flogo-safefoods.png&w=64&q=75",
            }}
            style={styles.appIcon}
          />

          <View style={styles.header}>
            {/* User Info */}
            {userId && (
              <View style={styles.userInfo}>
                <View>
                  <Text style={[styles.greeting, { color: Colors.light.text }]}>
                    {(() => {
                      const hour = new Date().getHours();
                      if (hour < 12) return "Good Morning";
                      if (hour < 18) return "Good Afternoon";
                      return "Good Evening";
                    })()}
                  </Text>
                  <Text style={[styles.userName, { color: Colors.light.text }]}>
                    {userName || "John Abram"}
                  </Text>
                </View>
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/men/44.jpg",
                  }}
                  style={styles.avatar}
                  onError={(e) =>
                    console.log("Avatar load error:", e.nativeEvent.error)
                  }
                />
              </View>
            )}
          </View>

          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1467453678174-768ec283a940?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
              }}
              style={styles.heroImage}
            />
            <Text style={styles.heroText}>
              Safe Food {"\n"}
              <Text style={{ fontSize: 26 }}>For Your Family</Text>.
            </Text>
          </View>

          {/*  Banner Carousel */}
          <BannerCarousel />

          {/* Categories Section */}
          <HomeCategorySection />

          {/* Best Selling Section */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={[styles.sectionTitle, { color: Colors.light.text }]}>
                Best selling
              </Text>
              <Text style={styles.emoji}>🔥</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Product Cards */}
          <HomeBestSelling />
          <WhySafeFoodsSection />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: lightGreenColor,
  },
  appIcon: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },

  // user info styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 12,
  },
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  // theme button styles
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
  scrollContent: {
    paddingBottom: 40,
  },

  // Hero Section
  heroSection: {
    position: "relative",
    height: 150,
    // marginBottom: 16,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0.5,
  },
  heroText: {
    position: "absolute",
    color: "#3d4e3dff",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    top: "50%",
    transform: [{ translateY: -50 }],
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
});
