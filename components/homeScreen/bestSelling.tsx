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
    id: "7g890123-4567-8901-ghij-6789012345cd",
    title: "Mutton Leg",
    categoryTitle: "Meat",
    variants: [
      {
        id: "h8i9j0k1-l2m3-4567-ijkl-7890123456de",
        price: 750,
        originalPrice: 780,
        description: "Tender mutton leg, ideal for roasting.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "i9j0k1l2-m3n4-5678-jklm-8901234567ef",
            mediaId: "j0k1l2m3-n4o5-6789-klmn-9012345678fg",
            mediaUrl:
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
        unitTitle: "500g",
        mediaItems: [
          {
            id: "l2m3n4o5-p6q7-8901-mnop-9012345678gh",
            mediaId: "m3n4o5p6-q7r8-9012-nopq-0123456789hi",
            mediaUrl:
              "https://images.unsplash.com/photo-1630334337820-84afb05acf3a?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Mutton Leg 500g",
          },
        ],
      },
    ],
  },
  {
    id: "d4e5f6g7-h8i9-0123-efgh-4567890123de",
    title: "Ghee",
    categoryTitle: "Oil",
    variants: [
      {
        id: "e5f6g7h8-i9j0-1234-fghi-5678901234ef",
        price: 1200,
        originalPrice: 1300,
        description: "Fresh organic ghee",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "g7h8i9j0-k1l2-3456-hijk-7890123456gh",
            mediaId: "h8i9j0k1-l2m3-4567-ijkl-8901234567hi",
            mediaUrl:
              "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746605042%2Fsafefoods%2Fw3ygtedr1dvuoex9drwd.png&w=384&q=75",
            mediaTitle: "Organic Ghee",
          },
        ],
      },
    ],
  },
  {
    id: "6f789012-3456-7890-fghi-5678901234bc",
    title: "Beef Steak",
    categoryTitle: "Meat",
    variants: [
      {
        id: "b2c3d4e5-f6g7-8901-cdef-6789012345cd",
        price: 900,
        originalPrice: 950,
        description: "Juicy beef steak, perfect for barbecues.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "c3d4e5f6-g7h8-9012-defg-7890123456de",
            mediaId: "d4e5f6g7-h8i9-0123-efgh-8901234567ef",
            mediaUrl:
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
        unitTitle: "500g",
        mediaItems: [
          {
            id: "f6g7h8i9-j0k1-2345-ghij-8901234567fg",
            mediaId: "g7h8i9j0-k1l2-3456-hijk-9012345678gh",
            mediaUrl:
              "https://images.unsplash.com/photo-1680538491591-7ce20c900f4f?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Beef Steak 500g",
          },
        ],
      },
    ],
  },
  {
    id: "909b455c-5054-4b1e-9d4b-56f206da3d54",
    title: "Safe Premium Milk",
    categoryTitle: "Proteins",
    variants: [
      {
        id: "e9caf159-e9a2-4301-a5c4-944fbdf334ad",
        price: 110,
        originalPrice: 120,
        description: "Fresh milk",
        bestDeal: false,
        discountedSale: false,
        unitTitle: "1L",
        mediaItems: [
          {
            id: "c1d37851-9779-483f-a86d-57c7b5515ddb",
            mediaId: "23f5ec04-5cd7-415e-8559-6d67005e3e55",
            mediaUrl:
              "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746604594%2Fsafefoods%2Fl6gt9cdmhrmvu3ozrohc.png&w=640&q=75",
            mediaTitle: "Safe Premium Milk",
          },
        ],
      },
    ],
  },
];

export default function HomeBestSelling({
  isCategoryLoaded,
  setIsCategoryLoaded,
}: {
  isCategoryLoaded: boolean;
  setIsCategoryLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
        name: item.title,
        image:
          selectedVariant.mediaItems[0]?.mediaUrl ||
          "https://via.placeholder.com/50",
        price: selectedVariant.price,
        unit: selectedVariant.unitTitle,
        quantity,
      });
      Toast.show({
        type: "success",
        text1: "Added to Cart",
        text2: `${item.title} (${selectedVariant.unitTitle}) x${quantity} added to cart.`,
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
              isCategoryLoaded={isCategoryLoaded}
              setIsCategoryLoaded={setIsCategoryLoaded}
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
