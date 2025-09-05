/**
 * Utility function to ensure image URLs use HTTPS protocol
 * This is necessary for production APK builds where HTTP requests are blocked
 * 
 * @param url - The image URL to convert
 * @returns The URL with HTTPS protocol
 */
export const ensureHttps = (url: string): string => {
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
};

/**
 * Get a safe image URL with HTTPS protocol and fallback
 * 
 * @param url - The image URL (can be null/undefined)
 * @param fallback - Fallback URL if the main URL is not available
 * @returns A safe HTTPS URL
 */
export const getSafeImageUrl = (url: string | null | undefined, fallback: string = "https://via.placeholder.com/150"): string => {
  if (!url) {
    return fallback;
  }
  return ensureHttps(url);
};