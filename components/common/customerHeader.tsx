// Option 1: Use Custom Header Component (Recommended)
// Update your constants/headerConfig.ts

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { deepGreenColor } from "@/constants/Colors";

const CUSTOM_HEADER_HEIGHT = 120; // Increase this to your desired height
const STATUS_BAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;
const CONTENT_HEIGHT = 60; // Height of the actual content area

export const CustomHeader = ({
  title,
  canGoBack = false,
  rightComponent,
  showHeader = true,
}: {
  title: string;
  canGoBack?: boolean;
  rightComponent?: React.ReactNode;
  showHeader?: boolean;
}) => {
  const router = useRouter();

  if (!showHeader) return null;

  return (
    <View style={styles.customHeader}>
      <View style={styles.headerContent}>
        <View style={styles.leftContainer}>
          {canGoBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        <View style={styles.rightContainer}>{rightComponent}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  customHeader: {
    backgroundColor: deepGreenColor,
    height: CUSTOM_HEADER_HEIGHT,
    paddingTop: STATUS_BAR_HEIGHT,
    justifyContent: "flex-end",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    height: CONTENT_HEIGHT,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  leftContainer: {
    width: 50,
    justifyContent: "center",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
  },
  rightContainer: {
    width: 50,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});
