// components/CustomTabBar.tsx
import { View, TouchableOpacity, Text, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { deepGreenColor, yellowColor } from "@/constants/Colors";
import { useCartStore } from "@/store/cartStore";
import { WHATSAPP_PHONE_NUMBER } from "@/constants/variables";

interface CustomTabBarProps {
  state: any;
  navigation: any;
}

export default function CustomTabBar({ state, navigation }: CustomTabBarProps) {
  const totalItems = useCartStore((state) => state.getTotalItems());

  const openWhatsApp = () => {
    const phoneNumber = WHATSAPP_PHONE_NUMBER;
    const url = `whatsapp://send?phone=${phoneNumber}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Linking.openURL(`https://wa.me/${phoneNumber}`);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const tabs = [
    {
      name: "home",
      title: "Home",
      icon: (focused: boolean) => (
        <Ionicons
          name={focused ? "home" : "home-outline"}
          size={24}
          color={focused ? yellowColor : "#666"}
        />
      ),
    },
    {
      name: "category",
      title: "Categories",
      icon: (focused: boolean) => (
        <Ionicons
          name={focused ? "grid" : "grid-outline"}
          size={24}
          color={focused ? yellowColor : "#666"}
        />
      ),
    },
    {
      name: "shop-now",
      title: "Shop Now",
      icon: (focused: boolean) => (
        <Ionicons
          name={focused ? "cart" : "cart-outline"}
          size={24}
          color={focused ? yellowColor : "#666"}
        />
      ),
    },
    {
      name: "cart",
      title: "Cart",
      icon: (focused: boolean) => (
        <View style={{ position: "relative" }}>
          <Ionicons
            name={focused ? "basket" : "basket-outline"}
            size={24}
            color={focused ? yellowColor : "#666"}
          />
          {totalItems > 0 && (
            <View
              style={{
                position: "absolute",
                top: -5,
                right: -5,
                backgroundColor: "white",
                borderRadius: 10,
                width: 18,
                height: 18,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: deepGreenColor,
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              >
                {totalItems > 9 ? "9+" : totalItems}
              </Text>
            </View>
          )}
        </View>
      ),
    },
    {
      name: "menu",
      title: "Menu",
      icon: (focused: boolean) => (
        <Ionicons
          name={focused ? "menu" : "menu-outline"}
          size={24}
          color={focused ? yellowColor : "#666"}
        />
      ),
    },
    {
      name: "whatsapp",
      title: "WhatsApp",
      icon: () => <Ionicons name="logo-whatsapp" size={24} color="#25D366" />,
      isAction: true,
    },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: deepGreenColor,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingVertical: 8,
      }}
    >
      {tabs.map((tab, index) => {
        const isFocused = state.index === index && !tab.isAction;

        if (tab.isAction) {
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={openWhatsApp}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 8,
              }}
            >
              {tab.icon()}
              <Text
                style={{
                  fontSize: 12,
                  color: "#25D366",
                  marginTop: 4,
                }}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => {
              const event = navigation.emit({
                type: "tabPress",
                target: tab.name,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(tab.name);
              }
            }}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 8,
            }}
          >
            {tab.icon(isFocused)}
            <Text
              style={{
                fontSize: 12,
                color: isFocused ? yellowColor : "#666",
                marginTop: 4,
              }}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
