import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { categories } from "../categoryScreen/lib/categoryDataAndTypes";

export default function HomeCategorySection() {
  return (
    <>
      {/* Categories Section */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text style={[styles.sectionTitle, { color: Colors.light.text }]}>
            Categories
          </Text>
          <Text style={styles.emoji}>🧺</Text>
        </View>

        <TouchableOpacity>
          <Link href={"/(tabs)/category"}>
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
                { backgroundColor: Colors.light.background },
              ]}
            >
              <Link key={category.id} href={category.href}>
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
              </Link>
            </View>
            <Text style={[styles.categoryText, { color: Colors.light.text }]}>
              {category.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
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
    marginRight: 35,
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
});
