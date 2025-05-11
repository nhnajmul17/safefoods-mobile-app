import { CategoryType } from "@/components/homeScreen/categorySection";
import { lightGreenColor } from "@/constants/Colors";
import { Link } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  StatusBar,
} from "react-native";

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

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            colorScheme === "dark" ? lightGreenColor : lightGreenColor,
        }, //"#1a1a1a" "#87ceeb"
      ]}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colorScheme === "dark" ? "#1a1a1a" : "#f5f5f5"}
      />
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
                { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
              ]}
            >
              <View style={styles.cardContent}>
                <Image
                  source={{ uri: item.icon }}
                  style={styles.icon}
                  // defaultSource={require("../../../assets/images/placeholder.png")}
                  onError={(e) =>
                    console.log(
                      `Category icon load error (${item.name}):`,
                      e.nativeEvent.error
                    )
                  }
                />
                <Text
                  style={[
                    styles.cardText,
                    { color: colorScheme === "dark" ? "#fff" : "#333" },
                  ]}
                >
                  {item.name}
                </Text>
              </View>
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
    // backgroundColor: "#87ceeb", //sky blue
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
    aspectRatio: 1, // Ensure square cards
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
