import { Colors, lightGreenColor } from "@/constants/Colors";
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
import { categories } from "@/components/categoryScreen/lib/categoryDataAndTypes";
import { CustomLoader } from "@/components/common/loader";

export default function CategoryScreen() {
  const colorScheme = useColorScheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const scaleValue = useRef(new Animated.Value(1)).current;

  // Simulate initial load or data fetch
  useEffect(() => {
    // Start scale animation (handled by CustomLoader now)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust delay as needed

    return () => {
      clearTimeout(timer); // Cleanup timer on unmount
    };
  }, []);

  // Trigger fade-in animation when loading ends
  useEffect(() => {
    if (!loading) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000, // Adjust duration for smooth fade-in
        useNativeDriver: true,
      }).start();
    }
  }, [loading, opacity]);

  useFocusEffect(
    React.useCallback(() => {
      // Reset opacity when screen is focused to ensure animation restarts
      opacity.setValue(0);
      if (!loading) {
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }
    }, [loading, opacity])
  );

  if (loading) {
    return (
      <CustomLoader isLoading={loading} loadingText="Loading categories..." />
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
            <Link href={item.href} style={styles.card}>
              <Animated.View style={[styles.cardContent, { opacity }]}>
                <Image
                  source={
                    typeof item.icon === "string"
                      ? { uri: item.icon }
                      : item.icon // local image (require/import)
                  }
                  style={styles.icon}
                  onError={(e) =>
                    console.log(
                      `Category icon load error (${item.name}):`,
                      e.nativeEvent.error
                    )
                  }
                />
                <Text style={[styles.cardText, { color: Colors.light.text }]}>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
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
    width: "23%", // Approximately 1/4 of the row width with margins
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
});
