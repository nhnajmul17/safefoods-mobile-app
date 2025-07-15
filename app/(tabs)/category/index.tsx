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
import React, { useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { categories } from "@/components/categoryScreen/lib/categoryDataAndTypes";

export default function CategoryScreen() {
  const colorScheme = useColorScheme();
  const opacity = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      opacity.setValue(0);
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
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <Link href={item.href} style={styles.card}>
              <Animated.View style={[styles.cardContent, { opacity }]}>
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
