import React from "react";
import RelatedProducts from "@/components/productDetails/RelatedProducts";

interface RelatedProductsProps {
  productSlug: string;
}

export default function CategoryRelatedProducts({ productSlug }: RelatedProductsProps) {
  return <RelatedProducts productSlug={productSlug} tabContext="category" />;
}