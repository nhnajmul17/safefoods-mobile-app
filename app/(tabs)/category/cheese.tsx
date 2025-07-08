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
    id: "9i012345-6789-0123-ijkl-8901234567ef",
    name: "Cheddar",
    category: "Cheese",
    variants: [
      {
        id: "t0u1v2w3-x4y5-6789-uvwx-1234567890fg",
        price: 480,
        originalPrice: 500,
        description: "Sharp, tangy cheddar, great for sandwiches.",
        bestDeal: true,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "u1v2w3x4-y5z6-7890-vwxy-2345678901gh",
            mediaId: "v2w3x4y5-z6a7-8901-wxyz-3456789012hi",
            image:
              "https://images.unsplash.com/photo-1683314573422-649a3c6ad784?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Cheddar 500g",
          },
        ],
      },
      {
        id: "w3x4y5z6-a7b8-9012-xyza-2345678901hi",
        price: 900,
        originalPrice: 900,
        description: "Sharp, tangy cheddar, great for sandwiches.",
        bestDeal: false,
        discountedSale: false,
        unit: "1kg",
        mediaItems: [
          {
            id: "x4y5z6a7-b8c9-0123-yzab-3456789012ij",
            mediaId: "y5z6a7b8-c9d0-1234-zabc-4567890123jk",
            image:
              "https://images.unsplash.com/photo-1683314573422-649a3c6ad784?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Cheddar 1kg",
          },
        ],
      },
    ],
  },
  {
    id: "0j123456-7890-1234-jklm-9012345678fg",
    name: "Brie",
    category: "Cheese",
    variants: [
      {
        id: "z6a7b8c9-d0e1-2345-abcd-3456789012gh",
        price: 570,
        originalPrice: 600,
        description: "Creamy, soft brie, perfect for cheese boards.",
        bestDeal: true,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "a7b8c9d0-e1f2-3456-bcde-4567890123hi",
            mediaId: "b8c9d0e1-f2g3-4567-cdef-5678901234ij",
            image:
              "https://images.unsplash.com/photo-1607127368565-0fc09ac36028?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Brie 500g",
          },
        ],
      },
      {
        id: "c9d0e1f2-g3h4-5678-defg-4567890123ij",
        price: 1000,
        originalPrice: 1000,
        description: "Creamy, soft brie, perfect for cheese boards.",
        bestDeal: false,
        discountedSale: false,
        unit: "1kg",
        mediaItems: [
          {
            id: "d0e1f2g3-h4i5-6789-efgh-5678901234jk",
            mediaId: "e1f2g3h4-i5j6-7890-fghi-6789012345kl",
            image:
              "https://images.unsplash.com/photo-1607127368565-0fc09ac36028?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Brie 1kg",
          },
        ],
      },
    ],
  },
  {
    id: "1k234567-8901-2345-klmn-0123456789gh",
    name: "Gouda",
    category: "Cheese",
    variants: [
      {
        id: "f2g3h4i5-j6k7-8901-ghij-5678901234hi",
        price: 540,
        originalPrice: 560,
        description: "Mild, nutty gouda, ideal for snacking.",
        bestDeal: true,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "g3h4i5j6-k7l8-9012-hijk-6789012345ij",
            mediaId: "h4i5j6k7-l8m9-0123-ijkl-7890123456jk",
            image:
              "https://images.unsplash.com/photo-1632200729570-1043effd1b77?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Gouda 500g",
          },
        ],
      },
      {
        id: "i5j6k7l8-m9n0-1234-jklm-6789012345jk",
        price: 950,
        originalPrice: 950,
        description: "Mild, nutty gouda, ideal for snacking.",
        bestDeal: false,
        discountedSale: false,
        unit: "1kg",
        mediaItems: [
          {
            id: "j6k7l8m9-n0p1-2345-klmn-7890123456kl",
            mediaId: "k7l8m9n0-p1q2-3456-lmno-8901234567lm",
            image:
              "https://images.unsplash.com/photo-1632200729570-1043effd1b77?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Gouda 1kg",
          },
        ],
      },
    ],
  },
  {
    id: "2l345678-9012-3456-lmno-1234567890hi",
    name: "Parmesan",
    category: "Cheese",
    variants: [
      {
        id: "l8m9n0p1-q2r3-4567-mnop-7890123456ij",
        price: 660,
        originalPrice: 700,
        description: "Hard, salty parmesan, perfect for grating.",
        bestDeal: true,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "m9n0p1q2-r3s4-5678-nopq-8901234567jk",
            mediaId: "n0p1q2r3-s4t5-6789-opqr-9012345678kl",
            image:
              "https://images.unsplash.com/photo-1669908978664-485e69bc26cd?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Parmesan 500g",
          },
        ],
      },
      {
        id: "o1p2q3r4-s5t6-7890-pqrs-8901234567jk",
        price: 1200,
        originalPrice: 1200,
        description: "Hard, salty parmesan, perfect for grating.",
        bestDeal: false,
        discountedSale: false,
        unit: "1kg",
        mediaItems: [
          {
            id: "p2q3r4s5-t6u7-8901-qrst-9012345678kl",
            mediaId: "q3r4s5t6-u7v8-9012-rstu-0123456789lm",
            image:
              "https://images.unsplash.com/photo-1669908978664-485e69bc26cd?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Parmesan 1kg",
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
