import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface LoadMoreButtonProps {
  onPress: () => void;
  loading: boolean;
}

export default function LoadMoreButton({
  onPress,
  loading,
}: LoadMoreButtonProps) {
  return (
    <TouchableOpacity
      style={styles.loadMoreButton}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.loadMoreText}>
        {loading ? "Loading..." : "Load More"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loadMoreButton: {
    backgroundColor: "#55796d",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  loadMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
