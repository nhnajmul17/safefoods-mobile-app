import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useCartStore } from "@/store/cartStore";
import Icon from "react-native-vector-icons/MaterialIcons";

import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/constants/variables";
import { deepGreenColor, yellowColor } from "@/constants/Colors";

export default function CartScreen() {
  const { cartItems, removeItem, updateQuantity, clearCart, getTotalPrice } =
    useCartStore();
  const { userId, accessToken } = useAuthStore();
  const router = useRouter();

  const handleOrderNow = () => {
    router.push("/checkout");
  };

  const handleAddToCart = (
    cartItemId: string,
    variantId: string,
    quantity: number,
    action: "add" | "remove"
  ) => {
    if (userId && accessToken && quantity > 0) {
      fetch(`${API_URL}/v1/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: userId,
          variantProductId: variantId,
          quantity: action === "add" ? 1 : -1,
        }),
      })
        .then((response) => response.json())
        .catch((error) => console.error("Cart API Error:", error));
    } else if (userId && accessToken && quantity <= 0) {
      fetch(`${API_URL}/v1/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: userId,
          variantProductId: variantId,
          quantity: -1,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          return fetch(`${API_URL}/v1/cart`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              id: cartItemId,
              isDiscarded: true,
            }),
          });
        })
        .then((response) => response.json())
        .catch((error) => console.error("Cart API Error:", error));
    }
  };

  const renderItem = ({
    item,
  }: {
    item: {
      id: string;
      variantId: string;
      name: string;
      image: string;
      price: number;
      unit: string;
      quantity: number;
    };
  }) => (
    <View style={styles.cartItem}>
      {/* Product Image */}
      <Image
        source={{ uri: item.image }}
        style={styles.itemImage}
        resizeMode="cover"
        onError={(e) =>
          console.log(
            `Cart item image load error (${item.name} (${item.unit})):`,
            e.nativeEvent.error
          )
        }
      />
      {/* Product Details */}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>
          {item.name} ({item.unit})
        </Text>
        <Text style={styles.itemPrice}>
          ৳{(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
      {/* Quantity Controls */}
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          onPress={() => {
            updateQuantity(item.id, item.variantId, item.quantity - 1);
            handleAddToCart(
              item.id,
              item.variantId,
              item.quantity - 1,
              "remove"
            );
          }}
          style={styles.quantityButton}
        >
          <Icon style={styles.quantityText} name="remove" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => {
            updateQuantity(item.id, item.variantId, item.quantity + 1);
            handleAddToCart(item.id, item.variantId, item.quantity + 1, "add");
          }}
          style={styles.quantityButton}
        >
          <Icon style={styles.quantityText} name="add" />
        </TouchableOpacity>
      </View>
      {/* Remove Button */}
      <TouchableOpacity
        onPress={() => {
          removeItem(item.id, item.variantId);
          Toast.show({
            type: "error",
            text1: "Removed from Cart",
            text2: `${item.name} (${item.unit}) removed from your cart.`,
            text1Style: { fontSize: 16, fontWeight: "bold" },
            text2Style: { fontSize: 14, fontWeight: "bold" },
          });
        }}
        style={styles.removeButton}
      >
        <Icon name="delete" style={styles.removeButtonText} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Clear Cart */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart Items ({cartItems.length})</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear Cart</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cart Items List */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => router.push("/shop-now")}
          >
            <Text style={styles.shopNowButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.id}-${item.variantId}`}
            contentContainerStyle={styles.list}
          />
          {/* Footer with Total and Order Now */}
          <View style={styles.footer}>
            <Text style={styles.totalText}>
              Total: ৳{getTotalPrice().toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.orderButton}
              onPress={handleOrderNow}
            >
              <Text style={styles.orderButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  clearButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  shopNowButton: {
    backgroundColor: deepGreenColor,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopNowButtonText: {
    color: yellowColor,
    fontSize: 16,
    fontWeight: "bold",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    overflow: "hidden",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: deepGreenColor,
    fontWeight: "500",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 8,
    marginRight: 12,
  },
  quantityButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  quantityText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "900",
    marginHorizontal: 6,
  },
  removeButton: {
    padding: 6,
    backgroundColor: "#FF0000",
    borderRadius: 10,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  list: {
    paddingTop: 8,
    paddingBottom: 80,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  orderButton: {
    backgroundColor: deepGreenColor,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  orderButtonText: {
    color: yellowColor,
    fontSize: 16,
    fontWeight: "bold",
  },
});
