import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
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

export default function HomeCategorySection({
  isCategoryLoaded,
  setIsCategoryLoaded,
}: {
  isCategoryLoaded: boolean;
  setIsCategoryLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigation = useRouter();

  const handleCategoryPress = (href: string) => {
    // Navigate to main category page first, then to specific category
    if (!isCategoryLoaded) {
      navigation.push("/(tabs)/category");
      setIsCategoryLoaded(true);
    }
    // Small delay to ensure category page is mounted
    setTimeout(() => {
      navigation.push(href as any);
    });
  };

  const handleSeeAllPress = () => {
    // Navigate to main category page
    navigation.push("/(tabs)/category");
  };

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

        <TouchableOpacity onPress={handleSeeAllPress}>
          <Text style={styles.seeAllText}>See all</Text>
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
            <TouchableOpacity
              onPress={() => handleCategoryPress(category.href)}
              style={[
                styles.categoryIconContainer,
                { backgroundColor: Colors.light.background },
              ]}
            >
              <Image
                source={
                  typeof category.icon === "string"
                    ? { uri: category.icon }
                    : category.icon // local image (require/import)
                }
                style={styles.categoryIcon}
                onError={(e) =>
                  console.log(
                    `Category icon load error (${category.name}):`,
                    e.nativeEvent.error
                  )
                }
              />
            </TouchableOpacity>
            <Text style={[styles.categoryText, { color: Colors.light.text }]}>
              {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
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
