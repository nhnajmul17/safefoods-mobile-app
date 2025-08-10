import { SafeAreaView, StyleSheet } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/constants/variables";

import {
  Order,
  ApiResponse,
  Pagination,
  OrderDetail,
} from "@/components/myOrdersScreen/orderTypes";
import OrderHeader from "@/components/myOrdersScreen/orderHeader";
import OrderList from "@/components/myOrdersScreen/orderList";
import OrderModal from "@/components/myOrdersScreen/orderModal";

export default function MyOrdersScreen() {
  const { userId, accessToken } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  const fetchOrders = useCallback(
    async (offset: number = 0) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/v1/orders/user/${userId}?offset=${offset}&limit=10`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data: ApiResponse = await response.json();
        if (data.success) {
          setOrders((prev) =>
            offset === 0 ? data.data : [...prev, ...data.data]
          );
          setPagination(data.pagination);
        } else {
          console.error("Failed to fetch orders:", data.message);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    },
    [accessToken, userId]
  );

  useEffect(() => {
    fetchOrders(0);
  }, [fetchOrders]);

  const handleLoadMore = () => {
    if (pagination && orders.length < pagination.total) {
      fetchOrders(orders.length);
    }
  };

  const toggleModal = (orderId: string | null) => {
    if (orderId) {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        setSelectedOrder({
          date: new Date(order.createdAt).toLocaleString(),
          timeline: order.orderHistory.map((history) => ({
            status: history.status,
            time: new Date(history.createdAt).toLocaleString(),
            description: `Order status updated to ${history.status} by user.`,
          })),
          items: order.productList.map((product) => ({
            name: product.productTitle,
            quantity: parseFloat(product.quantity),
            price: parseFloat(product.price),
          })),
          shipping: {
            name: "User",
            address: "Address not available",
            method: "Standard Shipping",
          },
          payment: {
            method: order.paymentMethodId || "Unknown",
            subtotal: order.subTotal,
            shipping: order.deliveryCharge,
            tax: order.discount,
            total: order.total,
          },
        });
        setModalVisible(true); // Open the modal when an order is selected
      }
    } else {
      setSelectedOrder(null);
      setModalVisible(false); // Close the modal when orderId is null
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <OrderHeader />
      <OrderList
        orders={orders}
        loading={loading}
        pagination={pagination}
        onLoadMore={handleLoadMore}
        toggleModal={toggleModal}
      />
      <OrderModal
        isVisible={isModalVisible}
        onClose={() => toggleModal(null)} // Use toggleModal to close and reset
        selectedOrder={selectedOrder}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
});
