import type React from "react";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Tabs } from "expo-router";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { useCartStore } from "@/store/cartStore";
import { lightGreenColor } from "@/constants/Colors";

// Define navigation prop type
type TabNavigation = {
  navigate: (name: string, params?: object) => void;
  emit: <EventName extends string>(options: {
    type: EventName;
    target?: string;
    canPreventDefault?: true;
    data?: object;
  }) => {
    defaultPrevented: boolean;
  };
};

interface CustomTabBarProps {
  state: any; // Adjust this type based on your navigation state
  descriptors: Record<string, { options: BottomTabNavigationOptions }>;
  navigation: TabNavigation;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  return (
    <View style={styles.tabBarContainer}>
      {/* Left-side tabs (Home, Category) and Right-side tab (Settings) */}
      {state.routes
        .filter((route: any) => route.name !== "cart")
        .map((route: any) => {
          const actualIndex = state.routes.findIndex(
            (r: any) => r.key === route.key
          );
          const { options } = descriptors[route.key];
          const isFocused = state.index === actualIndex;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={
                typeof options.tabBarLabel === "string"
                  ? options.tabBarLabel
                  : options.title?.toString()
              }
            >
              {options.tabBarIcon?.({
                color: isFocused ? "#00C853" : "#666",
                focused: isFocused,
                size: 24,
              }) ?? null}
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? "#00C853" : "#666" },
                ]}
              >
                {typeof options.tabBarLabel === "string"
                  ? options.tabBarLabel
                  : options.title}
              </Text>
            </TouchableOpacity>
          );
        })}

      {/* Centered Cart Button */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate("cart")}
        accessibilityRole="button"
        accessibilityLabel="Cart"
      >
        <View style={styles.cartIconContainer}>
          <IconSymbol size={28} name="cart.fill" color="#fff" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItems}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, focused, size }) => (
            <IconSymbol size={size} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: "Category",
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <IconSymbol size={size} name="basket.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop-now"
        options={{
          title: "Shop Now",
          headerShown: true,
          headerTitleAlign: "center",

          headerStyle: { backgroundColor: lightGreenColor },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
            color: "#fff",
          },
          tabBarIcon: ({ color, focused, size }) => (
            <IconSymbol size={size} name="cart.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: true,
          headerTitleAlign: "center",

          headerStyle: { backgroundColor: lightGreenColor },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
            color: "#fff",
          },
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused, size }) => (
            <IconSymbol size={size} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: lightGreenColor },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
            color: "#fff",
          },
          tabBarButton: () => null, // Hide the default tab bar button for cart
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    position: "relative",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
  },
  cartButton: {
    position: "absolute",
    left: "53%",
    bottom: 30,
    transform: [{ translateX: -25 }], // Half of 50 (button width)
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#00C853",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8, // Increased elevation for a stronger shadow effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  cartIconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF0000", // Red badge to match common design
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
