import { deepGreenColor } from "./Colors";

export const SHARED_HEADER_OPTIONS = {
  headerStyle: {
    backgroundColor: deepGreenColor,
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold" as const,
    fontSize: 24,
    color: "#fff",
  },
  headerTitleAlign: "center" as const,
};

// Export the custom header options
export const CUSTOM_HEADER_OPTIONS = {
  headerShown: false, // Hide default header since we're using custom
};
