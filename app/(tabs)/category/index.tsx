import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  Animated,
  Pressable,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { CustomLoader } from "@/components/common/loader";
import { API_URL } from "@/constants/variables";
import { TouchableOpacity } from "react-native";
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
  productCount: number;
  children: Category[];
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
  total: number;
  message: string;
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
}

// CategoryCard component to handle individual card animations
interface CategoryCardProps {
  item: Category;
  opacity: Animated.Value;
  getCategoryIcon: (category: Category) => string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  item,
  opacity,
  getCategoryIcon,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Link href={`/(tabs)/category/${item.slug}`} asChild>
        <Pressable
          style={styles.cardContent}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          android_ripple={{
            color: "rgba(74, 226, 112, 0.2)",
            borderless: false,
            radius: 60,
          }}
        >
          <View style={styles.iconContainer}>
            <Image
              source={{ uri: getCategoryIcon(item) }}
              style={styles.icon}
              onError={(e) =>
                console.log(
                  `Category icon load error (${item.title}):`,
                  e.nativeEvent.error
                )
              }
            />
          </View>
          <Text style={styles.cardText} numberOfLines={2} ellipsizeMode="tail">
            {item.title}
          </Text>
        </Pressable>
      </Link>
    </Animated.View>
  );
};

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
  // https://cdn-icons-png.flaticon.com/512/2713/2713474.png
  snacks: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
  // Add more fallback icons as needed
  default: "https://cdn-icons-png.flaticon.com/512/3514/3514242.png",
};

export default function CategoryScreen() {
  const colorScheme = useColorScheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Function to flatten nested categories
  const flattenCategories = (categories: Category[]): Category[] => {
    const result: Category[] = [];

    const flatten = (cats: Category[]) => {
      cats.forEach((cat) => {
        result.push(cat);
        if (cat.children && cat.children.length > 0) {
          flatten(cat.children);
        }
      });
    };

    flatten(categories);
    return result;
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/v1/categories`);
      const data: CategoriesResponse = await response.json();

      if (data.success) {
        // Flatten the hierarchical data
        const flatCategories = flattenCategories(data.data);
        setCategories(flatCategories);
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

  // Trigger fade-in animation when loading ends
  useEffect(() => {
    if (!loading && !error) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, error, opacity]);

  useFocusEffect(
    React.useCallback(() => {
      // Reset opacity when screen is focused to ensure animation restarts
      opacity.setValue(0);
      if (!loading && !error) {
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }
    }, [loading, error, opacity])
  );

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
    return (
      <CustomLoader isLoading={loading} loadingText="Loading categories..." />
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchCategories}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            colorScheme === "dark"
              ? Colors.light.background
              : Colors.light.background,
        },
      ]}
    >
      <View>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={4}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <CategoryCard
              item={item}
              opacity={opacity}
              getCategoryIcon={getCategoryIcon}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#f8fafe",
  },
  grid: {
    padding: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    width: "23%",
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    minHeight: 120,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  cardContent: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  icon: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  cardText: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 14,
    fontWeight: "600",
    color: "#2c3e50",
    letterSpacing: 0.2,
    marginTop: 2,
    paddingHorizontal: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
