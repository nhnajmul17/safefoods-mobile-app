import { useLocalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function WebViewScreen() {
  const { url } = useLocalSearchParams();
  const router = useRouter();

  // Ensure url is always a string
  const webUrl = Array.isArray(url) ? url[0] : url;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: webUrl as string }}
        style={styles.webView}
        onError={() => router.back()} // Handle load errors by going back
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});
