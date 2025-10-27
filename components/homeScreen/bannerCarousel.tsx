import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatListProps,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { FlatList as GestureHandlerFlatList } from "react-native-gesture-handler";
import { API_URL } from "@/constants/variables";
import { ensureHttps } from "@/utils/imageUtils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const AUTO_SCROLL_INTERVAL = 4000;
const ITEM_WIDTH = SCREEN_WIDTH - 40; // 20px margin on each side
const ITEM_SPACING = 20;

interface BannerItem {
  id: string;
  imageUrl: string;
  aspectRatio?: number; // Add aspect ratio to store image dimensions
}
const staticBanners: BannerItem[] = [
  {
    id: "1",
    imageUrl:
      "https://res.cloudinary.com/dymnymsph/image/upload/v1752568782/safefoods/xfefedgstnnaq4tobunx.png",
  },
  {
    id: "2",
    imageUrl:
      "https://res.cloudinary.com/dymnymsph/image/upload/v1752568679/safefoods/gmpio2pnmi6cwyatxjy1.png",
  },
  {
    id: "3",
    imageUrl:
      "https://res.cloudinary.com/dymnymsph/image/upload/v1752568607/safefoods/slkwfg82txztkdjhd4sm.png",
  },
];

interface ApiSlider {
  id: string;
  title: string;
  url: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const AnimatedFlatList = React.forwardRef<
  Animated.FlatList<BannerItem>,
  FlatListProps<BannerItem>
>((props, ref) => (
  <Animated.FlatList
    // @ts-ignore
    ref={ref}
    {...props}
    // @ts-ignore
    as={GestureHandlerFlatList}
  />
));

const BannerCarousel = () => {
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<BannerItem>>(null);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const isManualScroll = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [apiBanners, setApiBanners] = useState<BannerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get image dimensions with better error handling
  const getImageAspectRatio = (url: string): Promise<number> => {
    const secureUrl = ensureHttps(url);

    return new Promise((resolve) => {
      Image.getSize(
        secureUrl,
        (width, height) => {
          resolve(width / height);
        },
        (error) => {
          console.log("Error getting image size:", error);
          resolve(16 / 9); // Default aspect ratio
        }
      );
    });
  };

  // Determine which banners to use (API or static)
  const banners = apiBanners.length > 0 ? apiBanners : staticBanners;
  // Create infinite banners for scrolling
  const infiniteBanners = [...banners, ...banners, ...banners];

  // Fetch API data
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await fetch(`${API_URL}/v1/sliders`);
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          // Map API response to BannerItem format
          const mappedBanners: BannerItem[] = await Promise.all(
            result.data.map(async (slider: ApiSlider) => {
              const aspectRatio = await getImageAspectRatio(slider.url);
              return {
                id: slider.id,
                imageUrl: ensureHttps(slider.url),
                aspectRatio,
              };
            })
          );
          setApiBanners(mappedBanners);
        } else {
          // Use static banners with HTTPS and calculated aspect ratios
          const staticBannersWithRatios = await Promise.all(
            staticBanners.map(async (banner) => {
              const aspectRatio = await getImageAspectRatio(banner.imageUrl);
              return {
                ...banner,
                imageUrl: ensureHttps(banner.imageUrl),
                aspectRatio,
              };
            })
          );
          setApiBanners(staticBannersWithRatios);
        }
      } catch (error) {
        console.error("Error fetching sliders:", error);
        // Use static banners as fallback with HTTPS
        const staticBannersWithHttps = staticBanners.map((banner) => ({
          ...banner,
          imageUrl: ensureHttps(banner.imageUrl),
          aspectRatio: 16 / 9, // Default aspect ratio
        }));
        setApiBanners(staticBannersWithHttps);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliders();
  }, []);

  const getItemLayout = (
    _data: ArrayLike<BannerItem> | null | undefined,
    index: number
  ) => ({
    length: ITEM_WIDTH + ITEM_SPACING,
    offset: (ITEM_WIDTH + ITEM_SPACING) * index,
    index,
  });

  const scrollToIndex = (index: number, animated: boolean = true) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated,
    });
  };

  const startAutoScroll = () => {
    stopAutoScroll();
    let targetIndex = banners.length; // Start from middle section
    autoScrollTimer.current = setInterval(() => {
      if (!isManualScroll.current) {
        const nextIndex = (targetIndex % banners.length) + 1; // Next item in sequence
        targetIndex = nextIndex + banners.length; // Target middle section
        if (targetIndex >= banners.length * 2.5) {
          // Approaching end, prepare to reset to middle
          const normalizedIndex = nextIndex % banners.length;
          targetIndex = normalizedIndex + banners.length;
          // Scroll to the next item first, then reset position
          scrollToIndex(targetIndex);
          setTimeout(() => {
            if (!isManualScroll.current) {
              scrollToIndex(normalizedIndex + banners.length, false);
            }
          }, 300); // Delay to allow animation to complete
        } else {
          scrollToIndex(targetIndex);
        }
        runOnJS(setCurrentIndex)(nextIndex % banners.length);
      }
    }, AUTO_SCROLL_INTERVAL);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  };

  useEffect(() => {
    if (!isLoading && banners.length > 0) {
      // Initial scroll to middle section
      requestAnimationFrame(() => {
        scrollToIndex(banners.length, false);
      });

      startAutoScroll();
    }

    return stopAutoScroll;
  }, [isLoading, banners.length]);

  const handleSnapToItem = (index: number) => {
    const normalizedIndex = index % banners.length;
    if (index >= banners.length * 2 || index < banners.length) {
      setTimeout(() => {
        scrollToIndex(normalizedIndex + banners.length, false);
      }, 100); // Slight delay to ensure smooth snap
    }
    setCurrentIndex(normalizedIndex);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onBeginDrag: () => {
      isManualScroll.current = true;
      runOnJS(stopAutoScroll)();
    },
    onEndDrag: () => {
      isManualScroll.current = false;
      runOnJS(startAutoScroll)();
    },
    onMomentumEnd: (event) => {
      const index = Math.round(
        event.contentOffset.x / (ITEM_WIDTH + ITEM_SPACING)
      );
      runOnJS(handleSnapToItem)(index);
    },
  });

  const CarouselItem = ({
    item,
    index,
  }: {
    item: BannerItem;
    index: number;
  }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * (ITEM_WIDTH + ITEM_SPACING),
        index * (ITEM_WIDTH + ITEM_SPACING),
        (index + 1) * (ITEM_WIDTH + ITEM_SPACING),
      ];

      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.9, 1, 0.9],
        Extrapolate.CLAMP
      );

      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.7, 1, 0.7],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    // Calculate height based on aspect ratio
    const imageHeight = item.aspectRatio ? ITEM_WIDTH / item.aspectRatio : 200; // Default height if aspect ratio is not available

    return (
      <Animated.View style={[styles.carouselItem, animatedStyle]}>
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          <Image
            source={{ uri: item.imageUrl }}
            style={[styles.bannerImage, { height: imageHeight }]}
            resizeMode="cover"
            onError={(e) => {
              console.log(
                `Banner image load error (${item.id}):`,
                e.nativeEvent.error
              );
              // You could set a fallback image here
            }}
          />
        </View>
      </Animated.View>
    );
  };

  const PaginationDots = () => {
    return (
      <View style={styles.pagination}>
        {banners.map((_, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
              (index - 1 + banners.length) * (ITEM_WIDTH + ITEM_SPACING),
              (index + banners.length) * (ITEM_WIDTH + ITEM_SPACING),
              (index + 1 + banners.length) * (ITEM_WIDTH + ITEM_SPACING),
            ];

            const opacity = interpolate(
              scrollX.value,
              inputRange,
              [0.3, 1, 0.3],
              Extrapolate.CLAMP
            );

            const scale = interpolate(
              scrollX.value,
              inputRange,
              [0.8, 1.2, 0.8],
              Extrapolate.CLAMP
            );

            return {
              opacity,
              transform: [{ scale }],
            };
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                animatedStyle,
                currentIndex === index && styles.activeDot,
              ]}
            />
          );
        })}
      </View>
    );
  };

  // Optionally, show a loading state while fetching
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={[styles.imageContainer, { height: 180 }]}>
          <Image
            source={{
              uri: "https://via.placeholder.com/640x200?text=Loading...",
            }}
            style={[styles.bannerImage, { height: 180 }]}
            resizeMode="cover"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        ref={flatListRef}
        data={infiniteBanners}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <CarouselItem item={item} index={index} />
        )}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={styles.contentContainer}
        onScrollToIndexFailed={() => {
          requestAnimationFrame(() => {
            scrollToIndex(banners.length, false);
          });
        }}
      />
      <PaginationDots />
      <View style={styles.leftIndicator}>
        <View style={styles.edgeGradient} />
      </View>
      <View style={styles.rightIndicator}>
        <View style={styles.edgeGradient} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    position: "relative",
    minHeight: 150, // Set a minimum height
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  carouselItem: {
    width: ITEM_WIDTH,
    marginRight: ITEM_SPACING,
  },
  imageContainer: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bannerImage: {
    width: "100%",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  activeDot: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
  },
  leftIndicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 40,
    width: 30,
    zIndex: 1,
    pointerEvents: "none",
  },
  rightIndicator: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 40,
    width: 30,
    zIndex: 1,
    pointerEvents: "none",
  },
  edgeGradient: {
    flex: 1,
    backgroundColor: "transparent",
  },
});

export default BannerCarousel;
