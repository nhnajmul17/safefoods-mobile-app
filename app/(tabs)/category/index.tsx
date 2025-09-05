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
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { CustomLoader } from "@/components/common/loader";
import { API_URL } from "@/constants/variables";
import { TouchableOpacity } from "react-native";

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
  // https://cdn-icons-png.flaticon.com/512/2713/2713474.png
  snacks: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
  // Add more fallback icons as needed
  default: "https://cdn-icons-png.flaticon.com/512/2553/2553691.png",
};

export default function CategoryScreen() {
  const colorScheme = useColorScheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
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

  // Function to ensure HTTPS
  const ensureHttps = (url: string): string => {
    if (url.startsWith("http://")) {
      return url.replace("http://", "https://");
    }
    return url;
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
            <Link href={`/(tabs)/category/${item.slug}`} style={styles.card}>
              <Animated.View style={[styles.cardContent, { opacity }]}>
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
                <Text style={[styles.cardText, { color: Colors.light.text }]}>
                  {item.title}
                </Text>
              </Animated.View>
            </Link>
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
  },
  grid: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  card: {
    width: "23%",
    margin: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    aspectRatio: 1,
  },
  cardContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    textAlign: "center",
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
