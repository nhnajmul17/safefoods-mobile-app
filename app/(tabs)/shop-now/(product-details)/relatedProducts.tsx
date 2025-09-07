import React from "react";
import RelatedProducts from "@/components/productDetails/RelatedProducts";

interface RelatedProductsProps {
  productSlug: string;
}

export default function ShopNowRelatedProducts({ productSlug }: RelatedProductsProps) {
  return <RelatedProducts productSlug={productSlug} tabContext="shop-now" />;
}