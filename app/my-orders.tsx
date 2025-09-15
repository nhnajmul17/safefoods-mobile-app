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
import ProtectedRoute from "@/components/auth/protectedRoute";

export default function MyOrdersScreen() {
  const { userId, accessToken } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [cancelling, setCancelling] = useState(false);

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
          id: order.id,
          date: new Date(order.createdAt).toLocaleString(),
          status: order.orderStatus,
          timeline: order.orderHistory.map((history) => ({
            status: history.status,
            time: new Date(history.createdAt).toLocaleString(),
            description: `Order status updated to ${history.status}.`,
          })),
          items: order.productList.map((product) => ({
            name: product.productTitle,
            quantity: parseFloat(product.quantity),
            price: parseFloat(product.price),
            media:
              product.media && product.media.length > 0
                ? product.media[0]
                : { id: "", url: "" },
          })),
          shipping: {
            name: order.address.name,
            address: `Flat No. ${order.address.flatNo}, Floor No. ${order.address.floorNo}, ${order.address.addressLine}, ${order.address.city}, ${order.address.state},  ${order.address.postalCode}, ${order.address.country},`,

            phone: order.address.phoneNo,
          },
          payment: {
            method: order.paymentMethodTitle || "Unknown",
            subtotal: order.subTotal,
            shipping: order.deliveryCharge,
            tax: order.discount,
            total: order.total,
            paymentStatus: order.paymentStatus,
          },
        });
        setModalVisible(true); // Open the modal when an order is selected
      }
    } else {
      setSelectedOrder(null);
      setModalVisible(false); // Close the modal when orderId is null
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setCancelling(true);
    try {
      const response = await fetch(`${API_URL}/v1/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus: "cancelled" }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh orders list to reflect the cancellation
        await fetchOrders(0);
        // Close the modal
        toggleModal(null);
      } else {
        console.error(
          "Failed to cancel order:",
          data.message || "Unknown error"
        );
        // You can add an error toast/alert here if needed
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      // You can add an error toast/alert here if needed
    } finally {
      setCancelling(false);
    }
  };

  return (
    <ProtectedRoute>
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
          onCancelOrder={handleCancelOrder}
          cancelling={cancelling}
        />
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
});
