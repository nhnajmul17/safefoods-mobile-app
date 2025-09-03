import { View, StyleSheet, ScrollView } from "react-native";

const CategorySkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Section Header Skeleton */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonEmoji} />
        </View>
        <View style={styles.skeletonSeeAll} />
      </View>

      {/* Category Icons Skeleton */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <View key={item} style={styles.categoryItem}>
            <View style={styles.skeletonIconContainer} />
            <View style={styles.skeletonCategoryText} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
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
  skeletonTitle: {
    width: 100,
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
  skeletonEmoji: {
    width: 20,
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginLeft: 4,
  },
  skeletonSeeAll: {
    width: 50,
    height: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
  categoriesContainer: {
    paddingLeft: 16,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 35,
  },
  skeletonIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  skeletonCategoryText: {
    width: 60,
    height: 14,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
});

export default CategorySkeleton;
