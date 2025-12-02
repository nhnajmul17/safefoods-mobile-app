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
export const getSafeImageUrl = (
  url: string | null | undefined,
  fallback: string = "https://via.placeholder.com/150"
): string => {
  if (!url) {
    return fallback;
  }
  return ensureHttps(url);
};

/**
 * Optimize Cloudinary image URL to reduce memory usage
 * Adds transformations to reduce image quality and size
 *
 * @param url - The Cloudinary image URL
 * @param width - Target width (default 800px for large images, 400px for thumbnails)
 * @param quality - Image quality 1-100 (default 60 for balance between quality and size)
 * @returns Optimized URL or original if not Cloudinary
 */
export const optimizeCloudinaryImage = (
  url: string,
  width: number = 800,
  quality: number = 60
): string => {
  const secureUrl = ensureHttps(url);

  // Only optimize Cloudinary images
  if (!secureUrl.includes("cloudinary.com")) {
    return secureUrl;
  }

  // Check if already optimized to avoid double transformation
  if (secureUrl.includes("/q_") || secureUrl.includes("/w_")) {
    return secureUrl;
  }

  // Add optimization parameters: quality, width, auto format
  // f_auto automatically picks best format (WebP on supported devices)
  const optimization = `q_${quality},w_${width},f_auto,c_limit`;

  return secureUrl.replace("/upload/", `/upload/${optimization}/`);
};

/**
 * Get optimized image URL for product cards and thumbnails
 * Uses aggressive optimization to prevent memory pool issues
 *
 * @param url - The image URL
 * @returns Optimized URL safe for memory-constrained rendering
 */
export const getOptimizedImageUrl = (
  url: string | null | undefined
): string => {
  if (!url) {
    return "https://via.placeholder.com/150";
  }

  const secureUrl = ensureHttps(url);

  // Optimize Cloudinary images with smaller dimensions
  return optimizeCloudinaryImage(secureUrl, 400, 50);
};
