import React, { useRef, useEffect } from "react";
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
} from "react-native-reanimated";
import { FlatList as GestureHandlerFlatList } from "react-native-gesture-handler";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const AUTO_SCROLL_INTERVAL = 3000;

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
  const autoScrollTimer = useRef<NodeJS.Timeout>();
  const isManualScroll = useRef(false);
  const currentIndex = useRef(0);

  const getItemLayout = (
    _data: ArrayLike<BannerItem> | null | undefined,
    index: number
  ) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollTimer.current = setInterval(() => {
      if (!isManualScroll.current) {
        currentIndex.current = (currentIndex.current + 1) % banners.length;
        scrollToIndex(currentIndex.current + banners.length);
      }
    }, AUTO_SCROLL_INTERVAL);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
  };

  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, []);

  const handleSnapToItem = (index: number) => {
    if (index >= banners.length * 2) {
      scrollToIndex((index % banners.length) + banners.length);
    } else if (index < banners.length) {
      scrollToIndex((index % banners.length) + banners.length);
    }
    currentIndex.current = index % banners.length;
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onBeginDrag: () => {
      runOnJS(stopAutoScroll)();
      isManualScroll.current = true;
    },
    onEndDrag: () => {
      runOnJS(startAutoScroll)();
      isManualScroll.current = false;
    },
    onMomentumEnd: (event) => {
      const index = Math.round(event.contentOffset.x / SCREEN_WIDTH);
      runOnJS(handleSnapToItem)(index);
    },
  });

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        ref={flatListRef}
        data={infiniteBanners}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} />
        )}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        initialScrollIndex={banners.length}
        onScrollToIndexFailed={() => {
          requestAnimationFrame(() => {
            flatListRef.current?.scrollToIndex({
              index: banners.length,
              animated: false,
            });
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 200,
    padding: 14,
  },
  bannerImage: {
    width: SCREEN_WIDTH,
    height: "100%",
    resizeMode: "cover",
  },
});

export default BannerCarousel;
