import React, { useState } from "react";
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
import { AntDesign } from "@expo/vector-icons";
import { Appearance, useColorScheme } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import GestureHandlerRootView
import HomeCategorySection from "@/components/homeScreen/categorySection";
import HomeBestSelling from "@/components/homeScreen/bestSelling";
import WhySafeFoodsSection from "@/components/homeScreen/whySafefoods";
import { Colors, lightGreenColor } from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import Carousel from "react-native-snap-carousel";

// Get device dimensions for responsive design
const { width: screenWidth } = Dimensions.get("window");

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { userId, userName } = useAuthStore();
  const [activeSlide, setActiveSlide] = useState(0);

  // Toggle theme on button press
  const toggleTheme = () => {
    const newScheme = colorScheme === "dark" ? "light" : "dark";
    Appearance.setColorScheme(newScheme);
  };

  const promotions = [
    {
      id: "1",
      image: {
        uri: "https://images.unsplash.com/photo-1467453678174-768ec283a940?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      },
      title: "Get 20% Off!",
      subtitle: "On 3 kg chicken purchase",
    },
    {
      id: "2",
      image: {
        uri: "https://images.unsplash.com/photo-1467453678174-768ec283a940?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      },
      title: "Special Offer!",
      subtitle: "Buy 2 kg mutton get 1 free",
    },
  ];
  const renderPromotionItem = ({ item }) => (
    <View style={styles.promoCard}>
      <Image source={item.image} style={styles.promoImage} />
      <View style={styles.promoTextContainer}>
        <Text style={styles.promoTitle}>{item.title}</Text>
        <Text style={styles.promoSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

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

          <View style={styles.promoSection}>
            {/* <Carousel
              data={promotions}
              renderItem={renderPromotionItem}
              sliderWidth={screenWidth}
              itemWidth={screenWidth - 32}
              autoplay={true}
              loop={true}
              autoplayInterval={3000}
              onSnapToItem={(index) => setActiveSlide(index)}
            /> */}
          </View>
          {/* Promotion Banner */}
          <View
            style={[
              styles.bannerContainer,
              { backgroundColor: Colors.light.background },
            ]}
          >
            <View style={styles.bannerImageContainer}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1467453678174-768ec283a940?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                }}
                style={styles.bannerImage}
                resizeMode="cover"
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
    marginBottom: 16,
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

  // Promotion Section
  promoSection: {
    paddingVertical: 16,
  },
  promoCard: {
    backgroundColor: "#f1c40f",
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  promoImage: {
    width: "100%",
    height: 150,
  },
  promoTextContainer: {
    padding: 16,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  promoSubtitle: {
    fontSize: 14,
    color: "#333",
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
});
