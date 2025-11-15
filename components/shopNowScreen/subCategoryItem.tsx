import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Category } from "./types";
import {
  deepGreenColor,
  lightGreenTextColor,
  yellowColor,
} from "@/constants/Colors";

interface SubcategoryListProps {
  subcategories: Category[];
  selectedSubcategory: Category | null;
  onSelectSubcategory: (subcategory: Category | null) => void;
  flatListRef?: React.RefObject<FlatList | null>;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({
  subcategories,
  selectedSubcategory,
  onSelectSubcategory,
  flatListRef,
}) => {
  const internalFlatListRef = useRef<FlatList>(null);
  const listRef = flatListRef || internalFlatListRef;
  const [scrollIndicator, setScrollIndicator] = React.useState({
    width: 0,
    left: 0,
    visible: false,
  });
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [contentWidth, setContentWidth] = React.useState(0);

  // Reset scroll position when subcategories change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: 0, animated: false });
    }
  }, [subcategories]);

  // Handle scroll position updates
  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const totalScrollWidth = contentWidth - containerWidth;

    if (totalScrollWidth > 0) {
      const scrollPercentage = scrollX / totalScrollWidth;
      const indicatorWidth = Math.max(
        (containerWidth / contentWidth) * containerWidth,
        30
      );
      const maxIndicatorOffset = containerWidth - indicatorWidth;
      const indicatorLeft = scrollPercentage * maxIndicatorOffset;

      setScrollIndicator({
        width: indicatorWidth,
        left: indicatorLeft,
        visible: true,
      });
    }
  };

  // Handle content size changes
  const handleContentSizeChange = (width: number) => {
    setContentWidth(width);
  };

  // Handle layout changes
  const handleLayout = (event: any) => {
    const width = event.nativeEvent.layout.width;
    setContainerWidth(width);
  };

  // Update indicator visibility and initial position
  useEffect(() => {
    if (contentWidth > 0 && containerWidth > 0) {
      const isScrollable = contentWidth > containerWidth;
      if (isScrollable) {
        const indicatorWidth = Math.max(
          (containerWidth / contentWidth) * containerWidth,
          30
        );
        setScrollIndicator({
          width: indicatorWidth,
          left: 0,
          visible: true,
        });
      } else {
        setScrollIndicator((prev) => ({ ...prev, visible: false }));
      }
    }
  }, [contentWidth, containerWidth]);
  const renderSubcategoryItem = ({ item }: { item: Category }) => {
    const isSelected = selectedSubcategory?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.subcategoryItem,
          isSelected && styles.selectedSubcategoryItem,
        ]}
        onPress={() => onSelectSubcategory(item)}
      >
        <Text
          style={[
            styles.subcategoryText,
            isSelected && styles.selectedSubcategoryText,
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* All Option */}
      <TouchableOpacity
        style={[
          styles.subcategoryItem,
          !selectedSubcategory && styles.selectedSubcategoryItem,
        ]}
        onPress={() => onSelectSubcategory(null)}
      >
        <Text
          style={[
            styles.subcategoryText,
            !selectedSubcategory && styles.selectedSubcategoryText,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      <View style={styles.scrollWrapper} onLayout={handleLayout}>
        <FlatList
          ref={listRef}
          data={subcategories}
          renderItem={renderSubcategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          style={styles.flatList}
          onContentSizeChange={handleContentSizeChange}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
        {/* Custom scrollbar */}
        {scrollIndicator.visible && (
          <View style={styles.customScrollbar}>
            <View
              style={[
                styles.customScrollbarThumb,
                {
                  width: scrollIndicator.width,
                  left: scrollIndicator.left,
                },
              ]}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  listContent: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  subcategoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#e6f8dcff",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedSubcategoryItem: {
    backgroundColor: deepGreenColor,
  },
  subcategoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  selectedSubcategoryText: {
    color: yellowColor,
    fontWeight: "600",
  },
  flatList: {
    flexGrow: 0,
  },
  scrollWrapper: {
    flex: 1,
    position: "relative",
  },
  customScrollbar: {
    position: "absolute",
    bottom: 2,
    left: 4,
    right: 4,
    height: 3,
    backgroundColor: "#e0e0e0",
    borderRadius: 1.5,
  },
  customScrollbarThumb: {
    position: "absolute",
    height: 3,
    backgroundColor: lightGreenTextColor,
    borderRadius: 1.5,
  },
});

export default SubcategoryList;
