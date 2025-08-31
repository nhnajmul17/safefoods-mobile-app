import CustomTabBar from "@/components/common/customTabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="category" />
      <Tabs.Screen name="shop-now" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="menu" />
      <Tabs.Screen name="whatsapp" options={{ href: null }} />
    </Tabs>
  );
}
