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
    width: 90, // Reduced from 100
    backgroundColor: "#f5f5f5",
    marginRight: 10,
    borderRadius: 12,
    padding: 6, // Reduced from 8
  },
  listContent: {
    paddingVertical: 6, // Reduced from 8
  },
  categoryItem: {
    padding: 6, // Reduced from 8
    marginBottom: 6, // Reduced from 8
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCategoryItem: {
    backgroundColor: deepGreenColor,
  },
  categoryImage: {
    width: 50, // Reduced from 60
    height: 50, // Reduced from 60
    borderRadius: 25, // Reduced from 30
    marginBottom: 4, // Reduced from 6
  },
  categoryText: {
    fontSize: 11, // Reduced from 12
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
