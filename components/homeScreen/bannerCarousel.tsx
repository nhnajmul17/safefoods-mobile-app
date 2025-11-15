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
      "https://res.cloudinary.com/dymnymsph/image/upload/v1759228344/safefoods/dldqkk5h7qy34eejbfqo.jpg",
  },
  {
    id: "2",
    imageUrl:
      "https://res.cloudinary.com/dymnymsph/image/upload/v1759304303/safefoods/jf8thsovmpp3rz6ddc02.jpg",
  },
  {
    id: "3",
    imageUrl:
      "https://res.cloudinary.com/dymnymsph/image/upload/v1759304315/safefoods/aec8exfdufeenfcwbvpk.jpg",
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
  // Create infinite banners for scrolling (reduced to 2 copies to save memory)
  const infiniteBanners = banners.length > 0 ? [...banners, ...banners] : [];

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
    let targetIndex = 0;
    autoScrollTimer.current = setInterval(() => {
      if (!isManualScroll.current) {
        targetIndex = (targetIndex + 1) % banners.length;
        scrollToIndex(targetIndex);
        runOnJS(setCurrentIndex)(targetIndex);
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
      startAutoScroll();
    }

    return stopAutoScroll;
  }, [isLoading, banners.length]);

  const handleSnapToItem = (index: number) => {
    const normalizedIndex = index % banners.length;
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
    const imageHeight = item.aspectRatio ? ITEM_WIDTH / item.aspectRatio : 200;

    // Optimize image URL for lower quality if from Cloudinary
    const optimizedUrl = item.imageUrl.includes("cloudinary.com")
      ? item.imageUrl.replace("/upload/", "/upload/q_70,w_800,f_auto/")
      : item.imageUrl;

    return (
      <Animated.View style={[styles.carouselItem, animatedStyle]}>
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          <Image
            source={{ uri: optimizedUrl, cache: "force-cache" }}
            style={[styles.bannerImage, { height: imageHeight }]}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
    );
  };

  const PaginationDots = () => {
    return (
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
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
        initialNumToRender={3}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={true}
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
