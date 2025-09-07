import { Colors, deepGreenColor } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { API_URL } from "@/constants/variables";
import CategorySkeleton from "./categorySkeleton";
import { ensureHttps } from "@/utils/imageUtils";

// Define the API response type
interface Category {
  id: string;
  title: string;
  slug: string;
  description: string;
  mediaId: string | null;
  mediaUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  levelId: string;
  levelTitle: string;
  levelSlug: string;
  parentId: string | null;
  parentTitle: string | null;
  parentSlug: string | null;
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
  pagination: {
    offset: number;
    limit: number;
    total: number;
    currentCount: number;
  };
  _links: {
    self: {
      href: string;
    };
    next: null | {
      href: string;
    };
    previous: null | {
      href: string;
    };
    collection: {
      href: string;
    };
  };
  message: string;
}

// Fallback icons for categories
const fallbackIcons: Record<string, string> = {
  proteins: "https://cdn-icons-png.flaticon.com/512/3050/3050158.png",
  chicken: "https://cdn-icons-png.flaticon.com/512/1046/1046751.png",
  meat: "https://cdn-icons-png.flaticon.com/512/3143/3143643.png",
  dairy: "https://cdn-icons-png.flaticon.com/512/3050/3050158.png",
  fruits: "https://cdn-icons-png.flaticon.com/512/415/415682.png",
  vegetables: "https://cdn-icons-png.flaticon.com/512/2153/2153788.png",
  fish: "https://cdn-icons-png.flaticon.com/512/10507/10507711.png",
  egg: "https://cdn-icons-png.flaticon.com/512/837/837560.png",
  snacks: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
  oil: "https://cdn-icons-png.flaticon.com/512/5441/5441204.png",
  honey: "https://cdn-icons-png.flaticon.com/512/4614/4614698.png",
  default: "https://cdn-icons-png.flaticon.com/512/3514/3514242.png",
};

export default function HomeCategorySection({
  isCategoryLoaded,
  setIsCategoryLoaded,
}: {
  isCategoryLoaded: boolean;
  setIsCategoryLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigation = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/v1/categories/flat`);
      const data: CategoriesResponse = await response.json();

      if (data.success) {
        setCategories(data.data);
      } else {
        setError("Failed to load categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryPress = (slug: string) => {
    // Navigate to main category page first, then to specific category
    navigation.push("/(tabs)/category");
    // if (!isCategoryLoaded) {
    //   setIsCategoryLoaded(true);
    // }
    // Small delay to ensure category page is mounted
    setTimeout(() => {
      navigation.push(`/(tabs)/category/${slug}` as any);
    });
  };

  const handleSeeAllPress = () => {
    // Navigate to main category page
    navigation.push("/(tabs)/category");
  };

  // Get icon URL for category
  const getCategoryIcon = (category: Category) => {
    // Use mediaUrl from API if available
    if (category.mediaUrl) {
      return ensureHttps(category.mediaUrl);
    }

    // Use fallback icon based on slug
    const fallbackUrl = fallbackIcons[category.slug] || fallbackIcons.default;
    return ensureHttps(fallbackUrl);
  };

  if (loading) {
    return <CategorySkeleton />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCategories}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
              onPress={() => handleCategoryPress(category.slug)}
              style={[
                styles.categoryIconContainer,
                { backgroundColor: Colors.light.background },
              ]}
            >
              <Image
                source={{ uri: getCategoryIcon(category) }}
                style={styles.categoryIcon}
                onError={(e) =>
                  console.log(
                    `Category icon load error (${category.title}):`,
                    e.nativeEvent.error
                  )
                }
              />
            </TouchableOpacity>
            <Text style={[styles.categoryText, { color: Colors.light.text }]}>
              {category.title}
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
    color: deepGreenColor,
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
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.light.text,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: "#ff4444",
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: deepGreenColor,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
