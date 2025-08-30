import React from "react";
import { useLocalSearchParams } from "expo-router";
import CategoryProductsScreen from "@/components/categoryScreen/CategoryProductsScreen";
// import {
//   PROTEINS,
//   DAIRY,
//   MEAT,
//   EGG,
//   CHICKEN,
//   FISH,
//   FRUITS,
//   VEGETABLES,
//   OIL,
//   HONEY,
// } from "@/constants/variables";

export default function DynamicCategoryScreen() {
  // Get the category slug from the URL parameters
  const { category } = useLocalSearchParams();
  const categorySlug = category as string;

  // Map of valid category slugs to ensure proper handling
  // const validCategories: { [key: string]: string } = {
  //   protein: PROTEINS,
  //   dairy: DAIRY,
  //   meat: MEAT,
  //   egg: EGG,
  //   chicken: CHICKEN,
  //   fish: FISH,
  //   fruits: FRUITS,
  //   vegetables: VEGETABLES,
  //   oil: OIL,
  //   honey: HONEY,
  // };

  // Use the mapped category title or fallback to the slug if not found
  const categoryTitle = categorySlug;

  return <CategoryProductsScreen categoryTitle={categoryTitle} />;
}
