import { CategoryType } from "@/components/homeScreen/categorySection";
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
import React, { useEffect, useRef } from "react"; // Added useRef
import { useFocusEffect } from "@react-navigation/native"; // For focus detection

const categories: CategoryType[] = [
  {
    id: "1",
    name: "Fruits",
    href: "/(tabs)/category/fruits",
    icon: "https://cdn-icons-png.flaticon.com/512/415/415682.png",
  },
  {
    id: "2",
    name: "Meat",
    href: "/(tabs)/category/meat",
    icon: "https://cdn-icons-png.flaticon.com/512/3143/3143643.png",
  },
  {
    id: "3",
    name: "Cheeses",
    href: "/(tabs)/category/cheese",
    icon: "https://cdn-icons-png.flaticon.com/512/3050/3050158.png",
  },
  {
    id: "4",
    name: "Vegetables",
    href: "/(tabs)/category/vegetables",
    icon: "https://cdn-icons-png.flaticon.com/512/2153/2153788.png",
  },
];

export default function CategoryScreen() {
  const colorScheme = useColorScheme();
  const opacity = useRef(new Animated.Value(0)).current; // Use ref to persist Animated.Value

  // Trigger animation when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      opacity.setValue(0); // Reset opacity to 0
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, [])
  );

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
          renderItem={({ item }) => (
            <Link
              href={item.href}
              style={[
                styles.card,
                { backgroundColor: Colors.light.background },
              ]}
            >
              <Animated.View
                style={[styles.cardContent, { opacity }]} // Apply fade-in animation
              >
                <Image
                  source={{ uri: item.icon }}
                  style={styles.icon}
                  onError={(e) =>
                    console.log(
                      `Category icon load error (${item.name}):`,
                      e.nativeEvent.error
                    )
                  }
                />
                <Text style={[styles.cardText, { color: Colors.light.text }]}>
                  {item.name}
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
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
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
