import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, userId, userName } = useAuthStore();
  const { clearCart } = useCartStore();

  const menuItems = [
    ...(userId
      ? [
          {
            id: "1",
            title: "My Profile",
            icon: "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
            action: () => router.push("/my-profile"),
          },
        ]
      : []),
    // {
    //   id: "2",
    //   title: "Security",
    //   icon: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
    //   // action: () => router.push("/security"),
    // },
    // {
    //   id: "3",
    //   title: "Settings",
    //   icon: "https://cdn-icons-png.flaticon.com/512/2099/2099058.png",
    //   action: () => router.push("/settings"),
    // },
    // ...(userId
    //   ? [
    {
      id: "4",
      title: "My Orders",
      icon: "https://cdn-icons-png.flaticon.com/512/891/891462.png",
      action: () => router.push("/my-orders"),
    },
    //   ]
    // : []),
    {
      id: "5",
      title: "Privacy Policy",
      icon: "https://cdn-icons-png.flaticon.com/512/942/942751.png",
      action: () =>
        router.push({
          pathname: "/webview",
          params: { url: "https://safefoods.com.bd/private-policy" },
        }),
    },
    {
      id: "6",
      title: "Terms & Conditions",
      icon: "https://cdn-icons-png.flaticon.com/512/535/535239.png",
      action: () =>
        router.push({
          pathname: "/webview",
          params: { url: "https://safefoods.com.bd/terms-and-conditions" },
        }),
    },
    {
      id: "7",
      title: "Refund & Return Policy",
      icon: "https://cdn-icons-png.flaticon.com/512/942/942751.png",
      action: () =>
        router.push({
          pathname: "/webview",
          params: { url: "https://safefoods.com.bd/returns-refund" },
        }),
    },
    {
      id: "8",
      title: userId ? "Log Out" : "Login",
      icon: userId
        ? "https://cdn-icons-png.flaticon.com/512/1828/1828479.png"
        : "https://cdn-icons-png.flaticon.com/512/1828/1828478.png", // Login icon
      action: () => {
        if (userId) {
          useCartStore.setState({ isCartFetchedFromApi: false });
          clearCart(); // Clear cart on logout
          logout();
          router.push("/login-with-phone");
        } else {
          router.push("/login-with-phone");
        }
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {userId && (
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.name}>{userName || "John Abram"}</Text>
            {/* <Text style={styles.email}>
              {userName ? `${userId}` : "johnabram@gmail.com"}
            </Text> */}
          </View>
        </View>
      )}
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.menuItem}
          onPress={item.action}
        >
          <Image source={{ uri: item.icon }} style={styles.menuIcon} />
          <Text style={styles.menuText}>{item.title}</Text>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/271/271228.png",
            }}
            style={styles.chevronIcon}
          />
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  chevronIcon: {
    width: 15,
    height: 15,
  },
});
