import { View, StyleSheet, ScrollView } from "react-native";
import { Fragment, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import Toast from "react-native-toast-message";
import {
  ShopNowProduct,
  ProductVariant,
} from "@/components/shopNowScreen/shopNowProductCard";

import BestSellingProductCard from "./bestSellingProductCard";

// Define QuantityMap interface
interface QuantityMap {
  [productId: string]: number;
}

// Define products
const products: ShopNowProduct[] = [
  {
    id: "1a2b3c4d-5e6f-7890-abcd-1234567890ab",
    name: "Apple",
    category: "Fruits",
    variants: [
      {
        id: "a1b2c3d4-e5f6-7890-abcd-2345678901bc",
        price: 250,
        originalPrice: 270,
        description: "Fresh red apples, perfect for snacking or baking.",
        bestDeal: true,
        discountedSale: true,
        unit: "1kg",
        mediaItems: [
          {
            id: "b2c3d4e5-f6g7-8901-cdef-3456789012cd",
            mediaId: "c3d4e5f6-g7h8-9012-defg-4567890123de",
            image:
              "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Apple 1kg",
          },
        ],
      },
      {
        id: "d4e5f6g7-h8i9-0123-efgh-4567890123de",
        price: 130,
        originalPrice: 140,
        description: "Fresh red apples, perfect for snacking or baking.",
        bestDeal: false,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "e5f6g7h8-i9j0-1234-fghi-5678901234ef",
            mediaId: "f6g7h8i9-j0k1-2345-ghij-6789012345fg",
            image:
              "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Apple 500g",
          },
        ],
      },
    ],
  },
  {
    id: "7g890123-4567-8901-ghij-6789012345cd",
    name: "Mutton Leg",
    category: "Meat",
    variants: [
      {
        id: "h8i9j0k1-l2m3-4567-ijkl-7890123456de",
        price: 750,
        originalPrice: 780,
        description: "Tender mutton leg, ideal for roasting.",
        bestDeal: true,
        discountedSale: true,
        unit: "1kg",
        mediaItems: [
          {
            id: "i9j0k1l2-m3n4-5678-jklm-8901234567ef",
            mediaId: "j0k1l2m3-n4o5-6789-klmn-9012345678fg",
            image:
              "https://images.unsplash.com/photo-1630334337820-84afb05acf3a?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Mutton Leg 1kg",
          },
        ],
      },
      {
        id: "k1l2m3n4-o5p6-7890-lmno-8901234567fg",
        price: 400,
        originalPrice: 420,
        description: "Tender mutton leg, ideal for roasting.",
        bestDeal: false,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "l2m3n4o5-p6q7-8901-mnop-9012345678gh",
            mediaId: "m3n4o5p6-q7r8-9012-nopq-0123456789hi",
            image:
              "https://images.unsplash.com/photo-1630334337820-84afb05acf3a?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Mutton Leg 500g",
          },
        ],
      },
    ],
  },
  {
    id: "1a2b3c4d-5e6f-7890-abcd-1234567890gh",
    name: "Apple",
    category: "Fruits",
    variants: [
      {
        id: "a1b2c3d4-e5f6-7890-abcd-2345678901bc",
        price: 250,
        originalPrice: 270,
        description: "Fresh red apples, perfect for snacking or baking.",
        bestDeal: true,
        discountedSale: true,
        unit: "1kg",
        mediaItems: [
          {
            id: "b2c3d4e5-f6g7-8901-cdef-3456789012cd",
            mediaId: "c3d4e5f6-g7h8-9012-defg-4567890123de",
            image:
              "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Apple 1kg",
          },
        ],
      },
      {
        id: "d4e5f6g7-h8i9-0123-efgh-4567890123de",
        price: 130,
        originalPrice: 140,
        description: "Fresh red apples, perfect for snacking or baking.",
        bestDeal: false,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "e5f6g7h8-i9j0-1234-fghi-5678901234ef",
            mediaId: "f6g7h8i9-j0k1-2345-ghij-6789012345fg",
            image:
              "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Apple 500g",
          },
        ],
      },
    ],
  },
  {
    id: "7g890123-4567-8901-ghij-67890123dfcd",
    name: "Mutton Leg",
    category: "Meat",
    variants: [
      {
        id: "h8i9j0k1-l2m3-4567-ijkl-7890123456de",
        price: 750,
        originalPrice: 780,
        description: "Tender mutton leg, ideal for roasting.",
        bestDeal: true,
        discountedSale: true,
        unit: "1kg",
        mediaItems: [
          {
            id: "i9j0k1l2-m3n4-5678-jklm-8901234567ef",
            mediaId: "j0k1l2m3-n4o5-6789-klmn-9012345678fg",
            image:
              "https://images.unsplash.com/photo-1630334337820-84afb05acf3a?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Mutton Leg 1kg",
          },
        ],
      },
      {
        id: "k1l2m3n4-o5p6-7890-lmno-8901234567fg",
        price: 400,
        originalPrice: 420,
        description: "Tender mutton leg, ideal for roasting.",
        bestDeal: false,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "l2m3n4o5-p6q7-8901-mnop-9012345678gh",
            mediaId: "m3n4o5p6-q7r8-9012-nopq-0123456789hi",
            image:
              "https://images.unsplash.com/photo-1630334337820-84afb05acf3a?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Mutton Leg 500g",
          },
        ],
      },
    ],
  },
];

export default function HomeBestSelling() {
  const { addItem } = useCartStore();
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [selectedVariants, setSelectedVariants] = useState<{
    [productId: string]: ProductVariant;
  }>(
    Object.fromEntries(
      products.map((product) => [product.id, product.variants[0]])
    )
  );

  const handleAddToCart = (
    item: ShopNowProduct,
    selectedVariant: ProductVariant
  ) => {
    const quantity = quantities[item.id] || 0;
    if (quantity > 0) {
      addItem({
        id: item.id,
        variantId: selectedVariant.id,
        name: item.name,
        image:
          selectedVariant.mediaItems[0]?.image ||
          "https://via.placeholder.com/50",
        price: selectedVariant.price,
        unit: selectedVariant.unit,
        quantity,
      });
      Toast.show({
        type: "success",
        text1: "Added to Cart",
        text2: `${item.name} (${selectedVariant.unit}) x${quantity} added to cart.`,
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
      setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
    }
  };

  return (
    <View style={styles.container}>
      {/* Horizontal Scrollable Product List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.productsContainer}
        contentContainerStyle={styles.productsContent}
      >
        {products.map((item) => (
          <Fragment key={item.id}>
            <BestSellingProductCard
              item={item}
              quantity={quantities[item.id] || 0}
              selectedVariant={selectedVariants[item.id] || item.variants[0]}
              setSelectedVariants={setSelectedVariants}
              setQuantities={setQuantities}
              handleAddToCart={handleAddToCart}
            />
          </Fragment>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productsContainer: {
    paddingLeft: 0,
    marginBottom: 24,
  },
  productsContent: {
    paddingRight: 16,
  },
});
