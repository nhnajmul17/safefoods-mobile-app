import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { Category } from "./types";
import { deepGreenColor } from "@/constants/Colors";
import { ensureHttps } from "@/utils/imageUtils";

interface CategoryListProps {
  categories: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const renderCategoryItem = ({ item }: { item: Category }) => {
    const isSelected = selectedCategory?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.categoryItem, isSelected && styles.selectedCategoryItem]}
        onPress={() => onSelectCategory(item)}
      >
        <View style={[styles.imageCircle, isSelected && styles.selectedCircle]}>
          <Image
            source={{
              uri: item.mediaUrl
                ? ensureHttps(item.mediaUrl)
                : "https://cdn-icons-png.flaticon.com/512/2153/2153788.png",
            }}
            style={styles.categoryImage}
            resizeMode="contain"
          />
        </View>
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.selectedCategoryText,
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* All Products */}
      <TouchableOpacity
        style={[
          styles.categoryItem,
          !selectedCategory && styles.selectedCategoryItem,
        ]}
        onPress={() => onSelectCategory(null)}
      >
        <View
          style={[
            styles.imageCircle,
            !selectedCategory && styles.selectedCircle,
          ]}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/2153/2153788.png",
            }}
            style={styles.categoryImage}
            resizeMode="contain"
          />
        </View>
        <Text
          style={[
            styles.categoryText,
            !selectedCategory && styles.selectedCategoryText,
          ]}
        >
          All Products
        </Text>
      </TouchableOpacity>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    backgroundColor: "#E9FBE9",
    marginRight: 8,
    borderRadius: 12,
    paddingVertical: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginBottom: 18,
  },
  selectedCategoryItem: {
    // keeps background but selection is highlighted by circle color
  },
  imageCircle: {
    width: 50,
    height: 50,
    borderRadius: 35,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#eee",
  },
  selectedCircle: {
    backgroundColor: "#d6f5db", // selected circle light green
    borderColor: deepGreenColor,
  },
  categoryImage: {
    width: 40,
    height: 40,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#444",
    textAlign: "center",
  },
  selectedCategoryText: {
    color: deepGreenColor,
    fontWeight: "600",
  },
});

export default CategoryList;
