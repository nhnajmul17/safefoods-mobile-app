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
    id: "5e6f7890-1234-5678-efgh-4567890123ab",
    name: "Chicken Breast",
    category: "Meat",
    variants: [
      {
        id: "v6w7x8y9-z0a1-2345-wxyz-5678901234bc",
        price: 600,
        originalPrice: 650,
        description: "Lean chicken breast, great for grilling.",
        bestDeal: true,
        discountedSale: true,
        unit: "1kg",
        mediaItems: [
          {
            id: "w7x8y9z0-a1b2-3456-xyza-6789012345cd",
            mediaId: "x8y9z0a1-b2c3-4567-yzab-7890123456de",
            image:
              "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Chicken Breast 1kg",
          },
        ],
      },
      {
        id: "y9z0a1b2-c3d4-5678-zabc-6789012345ef",
        price: 320,
        originalPrice: 340,
        description: "Lean chicken breast, great for grilling.",
        bestDeal: false,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "z0a1b2c3-d4e5-6789-abcd-7890123456fg",
            mediaId: "a1b2c3d4-e5f6-7890-bcde-8901234567gh",
            image:
              "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Chicken Breast 500g",
          },
        ],
      },
    ],
  },
  {
    id: "6f789012-3456-7890-fghi-5678901234bc",
    name: "Beef Steak",
    category: "Meat",
    variants: [
      {
        id: "b2c3d4e5-f6g7-8901-cdef-6789012345cd",
        price: 900,
        originalPrice: 950,
        description: "Juicy beef steak, perfect for barbecues.",
        bestDeal: true,
        discountedSale: true,
        unit: "1kg",
        mediaItems: [
          {
            id: "c3d4e5f6-g7h8-9012-defg-7890123456de",
            mediaId: "d4e5f6g7-h8i9-0123-efgh-8901234567ef",
            image:
              "https://images.unsplash.com/photo-1680538491591-7ce20c900f4f?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Beef Steak 1kg",
          },
        ],
      },
      {
        id: "e5f6g7h8-i9j0-1234-fghi-7890123456ef",
        price: 480,
        originalPrice: 500,
        description: "Juicy beef steak, perfect for barbecues.",
        bestDeal: false,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "f6g7h8i9-j0k1-2345-ghij-8901234567fg",
            mediaId: "g7h8i9j0-k1l2-3456-hijk-9012345678gh",
            image:
              "https://images.unsplash.com/photo-1680538491591-7ce20c900f4f?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Beef Steak 500g",
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
    id: "8h901234-5678-9012-hijk-7890123456de",
    name: "Lamb Chop",
    category: "Meat",
    variants: [
      {
        id: "n4o5p6q7-r8s9-0123-opqr-9012345678ef",
        price: 1200,
        originalPrice: 1250,
        description: "Succulent lamb chops, perfect for grilling.",
        bestDeal: true,
        discountedSale: true,
        unit: "1kg",
        mediaItems: [
          {
            id: "o5p6q7r8-s9t0-1234-pqrs-0123456789fg",
            mediaId: "p6q7r8s9-t0u1-2345-qrst-1234567890gh",
            image:
              "https://plus.unsplash.com/premium_photo-1667545932065-59f39c3c4f2c?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Lamb Chop 1kg",
          },
        ],
      },
      {
        id: "q7r8s9t0-u1v2-3456-rstu-0123456789gh",
        price: 620,
        originalPrice: 640,
        description: "Succulent lamb chops, perfect for grilling.",
        bestDeal: false,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "r8s9t0u1-v2w3-4567-stuv-1234567890hi",
            mediaId: "s9t0u1v2-w3x4-5678-tuvw-2345678901ij",
            image:
              "https://plus.unsplash.com/premium_photo-1667545932065-59f39c3c4f2c?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Lamb Chop 500g",
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
