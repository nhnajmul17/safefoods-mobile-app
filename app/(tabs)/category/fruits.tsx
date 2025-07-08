import { View, StyleSheet, FlatList } from "react-native";
import { useState } from "react";

import { useCartStore } from "@/store/cartStore";
import Toast from "react-native-toast-message";
import {
  ShopNowProduct,
  ProductVariant,
} from "@/components/shopNowScreen/shopNowProductCard";

import CategoryProductCard from "@/components/categoryScreen/categoryProductCard";

// Define QuantityMap interface at the top
interface QuantityMap {
  [productId: string]: number;
}

// Define products before FruitScreen to avoid declaration order issue
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
    id: "2b3c4d5e-6f78-9012-bcde-2345678901bc",
    name: "Banana",
    category: "Fruits",
    variants: [
      {
        id: "f6g7h8i9-j0k1-2345-ghij-7890123456gh",
        price: 150,
        originalPrice: 150,
        description: "Ripe yellow bananas, great for smoothies.",
        bestDeal: false,
        discountedSale: false,
        unit: "1kg",
        mediaItems: [
          {
            id: "g7h8i9j0-k1l2-3456-hijk-8901234567hi",
            mediaId: "h8i9j0k1-l2m3-4567-ijkl-9012345678ij",
            image:
              "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Banana 1kg",
          },
        ],
      },
      {
        id: "i9j0k1l2-m3n4-5678-jklm-9012345678ij",
        price: 80,
        originalPrice: 80,
        description: "Ripe yellow bananas, great for smoothies.",
        bestDeal: false,
        discountedSale: false,
        unit: "500g",
        mediaItems: [
          {
            id: "j0k1l2m3-n4o5-6789-klmn-0123456789jk",
            mediaId: "k1l2m3n4-o5p6-7890-lmno-1234567890kl",
            image:
              "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Banana 500g",
          },
        ],
      },
    ],
  },
  {
    id: "3c4d5e6f-7890-1234-cdef-3456789012cd",
    name: "Orange",
    category: "Fruits",
    variants: [
      {
        id: "l2m3n4o5-p6q7-8901-mnop-2345678901lm",
        price: 200,
        originalPrice: 220,
        description: "Juicy oranges, rich in vitamin C.",
        bestDeal: true,
        discountedSale: true,
        unit: "1kg",
        mediaItems: [
          {
            id: "m3n4o5p6-q7r8-9012-nopq-3456789012mn",
            mediaId: "n4o5p6q7-r8s9-0123-opqr-4567890123no",
            image:
              "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Orange 1kg",
          },
        ],
      },
      {
        id: "o5p6q7r8-s9t0-1234-pqrs-5678901234op",
        price: 110,
        originalPrice: 120,
        description: "Juicy oranges, rich in vitamin C.",
        bestDeal: false,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "p6q7r8s9-t0u1-2345-qrst-6789012345pq",
            mediaId: "q7r8s9t0-u1v2-3456-rstu-7890123456qr",
            image:
              "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Orange 500g",
          },
        ],
      },
    ],
  },
  {
    id: "4d5e6f78-9012-3456-defg-4567890123de",
    name: "Strawberry",
    category: "Fruits",
    variants: [
      {
        id: "r8s9t0u1-v2w3-4567-stuv-7890123456rs",
        price: 300,
        originalPrice: 320,
        description: "Fresh strawberries, perfect for desserts.",
        bestDeal: true,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "s9t0u1v2-w3x4-5678-tuvw-8901234567st",
            mediaId: "t0u1v2w3-x4y5-6789-uvwx-9012345678tu",
            image:
              "https://plus.unsplash.com/premium_photo-1667049291185-6270613405aa?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Strawberry 500g",
          },
        ],
      },
      {
        id: "u1v2w3x4-y5z6-7890-vwxy-0123456789uv",
        price: 550,
        originalPrice: 550,
        description: "Fresh strawberries, perfect for desserts.",
        bestDeal: false,
        discountedSale: false,
        unit: "1kg",
        mediaItems: [
          {
            id: "v2w3x4y5-z6a7-8901-wxyz-1234567890vw",
            mediaId: "w3x4y5z6-a7b8-9012-xyza-2345678901wx",
            image:
              "https://plus.unsplash.com/premium_photo-1667049291185-6270613405aa?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Strawberry 1kg",
          },
        ],
      },
    ],
  },
];

export default function FruitScreen() {
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
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CategoryProductCard
            item={item}
            quantity={quantities[item.id] || 0}
            selectedVariant={selectedVariants[item.id] || item.variants[0]}
            setSelectedVariants={setSelectedVariants}
            setQuantities={setQuantities}
            handleAddToCart={handleAddToCart}
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={{ paddingBottom: 100 }}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },

  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
});
