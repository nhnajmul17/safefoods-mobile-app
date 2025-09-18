import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
  TouchableOpacity,
  Platform,
} from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import HomeCategorySection from "@/components/homeScreen/categorySection";
import HomeBestDeal from "@/components/homeScreen/bestDeal";
import WhySafeFoodsSection from "@/components/homeScreen/whySafefoods";
import { Colors, deepGreenColor } from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import BannerCarousel from "@/components/homeScreen/bannerCarousel";
import { useCartStore } from "@/store/cartStore";
import { API_URL } from "@/constants/variables";
import { initializeCartFromApi } from "@/utils/cartUtils";
import { router } from "expo-router";
import safefoodLogoPng from "@/assets/images/logo-safefood.png";
import HomeOnSale from "@/components/homeScreen/onSale";

export default function HomeScreen() {
  const { userId, userName } = useAuthStore();
  const { addItem, isCartFetchedFromApi } = useCartStore();

  const [isCategoryLoaded, setIsCategoryLoaded] = React.useState(false);
  const [isReadyToRender, setIsReadyToRender] = React.useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const textZoomAnim = React.useRef(new Animated.Value(0)).current;

  // Initialize cart from API for logged-in users
  useEffect(() => {
    if (userId && !isCartFetchedFromApi) {
      initializeCartFromApi();
    }
  }, [userId, isCartFetchedFromApi]);

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
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Custom Header with consistent height */}
        <View style={styles.appHeader}>
          <View style={styles.logoContainer}>
            <View
              style={{
                backgroundColor: "#999",
                padding: 0.5,
              }}
            >
              <Image source={safefoodLogoPng} style={styles.appLogo} />
            </View>
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <Text style={styles.appTitleText}>Safe Food</Text>
              <Text style={[styles.appSubtitleText]}>for your family</Text>
            </View>
          </View>
          <View style={styles.userInfoContainer}>
            {!userId ? (
              <TouchableOpacity
                style={styles.iconCircle}
                onPress={() => router.push("/login-with-phone")}
              >
                <Icon name="person" size={24} color="#fff" />
              </TouchableOpacity>
            ) : (
              <View style={styles.userInfo}>
                <View style={styles.userText}>
                  <Text style={[styles.greeting, { color: Colors.dark.text }]}>
                    {(() => {
                      const hour = new Date().getHours();
                      if (hour < 12) return "Good Morning";
                      if (hour < 18) return "Good Afternoon";
                      return "Good Evening";
                    })()}
                  </Text>
                  <Text style={[styles.userName, { color: Colors.dark.text }]}>
                    {userName || "John Abram"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.avatarCircle}
                  onPress={() => router.push("/menu")}
                >
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                    }}
                    style={styles.avatar}
                    onError={(e) =>
                      console.log("Avatar load error:", e.nativeEvent.error)
                    }
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

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
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Hero Section */}
              {/* <View style={styles.heroSection}>
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
              </View> */}

              {/* Banner Carousel */}
              <BannerCarousel />

              {/* Categories Section */}
              <HomeCategorySection
                isCategoryLoaded={isCategoryLoaded}
                setIsCategoryLoaded={setIsCategoryLoaded}
              />

              {/* Best Deal Section */}
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Text
                    style={[styles.sectionTitle, { color: Colors.light.text }]}
                  >
                    Best Deal
                  </Text>
                  <Text style={styles.emoji}>🔥</Text>
                </View>
              </View>

              <HomeBestDeal />

              {/* On Sale Section */}
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Text
                    style={[styles.sectionTitle, { color: Colors.light.text }]}
                  >
                    On Sale
                  </Text>
                  <Text style={styles.emoji}>🔥</Text>
                </View>
              </View>

              <HomeOnSale />

              <WhySafeFoodsSection />
            </ScrollView>
          </Animated.View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // Let React Navigation handle the height automatically
    paddingTop:
      Platform.OS === "ios" ? 50 : (StatusBar.currentHeight || 0) + 10,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: deepGreenColor,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    minHeight: 90, // Minimum height for consistency
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  appLogo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  appTitle: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
  appTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },
  appSubtitleText: {
    fontSize: 14,
    color: "#fff",
    alignSelf: "center",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userText: {
    flexDirection: "column",
    justifyContent: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greeting: {
    fontSize: 14,
    fontWeight: "400",
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
    marginVertical: 16,
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

export const LAYOUT_CONSTANTS = {
  HEADER_HEIGHT: 90,
  STATUS_BAR_HEIGHT: StatusBar.currentHeight || 44,
  TOTAL_HEADER_HEIGHT: 90 + (StatusBar.currentHeight || 44),
};
