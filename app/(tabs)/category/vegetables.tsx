import CategoryProductsScreen from "@/components/categoryScreen/CategoryProductsScreen";
import { VEGETABLES } from "@/constants/variables";

export default function VegetableScreen() {
  return <CategoryProductsScreen categoryTitle={VEGETABLES} />;
}
