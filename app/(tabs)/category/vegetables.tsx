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
    id: "3m456789-0123-4567-mnop-2345678901ij",
    name: "Bell Pepper Red",
    category: "Vegetables",
    variants: [
      {
        id: "r4s5t6u7-v8w9-0123-stuv-9012345678jk",
        price: 360,
        originalPrice: 380,
        description: "Sweet, crunchy bell peppers, great for salads.",
        bestDeal: true,
        discountedSale: true,
        unit: "1kg",
        mediaItems: [
          {
            id: "s5t6u7v8-w9x0-1234-tuvw-0123456789kl",
            mediaId: "t6u7v8w9-x0y1-2345-uvwx-1234567890lm",
            image:
              "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Bell Pepper Red 1kg",
          },
        ],
      },
      {
        id: "u7v8w9x0-y1z2-3456-vwxy-0123456789kl",
        price: 190,
        originalPrice: 200,
        description: "Sweet, crunchy bell peppers, great for salads.",
        bestDeal: false,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "v8w9x0y1-z2a3-4567-wxyz-1234567890lm",
            mediaId: "w9x0y1z2-a3b4-5678-xyza-2345678901mn",
            image:
              "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Bell Pepper Red 500g",
          },
        ],
      },
    ],
  },
  {
    id: "4n567890-1234-5678-nopq-3456789012jk",
    name: "Broccoli",
    category: "Vegetables",
    variants: [
      {
        id: "x0y1z2a3-b4c5-6789-yzab-1234567890lm",
        price: 170,
        originalPrice: 180,
        description: "Nutrient-rich broccoli, great for steaming.",
        bestDeal: true,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "y1z2a3b4-c5d6-7890-zabc-2345678901mn",
            mediaId: "z2a3b4c5-d6e7-8901-abcd-3456789012no",
            image:
              "https://plus.unsplash.com/premium_photo-1702403157830-9df749dc6c1e?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Broccoli 500g",
          },
        ],
      },
      {
        id: "a3b4c5d6-e7f8-9012-bcde-2345678901mn",
        price: 300,
        originalPrice: 300,
        description: "Nutrient-rich broccoli, great for steaming.",
        bestDeal: false,
        discountedSale: false,
        unit: "1kg",
        mediaItems: [
          {
            id: "b4c5d6e7-f8g9-0123-cdef-3456789012no",
            mediaId: "c5d6e7f8-g9h0-1234-defg-4567890123op",
            image:
              "https://plus.unsplash.com/premium_photo-1702403157830-9df749dc6c1e?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Broccoli 1kg",
          },
        ],
      },
    ],
  },
  {
    id: "5o678901-2345-6789-opqr-4567890123kl",
    name: "Papaya",
    category: "Vegetables",
    variants: [
      {
        id: "d6e7f8g9-h0i1-2345-efgh-3456789012mn",
        price: 210,
        originalPrice: 230,
        description: "Sweet, juicy papaya, great for smoothies.",
        bestDeal: true,
        discountedSale: true,
        unit: "1kg",
        mediaItems: [
          {
            id: "e7f8g9h0-i1j2-3456-fghi-4567890123no",
            mediaId: "f8g9h0i1-j2k3-4567-ghij-5678901234op",
            image:
              "https://plus.unsplash.com/premium_photo-1675639895212-696149c275f9?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Papaya 1kg",
          },
        ],
      },
      {
        id: "g9h0i1j2-k3l4-5678-hijk-4567890123no",
        price: 110,
        originalPrice: 120,
        description: "Sweet, juicy papaya, great for smoothies.",
        bestDeal: false,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "h0i1j2k3-l4m5-6789-ijkl-5678901234op",
            mediaId: "i1j2k3l4-m5n6-7890-jklm-6789012345pq",
            image:
              "https://plus.unsplash.com/premium_photo-1675639895212-696149c275f9?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Papaya 500g",
          },
        ],
      },
    ],
  },
  {
    id: "6p789012-3456-7890-pqrs-5678901234lm",
    name: "Lettuce",
    category: "Vegetables",
    variants: [
      {
        id: "j2k3l4m5-n6o7-8901-klmn-5678901234op",
        price: 120,
        originalPrice: 130,
        description: "Leafy green lettuce, perfect for salads and wraps.",
        bestDeal: true,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "k3l4m5n6-o7p8-9012-lmno-6789012345pq",
            mediaId: "l4m5n6o7-p8q9-0123-mnop-7890123456qr",
            image:
              "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Lettuce 500g",
          },
        ],
      },
      {
        id: "m5n6o7p8-q9r0-1234-nopq-6789012345pq",
        price: 200,
        originalPrice: 200,
        description: "Leafy green lettuce, perfect for salads and wraps.",
        bestDeal: false,
        discountedSale: false,
        unit: "1kg",
        mediaItems: [
          {
            id: "n6o7p8q9-r0s1-2345-opqr-7890123456qr",
            mediaId: "o7p8q9r0-s1t2-3456-pqrs-8901234567rs",
            image:
              "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Lettuce 1kg",
          },
        ],
      },
    ],
  },
  {
    id: "7q890123-4567-8901-qrst-6789012345mn",
    name: "Carrot",
    category: "Vegetables",
    variants: [
      {
        id: "p8q9r0s1-t2u3-4567-qrst-7890123456qr",
        price: 150,
        originalPrice: 160,
        description: "Crunchy, sweet carrots, great for snacking.",
        bestDeal: true,
        discountedSale: true,
        unit: "1kg",
        mediaItems: [
          {
            id: "q9r0s1t2-u3v4-5678-rstu-8901234567rs",
            mediaId: "r0s1t2u3-v4w5-6789-stuv-9012345678st",
            image:
              "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Carrot 1kg",
          },
        ],
      },
      {
        id: "s1t2u3v4-w5x6-7890-tuvw-8901234567rs",
        price: 80,
        originalPrice: 85,
        description: "Crunchy, sweet carrots, great for snacking.",
        bestDeal: false,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "t2u3v4w5-x6y7-8901-uvwx-9012345678st",
            mediaId: "u3v4w5x6-y7z8-9012-vwxy-0123456789tu",
            image:
              "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Carrot 500g",
          },
        ],
      },
    ],
  },
  {
    id: "8r901234-5678-9012-rstu-7890123456no",
    name: "Cabbage",
    category: "Vegetables",
    variants: [
      {
        id: "v4w5x6y7-z8a9-0123-wxyz-9012345678st",
        price: 180,
        originalPrice: 190,
        description: "Leafy green cabbage, great for salads and stir-fries.",
        bestDeal: true,
        discountedSale: true,
        unit: "1kg",
        mediaItems: [
          {
            id: "w5x6y7z8-a9b0-1234-xyza-0123456789tu",
            mediaId: "x6y7z8a9-b0c1-2345-yzab-1234567890uv",
            image:
              "https://images.unsplash.com/photo-1730815046052-75a1b90117e2?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Cabbage 1kg",
          },
        ],
      },
      {
        id: "y7z8a9b0-c1d2-3456-zabc-0123456789tu",
        price: 100,
        originalPrice: 105,
        description: "Leafy green cabbage, great for salads and stir-fries.",
        bestDeal: false,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "z8a9b0c1-d2e3-4567-abcd-1234567890uv",
            mediaId: "a9b0c1d2-e3f4-5678-bcde-2345678901vw",
            image:
              "https://images.unsplash.com/photo-1730815046052-75a1b90117e2?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Cabbage 500g",
          },
        ],
      },
    ],
  },
  {
    id: "9s012345-6789-0123-stuv-8901234567op",
    name: "Tomato",
    category: "Vegetables",
    variants: [
      {
        id: "b0c1d2e3-f4g5-6789-cdef-1234567890uv",
        price: 200,
        originalPrice: 220,
        description: "Juicy, red tomatoes, perfect for salads and sauces.",
        bestDeal: true,
        discountedSale: true,
        unit: "1kg",
        mediaItems: [
          {
            id: "c1d2e3f4-g5h6-7890-defg-2345678901vw",
            mediaId: "d2e3f4g5-h6i7-8901-efgh-3456789012wx",
            image:
              "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Tomato 1kg",
          },
        ],
      },
      {
        id: "e3f4g5h6-i7j8-9012-fghi-2345678901vw",
        price: 110,
        originalPrice: 120,
        description: "Juicy, red tomatoes, perfect for salads and sauces.",
        bestDeal: false,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "f4g5h6i7-j8k9-0123-ghij-3456789012wx",
            mediaId: "g5h6i7j8-k9l0-1234-hijk-4567890123xy",
            image:
              "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Tomato 500g",
          },
        ],
      },
    ],
  },
  {
    id: "0t123456-7890-1234-tuvw-9012345678pq",
    name: "Zucchini",
    category: "Vegetables",
    variants: [
      {
        id: "h6i7j8k9-l0m1-2345-ijkl-3456789012wx",
        price: 160,
        originalPrice: 170,
        description: "Versatile zucchini, great for grilling and baking.",
        bestDeal: true,
        discountedSale: true,
        unit: "1kg",
        mediaItems: [
          {
            id: "i7j8k9l0-m1n2-3456-jklm-4567890123xy",
            mediaId: "j8k9l0m1-n2o3-4567-klmn-5678901234yz",
            image:
              "https://images.unsplash.com/photo-1596056094719-10ba4f7ea650?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Zucchini 1kg",
          },
        ],
      },
      {
        id: "k9l0m1n2-o3p4-5678-lmno-4567890123xy",
        price: 85,
        originalPrice: 90,
        description: "Versatile zucchini, great for grilling and baking.",
        bestDeal: false,
        discountedSale: true,
        unit: "500g",
        mediaItems: [
          {
            id: "l0m1n2o3-p4q5-6789-mnop-5678901234yz",
            mediaId: "m1n2o3p4-q5r6-7890-nopq-6789012345za",
            image:
              "https://images.unsplash.com/photo-1596056094719-10ba4f7ea650?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Zucchini 500g",
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
