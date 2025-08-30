import {
  CHICKEN,
  DAIRY,
  EGG,
  FISH,
  FRUITS,
  HONEY,
  MEAT,
  OIL,
  PROTEINS,
  VEGETABLES,
} from "@/constants/variables";
import fishPng from "../../../assets/icons/fish.png";
import chickenPng from "../../../assets/icons/chicken.png";
import proteinPng from "../../../assets/icons/protein.png";
import eggPng from "../../../assets/icons/egg.png";
import oilPng from "../../../assets/icons/oil.png";
import honeyPng from "../../../assets/icons/honey.png";

export type CategoryType = {
  id: string;
  name: string;
  slug: string;
  href:
    | "/(tabs)/category/fruits"
    | "/(tabs)/category/vegetables"
    | "/(tabs)/category/dairy"
    | "/(tabs)/category/meat"
    | "/(tabs)/category/proteins"
    | "/(tabs)/category/egg"
    | "/(tabs)/category/chicken"
    | "/(tabs)/category/fish"
    | "/(tabs)/category/oil"
    | "/(tabs)/category/honey";

  icon: string;
};

export const categories: CategoryType[] = [
  {
    id: "1",
    name: PROTEINS,
    slug: PROTEINS,
    href: "/(tabs)/category/proteins",
    icon: proteinPng,
  },
  {
    id: "2",
    name: DAIRY,
    slug: DAIRY,
    href: "/(tabs)/category/dairy",
    icon: "https://cdn-icons-png.flaticon.com/512/3050/3050158.png",
  },
  {
    id: "3",
    name: MEAT,
    slug: MEAT,
    href: "/(tabs)/category/meat",
    icon: "https://cdn-icons-png.flaticon.com/512/3143/3143643.png",
  },
  {
    id: "4",
    name: EGG,
    slug: EGG,
    href: "/(tabs)/category/egg",
    icon: eggPng,
  },
  {
    id: "5",
    name: CHICKEN,
    slug: CHICKEN,
    href: "/(tabs)/category/chicken",
    icon: chickenPng,
  },
  {
    id: "6",
    name: FISH,
    slug: FISH,
    href: "/(tabs)/category/fish",
    icon: fishPng,
  },
  {
    id: "7",
    name: FRUITS,
    slug: FRUITS,
    href: "/(tabs)/category/fruits",
    icon: "https://cdn-icons-png.flaticon.com/512/415/415682.png",
  },
  {
    id: "8",
    name: VEGETABLES,
    slug: VEGETABLES,
    href: "/(tabs)/category/vegetables",
    icon: "https://cdn-icons-png.flaticon.com/512/2153/2153788.png",
  },
  {
    id: "9",
    name: OIL,
    slug: OIL,
    href: "/(tabs)/category/oil",
    icon: oilPng,
  },
  {
    id: "10",
    name: HONEY,
    slug: HONEY,
    href: "/(tabs)/category/honey",
    icon: honeyPng,
  },
];

// https://cdn-icons-png.flaticon.com/512/2718/2718224.png
// https://cdn-icons-png.flaticon.com/512/1046/1046759.png
