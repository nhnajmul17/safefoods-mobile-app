import { Platform, Linking, Alert } from "react-native";
import * as Application from "expo-application";
import { API_URL } from "@/constants/variables";

type VersionCheckResult =
  | { action: "ok" }
  | { action: "soft_update"; latest: string; current: string }
  | { action: "force_update"; minimum: string; current: string };

interface VersionConfig {
  minimumVersion: string;
  latestVersion: string;
}

/**
 * Gets the current app version from the app
 */
function getCurrentVersion(): string {
  return Application.nativeApplicationVersion || "0.0.0";
}

/**
 * Compares two version strings
 */
function compareVersions(version1: string, version2: string): number {
  const v1 = version1.split(".").map(Number);
  const v2 = version2.split(".").map(Number);
  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    const num1 = v1[i] || 0;
    const num2 = v2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

/**
 * API-based version check
 */
async function fetchVersionFromAPI(): Promise<VersionConfig | null> {
  try {
    // Replace with your actual API endpoint
    const response = await fetch(`${API_URL}/v1/app-version/latest`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error("Version API not available");
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log("API version check failed:", error);
    return null;
  }
}

/**
 * Hardcoded version configuration (fallback)
 */
function getHardcodedVersionConfig(): VersionConfig {
  return {
    minimumVersion: "1.0.5", // Force update below this version
    latestVersion: "1.0.7", // Optional update below this version
  };
}

/**
 * Main version checking function
 * Priority: API → Hardcoded values
 */
export async function checkVersionGate(
  useAPI: boolean = true
): Promise<VersionCheckResult> {
  try {
    let config: VersionConfig | null = null;
    let source = "hardcoded"; // Default to hardcoded

    // Try API if requested
    if (useAPI) {
      console.log("Trying API version check...");
      config = await fetchVersionFromAPI();
      if (config) {
        source = "api"; // Set source to API if successful
        console.log("Using API for version check");
      } else {
        console.log("Using hardcoded version config");
        config = getHardcodedVersionConfig();
      }
    } else {
      config = getHardcodedVersionConfig();
    }

    const minimum = config.minimumVersion;
    const latest = config.latestVersion;
    const current = getCurrentVersion();

    console.log("Version Check Result:", {
      minimum,
      latest,
      current,
      source, // Now accurately reflects the source
    });

    if (compareVersions(current, minimum) < 0) {
      return { action: "force_update", minimum, current };
    }

    if (compareVersions(current, latest) < 0) {
      return { action: "soft_update", latest, current };
    }

    return { action: "ok" };
  } catch (error) {
    console.error("Version check failed:", error);
    return { action: "ok" };
  }
}

/**
 * Opens the appropriate app store
 */
export function openStoreListing() {
  if (Platform.OS === "android") {
    const packageName = "safefoods.com.bd";
    const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
    Linking.openURL(playStoreUrl).catch(() => {
      Alert.alert("Error", "Unable to open Play Store");
    });
  } else {
    const appStoreUrl = "https://apps.apple.com/app/safe-food/idYOUR_APP_ID";
    Linking.openURL(appStoreUrl).catch(() => {
      Alert.alert("Error", "Unable to open App Store");
    });
  }
}
