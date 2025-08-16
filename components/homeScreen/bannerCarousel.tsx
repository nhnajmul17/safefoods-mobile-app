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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const AUTO_SCROLL_INTERVAL = 4000;
const ITEM_WIDTH = SCREEN_WIDTH - 40; // 20px margin on each side
const ITEM_SPACING = 20;

interface BannerItem {
  id: string;
  imageUrl: string;
}

const banners: BannerItem[] = [
  {
    id: "1",
    imageUrl:
      "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1725527240%2Fsafefoods%2Fxf1g1pttbbebfcewremd.png&w=640&q=75",
  },
  {
    id: "2",
    imageUrl:
      "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1697759639%2Fsafefoods%2Fyhfifyae10ohhi61vtxv.png&w=640&q=75",
  },
  {
    id: "3",
    imageUrl:
      "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1698918817%2Fsafefoods%2Fkl5ytr2ttjy9w61jrhym.jpg&w=640&q=75",
  },
];

// Create a duplicated list for infinite scrolling
const infiniteBanners = [...banners, ...banners, ...banners];

const AnimatedFlatList = Animated.createAnimatedComponent<
  FlatListProps<BannerItem>
>(GestureHandlerFlatList);

const BannerCarousel = () => {
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<BannerItem>>(null);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);
  const isManualScroll = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    // Initial scroll to middle section
    requestAnimationFrame(() => {
      scrollToIndex(banners.length, false);
    });

    startAutoScroll();

    return stopAutoScroll;
  }, []);

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

    return (
      <Animated.View style={[styles.carouselItem, animatedStyle]}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.bannerImage}
            resizeMode="cover"
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
    height: 200,
    marginVertical: 15,
    position: "relative",
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
    height: 200,
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
    height: "100%",
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
