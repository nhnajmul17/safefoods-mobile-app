import React from "react";
import ProtectedRoute from "@/components/auth/protectedRoute";
import UnifiedCheckoutScreen from "@/components/checkoutScreen/UnifiedCheckoutScreen";

export default function CheckoutScreen() {
  return (
    <ProtectedRoute>
      <UnifiedCheckoutScreen isGuest={false} />
    </ProtectedRoute>
  );
}
