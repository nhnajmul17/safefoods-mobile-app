// components/ProtectedRoute.tsx
import React from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login-with-phone"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, router]);

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
