import CategoryProductsScreen from "@/components/categoryScreen/CategoryProductsScreen";
import { PROTEINS } from "@/constants/variables";

export default function ProteinScreen() {
  return <CategoryProductsScreen categoryTitle={PROTEINS} />;
}
