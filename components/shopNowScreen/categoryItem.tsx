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
import { deepGreenColor, yellowColor } from "@/constants/Colors";

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
        <Image
          source={{
            uri:
              item.mediaUrl ||
              "https://cdn-icons-png.flaticon.com/512/2153/2153788.png",
          }}
          style={styles.categoryImage}
          resizeMode="cover"
        />
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
      {/* All Products Option */}
      <TouchableOpacity
        style={[
          styles.categoryItem,
          !selectedCategory && styles.selectedCategoryItem,
        ]}
        onPress={() => onSelectCategory(null)}
      >
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/2153/2153788.png",
          }}
          style={styles.categoryImage}
          resizeMode="cover"
        />
        <Text
          style={[
            styles.categoryText,
            !selectedCategory && styles.selectedCategoryText,
          ]}
          numberOfLines={2}
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
    width: 80, // Reduced from 90
    backgroundColor: "#f5f5f5",
    marginRight: 8, // Reduced from 10
    borderRadius: 10, // Reduced from 12
    padding: 5, // Reduced from 6
  },
  listContent: {
    paddingVertical: 5, // Reduced from 6
  },
  categoryItem: {
    padding: 5, // Reduced from 6
    marginBottom: 5, // Reduced from 6
    borderRadius: 6, // Reduced from 8
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    elevation: 1, // Reduced from 2
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, // Reduced from 0.1
    shadowRadius: 2,
  },
  selectedCategoryItem: {
    backgroundColor: deepGreenColor,
  },
  categoryImage: {
    width: 45, // Reduced from 50
    height: 45, // Reduced from 50
    borderRadius: 22, // Reduced from 25
    marginBottom: 3, // Reduced from 4
  },
  categoryText: {
    fontSize: 10, // Reduced from 11
    fontWeight: "500",
    color: "#555",
    textAlign: "center",
  },
  selectedCategoryText: {
    color: yellowColor,
    fontWeight: "600",
  },
});

export default CategoryList;
