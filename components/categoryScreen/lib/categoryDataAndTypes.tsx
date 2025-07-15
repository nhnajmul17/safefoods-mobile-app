import {
  DAIRY,
  FRUITS,
  MEAT,
  PROTEINS,
  VEGETABLES,
} from "@/constants/variables";

export type CategoryType = {
  id: string;
  name: string;
  href:
    | "/(tabs)/category/fruits"
    | "/(tabs)/category/vegetables"
    | "/(tabs)/category/dairy"
    | "/(tabs)/category/meat"
    | "/(tabs)/category/protein";

  icon: string;
};

export const categories: CategoryType[] = [
  {
    id: "1",
    name: FRUITS,
    href: "/(tabs)/category/fruits",
    icon: "https://cdn-icons-png.flaticon.com/512/415/415682.png",
  },
  {
    id: "2",
    name: VEGETABLES,
    href: "/(tabs)/category/vegetables",
    icon: "https://cdn-icons-png.flaticon.com/512/2153/2153788.png",
  },
  {
    id: "3",
    name: DAIRY,
    href: "/(tabs)/category/dairy",
    icon: "https://cdn-icons-png.flaticon.com/512/3050/3050158.png",
  },
  {
    id: "4",
    name: MEAT,
    href: "/(tabs)/category/meat",
    icon: "https://cdn-icons-png.flaticon.com/512/3143/3143643.png",
  },
  {
    id: "5",
    name: PROTEINS,
    href: "/(tabs)/category/protein",
    icon: "https://cdn-icons-png.flaticon.com/512/1046/1046759.png",
  },
];
