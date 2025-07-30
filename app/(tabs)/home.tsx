import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
} from "react-native";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import HomeCategorySection from "@/components/homeScreen/categorySection";
import HomeBestSelling from "@/components/homeScreen/bestSelling";
import WhySafeFoodsSection from "@/components/homeScreen/whySafefoods";
import { Colors, lightGreenColor } from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import BannerCarousel from "@/components/homeScreen/bannerCarousel";
import { useCartStore } from "@/store/cartStore"; // Import cart store
import { API_URL } from "@/constants/variables"; // Import API URL

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { userId, accessToken, userName } = useAuthStore();
  const { addItem, isCartFetchedFromApi } = useCartStore();

  const [isCategoryLoaded, setIsCategoryLoaded] = React.useState(false);
  const [isReadyToRender, setIsReadyToRender] = React.useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const textZoomAnim = React.useRef(new Animated.Value(0)).current;

  // Fetch cart items only when userId and accessToken are present and not fetched yet
  useEffect(() => {
    const fetchCartItems = async () => {
      if (userId && accessToken && !isCartFetchedFromApi) {
        try {
          const response = await fetch(`${API_URL}/v1/cart?userId=${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await response.json();
          if (data.success) {
            // Map API items to CartItem format and add to store
            data.data.items.forEach((item: any) => {
              addItem({
                id: item.id,
                variantId: item.variantProductId,
                name: item.productTitle,
                image: item.productImageUrl || "https://via.placeholder.com/50",
                price: item.productPrice,
                unit: item.unitTitle,
                quantity: item.quantity,
              });
            });
            useCartStore.setState({ isCartFetchedFromApi: true }); // Mark as fetched
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      }
    };

    fetchCartItems();
  }, [isCartFetchedFromApi]); // Trigger on userId, accessToken, or isCartFetchedFromApi change

  // Animation and render logic
  useEffect(() => {
    fadeAnim.setValue(0);
    textZoomAnim.setValue(0);
    setIsReadyToRender(false);

    const timeout = setTimeout(() => {
      setIsReadyToRender(true);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(textZoomAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, 50); // Prevent initial blink

    return () => clearTimeout(timeout);
  }, []); // Run once on mount

  const textTransform = {
    transform: [
      {
        scale: textZoomAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        }),
      },
      {
        translateY: textZoomAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: Colors.light.background }]}
      >
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
          backgroundColor={colorScheme === "dark" ? "#1a1a1a" : "#f5f5f5"}
        />

        {isReadyToRender && (
          <Animated.View
            style={{
              flex: 1,
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
          >
            {/* Header */}
            <View style={styles.appHeader}>
              <Image
                source={{
                  uri: "https://safefoods.com.bd/_next/image?url=%2Fassets%2Fimages%2Flogo-safefoods.png&w=64&q=75",
                }}
                style={styles.appIcon}
              />

              <View style={styles.header}>
                {userId && (
                  <View style={styles.userInfo}>
                    <View>
                      <Text
                        style={[styles.greeting, { color: Colors.light.text }]}
                      >
                        {(() => {
                          const hour = new Date().getHours();
                          if (hour < 12) return "Good Morning";
                          if (hour < 18) return "Good Afternoon";
                          return "Good Evening";
                        })()}
                      </Text>
                      <Text
                        style={[styles.userName, { color: Colors.light.text }]}
                      >
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
                <Animated.Text style={[styles.heroText, textTransform]}>
                  Safe Food {"\n"}
                  <Text style={{ fontSize: 26 }}>For Your Family</Text>.
                </Animated.Text>
              </View>

              {/* Banner Carousel */}
              <BannerCarousel />

              {/* Categories Section */}
              <HomeCategorySection
                isCategoryLoaded={isCategoryLoaded}
                setIsCategoryLoaded={setIsCategoryLoaded}
              />

              {/* Best Selling Section */}
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Text
                    style={[styles.sectionTitle, { color: Colors.light.text }]}
                  >
                    Best selling
                  </Text>
                  <Text style={styles.emoji}>🔥</Text>
                </View>
              </View>

              <HomeBestSelling
                isCategoryLoaded={isCategoryLoaded}
                setIsCategoryLoaded={setIsCategoryLoaded}
              />

              <WhySafeFoodsSection />
            </ScrollView>
          </Animated.View>
        )}
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
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    position: "relative",
    height: 150,
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
    top: "25%",
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
});
