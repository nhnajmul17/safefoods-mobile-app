import { FlatList, View, Text, StyleSheet } from "react-native";
import OrderCard from "./orderCard";
import LoadMoreButton from "./loadMore";
import { Order, Pagination } from "./orderTypes";

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  pagination: Pagination | null;
  onLoadMore: () => void;
  toggleModal: (orderId: string | null) => void;
  isGuest?: boolean;
}

export default function OrderList({
  orders,
  loading,
  pagination,
  onLoadMore,
  toggleModal,
  isGuest = false,
}: OrderListProps) {
  if (loading && orders.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.noOrdersContainer}>
        <Text style={styles.noOrdersText}>No orders found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => (
        <OrderCard item={item} toggleModal={toggleModal} isGuest={isGuest} />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ListFooterComponent={
        pagination && orders.length < pagination.total ? (
          <LoadMoreButton onPress={onLoadMore} loading={loading} />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  noOrdersText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
