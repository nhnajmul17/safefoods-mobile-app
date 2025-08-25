import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Category } from "./types";
import { deepGreenColor, yellowColor } from "@/constants/Colors";

interface SubcategoryListProps {
  subcategories: Category[];
  selectedSubcategory: Category | null;
  onSelectSubcategory: (subcategory: Category | null) => void;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({
  subcategories,
  selectedSubcategory,
  onSelectSubcategory,
}) => {
  const renderSubcategoryItem = ({ item }: { item: Category }) => {
    const isSelected = selectedSubcategory?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.subcategoryItem,
          isSelected && styles.selectedSubcategoryItem,
        ]}
        onPress={() => onSelectSubcategory(item)}
      >
        <Text
          style={[
            styles.subcategoryText,
            isSelected && styles.selectedSubcategoryText,
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* All Option */}
      <TouchableOpacity
        style={[
          styles.subcategoryItem,
          !selectedSubcategory && styles.selectedSubcategoryItem,
        ]}
        onPress={() => onSelectSubcategory(null)}
      >
        <Text
          style={[
            styles.subcategoryText,
            !selectedSubcategory && styles.selectedSubcategoryText,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      <FlatList
        data={subcategories}
        renderItem={renderSubcategoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  listContent: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  subcategoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedSubcategoryItem: {
    backgroundColor: deepGreenColor,
  },
  subcategoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  selectedSubcategoryText: {
    color: yellowColor,
    fontWeight: "600",
  },
});

export default SubcategoryList;
