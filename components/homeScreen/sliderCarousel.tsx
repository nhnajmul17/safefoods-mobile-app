import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { API_URL } from "@/constants/variables";
import { ensureHttps, optimizeCloudinaryImage } from "@/utils/imageUtils";
import SliderCarouselSkeleton from "./sliderCarouselSkeleton";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48) / 2; // Show 2 items with padding
const ITEM_SPACING = 12;
const SIDE_PADDING = 16;

interface BannerItem {
  id: string;
  imageUrl: string;
  productSlug: string | null;
  aspectRatio?: number;
}

interface ApiBanner {
  id: string;
  url: string;
  productSlug: string | null;
  aspectRatio?: number;
}

export default function SliderCarousel() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const scrollX = useSharedValue(0);
  const flatListRef = React.useRef<FlatList>(null);
  const router = useRouter();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Prefetch images to improve loading - very limited to prevent memory issues
  const prefetchImages = (banners: BannerItem[]) => {
    // Only prefetch the first image to avoid memory pool violations
    if (banners.length > 0) {
      Image.prefetch(ensureHttps(banners[0].imageUrl)).catch(() => {
        // Ignore prefetch errors
      });
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1 && !isLoading) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % banners.length;
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          return nextIndex;
        });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [banners.length, isLoading]);

  useEffect(() => {
    return () => {
      // Clear loaded images set on unmount to free memory
      setLoadedImages(new Set());
    };
  }, []);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/v1/banners`);
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        const formattedBanners: BannerItem[] = data.data
          .filter((banner: ApiBanner) => banner.url) // Filter out banners without images
          .map((banner: ApiBanner) => ({
            id: banner.id,
            imageUrl: ensureHttps(banner.url),
            productSlug: banner.productSlug,
            aspectRatio: banner.aspectRatio,
          }));
        setBanners(formattedBanners);
        prefetchImages(formattedBanners);
      } else {
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBannerPress = (productSlug: string | null) => {
    if (productSlug) {
      router.push(`/(tabs)/home/(product-details)/${productSlug}`);
    }
  };

  const CarouselItem = React.memo(
    ({ item, index }: { item: BannerItem; index: number }) => {
      // Check if this specific image URL has been loaded before
      const imageLoaded = loadedImages.has(item.id);

      const animatedStyle = useAnimatedStyle(() => {
        return {};
      });

      const imageHeight = 180;

      // Use optimized image URL to prevent memory issues
      const imageUrl = optimizeCloudinaryImage(
        ensureHttps(item.imageUrl),
        400,
        60
      );

      const handleImageLoad = () => {
        setLoadedImages((prev) => new Set(prev).add(item.id));
      };

      return (
        <Animated.View style={[styles.carouselItem, animatedStyle]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleBannerPress(item.productSlug)}
            disabled={!item.productSlug}
          >
            <View style={[styles.imageContainer, { height: imageHeight }]}>
              {/* Placeholder/Loading state - only show if image hasn't been loaded yet */}
              {!imageLoaded && (
                <View style={styles.imagePlaceholder}>
                  <View style={styles.shimmerEffect} />
                </View>
              )}

              <Image
                source={{ uri: imageUrl }}
                style={[styles.bannerImage, !imageLoaded && styles.hiddenImage]}
                resizeMode="contain"
                onLoad={handleImageLoad}
                onError={(e) => {
                  console.log("Image load error:", e.nativeEvent.error);
                }}
                // Limit image size to prevent memory issues
                resizeMethod="resize"
              />
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    }
  );

  if (isLoading) {
    return <SliderCarouselSkeleton />;
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={banners}
        renderItem={({ item, index }) => (
          <CarouselItem key={`${item.id}-${index}`} item={item} index={index} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        initialNumToRender={2}
        maxToRenderPerBatch={1}
        windowSize={2}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
      />

      {banners.length > 1 && (
        <View style={styles.pagination}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  flatListContent: {
    paddingHorizontal: SIDE_PADDING,
  },
  carouselItem: {
    width: ITEM_WIDTH,
    marginHorizontal: ITEM_SPACING / 2,
  },
  imageContainer: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  hiddenImage: {
    opacity: 0,
  },
  imagePlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  shimmerEffect: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#2d5f3f",
    width: 24,
  },
});
