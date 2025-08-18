import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  useColorScheme,
  FlatList,
  FlatListProps,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  SharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { FlatList as GestureHandlerFlatList } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";

interface SafeFoodsReason {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.6;
const CARD_MARGIN = 10;
const TOTAL_CARD_WIDTH = CARD_WIDTH + CARD_MARGIN * 2;
const AUTO_SCROLL_INTERVAL = 3000;

const safeFoodsReasons: SafeFoodsReason[] = [
  {
    id: "1",
    title: "Freshness Guaranteed",
    description: "We source the freshest produce daily to ensure quality.",
    icon: "https://cdn-icons-png.flaticon.com/512/415/415682.png",
  },
  {
    id: "2",
    title: "100% Organic",
    description: "Our products are free from harmful chemicals.",
    icon: "https://cdn-icons-png.flaticon.com/512/2927/2927216.png",
  },
  {
    id: "3",
    title: "Safe & Reliable",
    description: "Strict quality checks for your peace of mind.",
    icon: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
  },
  {
    id: "4",
    title: "Fast Delivery",
    description: "Get your groceries delivered in hours.",
    icon: "https://cdn-icons-png.flaticon.com/512/3063/3063175.png",
  },
  {
    id: "5",
    title: "Sustainable Sourcing",
    description: "We support eco-friendly farming practices.",
    icon: "https://cdn-icons-png.flaticon.com/512/2927/2927217.png",
  },
];

// Create an array that appears infinite by duplicating the data
const infiniteData = [
  ...safeFoodsReasons,
  ...safeFoodsReasons,
  ...safeFoodsReasons,
];

const AnimatedFlatList = Animated.createAnimatedComponent<
  FlatListProps<SafeFoodsReason>
>(GestureHandlerFlatList);

interface CarouselItemProps {
  item: SafeFoodsReason;
  index: number;
  scrollX: SharedValue<number>;
}

const CarouselItem = React.memo(
  ({ item, index, scrollX }: CarouselItemProps) => {
    const colorScheme = useColorScheme();

    const inputRange = [
      (index - 1) * TOTAL_CARD_WIDTH,
      index * TOTAL_CARD_WIDTH,
      (index + 1) * TOTAL_CARD_WIDTH,
    ];

    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.8, 1, 0.8],
        Extrapolation.CLAMP
      );

      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.5, 1, 0.5],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return (
      <Animated.View
        style={[
          styles.card,
          animatedStyle,
          {
            backgroundColor: Colors.light.background,
            shadowColor: "#000",
          },
        ]}
      >
        <Image source={{ uri: item.icon }} style={styles.cardIcon} />
        <Text style={[styles.cardTitle, { color: Colors.light.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.cardDescription, { color: Colors.light.text }]}>
          {item.description}
        </Text>
      </Animated.View>
    );
  }
);

const WhySafeFoodsSection = () => {
  const colorScheme = useColorScheme();
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<SafeFoodsReason>>(null);
  const autoScrollTimer = useRef<NodeJS.Timeout>();
  const isManualScroll = useRef(false);
  const currentIndex = useRef(0);

  // Fixed getItemLayout type
  const getItemLayout = (
    data: ArrayLike<SafeFoodsReason> | null | undefined,
    index: number
  ) => ({
    length: TOTAL_CARD_WIDTH,
    offset: TOTAL_CARD_WIDTH * index,
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
        currentIndex.current =
          (currentIndex.current + 1) % safeFoodsReasons.length;
        scrollToIndex(currentIndex.current + safeFoodsReasons.length); // Scroll to duplicate item
      }
    }, AUTO_SCROLL_INTERVAL);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  const handleSnapToItem = (index: number) => {
    // If we're at the end of the duplicated list, reset to middle
    if (index >= safeFoodsReasons.length * 2) {
      scrollToIndex(
        (index % safeFoodsReasons.length) + safeFoodsReasons.length
      );
    }
    // If we're at the beginning of the duplicated list, reset to middle
    else if (index < safeFoodsReasons.length) {
      scrollToIndex(
        (index % safeFoodsReasons.length) + safeFoodsReasons.length
      );
    }
    currentIndex.current = index % safeFoodsReasons.length;
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
      const index = Math.round(event.contentOffset.x / TOTAL_CARD_WIDTH);
      runOnJS(handleSnapToItem)(index);
    },
  });

  return (
    <View
      style={[styles.section, { backgroundColor: Colors.light.background }]}
    >
      <Text style={[styles.sectionTitle, { color: Colors.light.text }]}>
        Why Safe Food
      </Text>
      <Text style={[styles.sectionDescription, { color: Colors.light.text }]}>
        We prioritize quality, freshness, and safety in every product we offer.
        Shop with confidence!
      </Text>

      <AnimatedFlatList
        ref={flatListRef}
        data={infiniteData}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <CarouselItem item={item} index={index} scrollX={scrollX} />
        )}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        snapToInterval={TOTAL_CARD_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.carousel}
        getItemLayout={getItemLayout}
        initialNumToRender={5}
        windowSize={5}
        initialScrollIndex={safeFoodsReasons.length} // Start in the middle
        onScrollToIndexFailed={() => {
          // Fallback if initial scroll fails
          requestAnimationFrame(() => {
            flatListRef.current?.scrollToIndex({
              index: safeFoodsReasons.length,
              animated: false,
            });
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  carousel: {
    paddingVertical: 16,
    paddingHorizontal: (SCREEN_WIDTH - TOTAL_CARD_WIDTH) / 2,
  },
  card: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardIcon: {
    width: 60,
    height: 60,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default WhySafeFoodsSection;
