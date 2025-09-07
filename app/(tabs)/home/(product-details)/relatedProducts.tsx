import React from "react";
import RelatedProducts from "@/components/productDetails/RelatedProducts";

interface RelatedProductsProps {
  productSlug: string;
}

export default function HomeRelatedProducts({ productSlug }: RelatedProductsProps) {
  return <RelatedProducts productSlug={productSlug} tabContext="home" />;
}