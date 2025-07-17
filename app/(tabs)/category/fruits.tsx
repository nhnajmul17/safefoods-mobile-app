import { FRUITS } from "@/constants/variables";

import CategoryProductsScreen from "@/components/categoryScreen/CategoryProductsScreen";
export default function FruitScreen() {
  return <CategoryProductsScreen categoryTitle={FRUITS} />;
}
