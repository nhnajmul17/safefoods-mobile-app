import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";

const PromotionBanner: React.FC = () => (
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
        onError={(e) => console.log("Banner load error:", e.nativeEvent.error)}
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
);

const styles = StyleSheet.create({
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
});

export default PromotionBanner;
