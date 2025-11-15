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
import { ensureHttps } from "@/utils/imageUtils";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = React.useRef<FlatList>(null);
  const router = useRouter();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
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
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
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
      } else {
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const handleBannerPress = (productSlug: string | null) => {
    if (productSlug) {
      router.push(`/(tabs)/home/(product-details)/${productSlug}`);
    }
  };

  const CarouselItem = ({
    item,
    index,
  }: {
    item: BannerItem;
    index: number;
  }) => {
    const animatedStyle = useAnimatedStyle(() => {
      return {};
    });

    const imageHeight = 180;

    return (
      <Animated.View style={[styles.carouselItem, animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleBannerPress(item.productSlug)}
          disabled={!item.productSlug}
        >
          <View style={[styles.imageContainer, { height: imageHeight }]}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.bannerImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (banners.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={banners}
        renderItem={({ item, index }) => (
          <CarouselItem item={item} index={index} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        removeClippedSubviews={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
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
    // backgroundColor: "#f0f0f0",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
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
