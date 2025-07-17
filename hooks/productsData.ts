import { ShopNowProduct } from "@/components/shopNowScreen/shopNowProductCard";

// Define products before use
export const allProductsData: ShopNowProduct[] = [
  // dairy
  {
    id: "9i012345-6789-0123-ijkl-8901234567ef",
    title: "Cheddar",
    categoryTitle: "dairy",
    variants: [
      {
        id: "t0u1v2w3-x4y5-6789-uvwx-1234567890fg",
        price: 480,
        originalPrice: 500,
        description: "Sharp, tangy cheddar, great for sandwiches.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "u1v2w3x4-y5z6-7890-vwxy-2345678901gh",
            mediaId: "v2w3x4y5-z6a7-8901-wxyz-3456789012hi",
            mediaUrl:
              "https://images.unsplash.com/photo-1683314573422-649a3c6ad784?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Cheddar 500g",
          },
        ],
      },
      {
        id: "w3x4y5z6-a7b8-9012-xyza-2345678901hi",
        price: 900,
        originalPrice: 900,
        description: "Sharp, tangy cheddar, great for sandwiches.",
        bestDeal: false,
        discountedSale: false,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "x4y5z6a7-b8c9-0123-yzab-3456789012ij",
            mediaId: "y5z6a7b8-c9d0-1234-zabc-4567890123jk",
            mediaUrl:
              "https://images.unsplash.com/photo-1683314573422-649a3c6ad784?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Cheddar 1kg",
          },
        ],
      },
    ],
  },
  {
    id: "0j123456-7890-1234-jklm-9012345678fg",
    title: "Brie",
    categoryTitle: "dairy",
    variants: [
      {
        id: "z6a7b8c9-d0e1-2345-abcd-3456789012gh",
        price: 570,
        originalPrice: 600,
        description: "Creamy, soft brie, perfect for cheese boards.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "a7b8c9d0-e1f2-3456-bcde-4567890123hi",
            mediaId: "b8c9d0e1-f2g3-4567-cdef-5678901234ij",
            mediaUrl:
              "https://images.unsplash.com/photo-1607127368565-0fc09ac36028?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Brie 500g",
          },
        ],
      },
      {
        id: "c9d0e1f2-g3h4-5678-defg-4567890123ij",
        price: 1000,
        originalPrice: 1000,
        description: "Creamy, soft brie, perfect for cheese boards.",
        bestDeal: false,
        discountedSale: false,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "d0e1f2g3-h4i5-6789-efgh-5678901234jk",
            mediaId: "e1f2g3h4-i5j6-7890-fghi-6789012345kl",
            mediaUrl:
              "https://images.unsplash.com/photo-1607127368565-0fc09ac36028?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Brie 1kg",
          },
        ],
      },
    ],
  },
  {
    id: "1k234567-8901-2345-klmn-0123456789gh",
    title: "Gouda",
    categoryTitle: "dairy",
    variants: [
      {
        id: "f2g3h4i5-j6k7-8901-ghij-5678901234hi",
        price: 540,
        originalPrice: 560,
        description: "Mild, nutty gouda, ideal for snacking.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "g3h4i5j6-k7l8-9012-hijk-6789012345ij",
            mediaId: "h4i5j6k7-l8m9-0123-ijkl-7890123456jk",
            mediaUrl:
              "https://images.unsplash.com/photo-1632200729570-1043effd1b77?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Gouda 500g",
          },
        ],
      },
      {
        id: "i5j6k7l8-m9n0-1234-jklm-6789012345jk",
        price: 950,
        originalPrice: 950,
        description: "Mild, nutty gouda, ideal for snacking.",
        bestDeal: false,
        discountedSale: false,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "j6k7l8m9-n0p1-2345-klmn-7890123456kl",
            mediaId: "k7l8m9n0-p1q2-3456-lmno-8901234567lm",
            mediaUrl:
              "https://images.unsplash.com/photo-1632200729570-1043effd1b77?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Gouda 1kg",
          },
        ],
      },
    ],
  },
  {
    id: "2l345678-9012-3456-lmno-1234567890hi",
    title: "Parmesan",
    categoryTitle: "dairy",
    variants: [
      {
        id: "l8m9n0p1-q2r3-4567-mnop-7890123456ij",
        price: 660,
        originalPrice: 700,
        description: "Hard, salty parmesan, perfect for grating.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "m9n0p1q2-r3s4-5678-nopq-8901234567jk",
            mediaId: "n0p1q2r3-s4t5-6789-opqr-9012345678kl",
            mediaUrl:
              "https://images.unsplash.com/photo-1669908978664-485e69bc26cd?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Parmesan 500g",
          },
        ],
      },
      {
        id: "o1p2q3r4-s5t6-7890-pqrs-8901234567jk",
        price: 1200,
        originalPrice: 1200,
        description: "Hard, salty parmesan, perfect for grating.",
        bestDeal: false,
        discountedSale: false,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "p2q3r4s5-t6u7-8901-qrst-9012345678kl",
            mediaId: "q3r4s5t6-u7v8-9012-rstu-0123456789lm",
            mediaUrl:
              "https://images.unsplash.com/photo-1669908978664-485e69bc26cd?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Parmesan 1kg",
          },
        ],
      },
    ],
  },
  {
    id: "b2c3d4e5-f6g7-8901-cdef-2345678901bc",
    title: "Cheddar Cheese",
    categoryTitle: "dairy",
    variants: [
      {
        id: "c3d4e5f6-g7h8-9012-defg-4567890123de",
        price: 200,
        originalPrice: 220,
        description: "Freshly made cheddar cheese",
        bestDeal: false,
        discountedSale: true,
        unitTitle: "200g",
        mediaItems: [
          {
            id: "e5f6g7h8-i9j0-1234-fghi-6789012345fg",
            mediaId: "f6g7h8i9-j0k1-2345-ghij-7890123456gh",
            mediaUrl:
              "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746605017%2Fsafefoods%2Fzktq65tiuaywrj7wpmvv.jpg&w=384&q=75",
            mediaTitle: "Cheddar Cheese",
          },
        ],
      },
    ],
  },
  // Protein
  {
    id: "909b455c-5054-4b1e-9d4b-56f206da3d54",
    title: "Safe Premium Milk",
    categoryTitle: "proteins",
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
  // Egg
  {
    id: "c3d4e5f6-g7h8-9012-defg-3456789012cd",
    title: "Free Range Eggs",
    categoryTitle: "egg",
    variants: [
      {
        id: "d4e5f6g7-h8i9-0123-efgh-4567890123de",
        price: 300,
        originalPrice: 300,
        description: "Fresh free-range eggs",
        bestDeal: false,
        discountedSale: false,
        unitTitle: "dozen",
        mediaItems: [
          {
            id: "f6g7h8i9-j0k1-2345-ghij-6789012345fg",
            mediaId: "g7h8i9j0-k1l2-3456-hijk-7890123456gh",
            mediaUrl:
              "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746605028%2Fsafefoods%2Fttqjdgzmamisd9qrx7jp.png&w=640&q=75",
            mediaTitle: "Free Range Eggs",
          },
        ],
      },
    ],
  },
  // Oil
  {
    id: "d4e5f6g7-h8i9-0123-efgh-4567890123de",
    title: "Ghee",
    categoryTitle: "oil",
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

  // fruits
  {
    id: "1a2b3c4d-5e6f-7890-abcd-1234567890ab",
    title: "Apple",
    categoryTitle: "fruits",
    variants: [
      {
        id: "a1b2c3d4-e5f6-7890-abcd-2345678901bc",
        price: 250,
        originalPrice: 270,
        description: "Fresh red apples, perfect for snacking or baking.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "b2c3d4e5-f6g7-8901-cdef-3456789012cd",
            mediaId: "c3d4e5f6-g7h8-9012-defg-4567890123de",
            mediaUrl:
              "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Apple 1kg",
          },
        ],
      },
      {
        id: "d4e5f6g7-h8i9-0123-efgh-4567890123de",
        price: 130,
        originalPrice: 140,
        description: "Fresh red apples, perfect for snacking or baking.",
        bestDeal: false,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "e5f6g7h8-i9j0-1234-fghi-5678901234ef",
            mediaId: "f6g7h8i9-j0k1-2345-ghij-6789012345fg",
            mediaUrl:
              "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Apple 500g",
          },
        ],
      },
    ],
  },
  {
    id: "2b3c4d5e-6f78-9012-bcde-2345678901bc",
    title: "Banana",
    categoryTitle: "fruits",
    variants: [
      {
        id: "f6g7h8i9-j0k1-2345-ghij-7890123456gh",
        price: 150,
        originalPrice: 150,
        description: "Ripe yellow bananas, great for smoothies.",
        bestDeal: false,
        discountedSale: false,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "g7h8i9j0-k1l2-3456-hijk-8901234567hi",
            mediaId: "h8i9j0k1-l2m3-4567-ijkl-9012345678ij",
            mediaUrl:
              "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Banana 1kg",
          },
        ],
      },
      {
        id: "i9j0k1l2-m3n4-5678-jklm-9012345678ij",
        price: 80,
        originalPrice: 80,
        description: "Ripe yellow bananas, great for smoothies.",
        bestDeal: false,
        discountedSale: false,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "j0k1l2m3-n4o5-6789-klmn-0123456789jk",
            mediaId: "k1l2m3n4-o5p6-7890-lmno-1234567890kl",
            mediaUrl:
              "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Banana 500g",
          },
        ],
      },
    ],
  },
  {
    id: "3c4d5e6f-7890-1234-cdef-3456789012cd",
    title: "Orange",
    categoryTitle: "fruits",
    variants: [
      {
        id: "l2m3n4o5-p6q7-8901-mnop-2345678901lm",
        price: 200,
        originalPrice: 220,
        description: "Juicy oranges, rich in vitamin C.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "m3n4o5p6-q7r8-9012-nopq-3456789012mn",
            mediaId: "n4o5p6q7-r8s9-0123-opqr-4567890123no",
            mediaUrl:
              "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Orange 1kg",
          },
        ],
      },
      {
        id: "o5p6q7r8-s9t0-1234-pqrs-5678901234op",
        price: 110,
        originalPrice: 120,
        description: "Juicy oranges, rich in vitamin C.",
        bestDeal: false,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "p6q7r8s9-t0u1-2345-qrst-6789012345pq",
            mediaId: "q7r8s9t0-u1v2-3456-rstu-7890123456qr",
            mediaUrl:
              "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Orange 500g",
          },
        ],
      },
    ],
  },
  {
    id: "4d5e6f78-9012-3456-defg-4567890123de",
    title: "Strawberry",
    categoryTitle: "fruits",
    variants: [
      {
        id: "r8s9t0u1-v2w3-4567-stuv-7890123456rs",
        price: 300,
        originalPrice: 320,
        description: "Fresh strawberries, perfect for desserts.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "s9t0u1v2-w3x4-5678-tuvw-8901234567st",
            mediaId: "t0u1v2w3-x4y5-6789-uvwx-9012345678tu",
            mediaUrl:
              "https://plus.unsplash.com/premium_photo-1667049291185-6270613405aa?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Strawberry 500g",
          },
        ],
      },
      {
        id: "u1v2w3x4-y5z6-7890-vwxy-0123456789uv",
        price: 550,
        originalPrice: 550,
        description: "Fresh strawberries, perfect for desserts.",
        bestDeal: false,
        discountedSale: false,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "v2w3x4y5-z6a7-8901-wxyz-1234567890vw",
            mediaId: "w3x4y5z6-a7b8-9012-xyza-2345678901wx",
            mediaUrl:
              "https://plus.unsplash.com/premium_photo-1667049291185-6270613405aa?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Strawberry 1kg",
          },
        ],
      },
    ],
  },
  // meat
  {
    id: "20e4cf65-ba20-4804-a0ee-b81f4fc2ea3d",
    title: "Desi Beef regular",
    categoryTitle: "meat",
    variants: [
      {
        id: "66c423c5-8789-45a3-bcbd-8ce0a9d3e6fb",
        price: 4000,
        originalPrice: 4000,
        description: "Slaughtered every Monday and Thursday.",
        bestDeal: false,
        discountedSale: false,
        unitTitle: "5kg",
        mediaItems: [
          {
            id: "c1d37851-9779-483f-a86d-57c7b5515d0b",
            mediaId: "23f5ec04-5cd7-415e-8559-6d67005e3e57",
            mediaUrl:
              "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746605224%2Fsafefoods%2Fdbtlwhttruwqn7ckunah.png&w=640&q=75",
            mediaTitle: "Desi Beef regular",
          },
        ],
      },
      {
        id: "e95f72f8-cdfc-4aa4-8595-2a60a6149397",
        price: 800,
        originalPrice: 800,
        description: "Slaughtered every Monday and Thursday.",
        bestDeal: false,
        discountedSale: false,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "fdc2e021-a9c6-4e2f-87b3-2a06c7fb6d85",
            mediaId: "23f5ec04-5cd7-415e-8559-6d67005e3e57",
            mediaUrl:
              "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746605257%2Fsafefoods%2Flnhulgb58nueewehjk5d.png&w=384&q=75",
            mediaTitle: "Desi Beef regular",
          },
        ],
      },
    ],
  },
  {
    id: "6f789012-3456-7890-fghi-5678901234bc",
    title: "Beef Steak",
    categoryTitle: "meat",
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
    id: "7g890123-4567-8901-ghij-6789012345cd",
    title: "Mutton Leg",
    categoryTitle: "meat",
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
    id: "8h901234-5678-9012-hijk-7890123456de",
    title: "Lamb Chop",
    categoryTitle: "meat",
    variants: [
      {
        id: "n4o5p6q7-r8s9-0123-opqr-9012345678ef",
        price: 1200,
        originalPrice: 1250,
        description: "Succulent lamb chops, perfect for grilling.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "o5p6q7r8-s9t0-1234-pqrs-0123456789fg",
            mediaId: "p6q7r8s9-t0u1-2345-qrst-1234567890gh",
            mediaUrl:
              "https://plus.unsplash.com/premium_photo-1667545932065-59f39c3c4f2c?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Lamb Chop 1kg",
          },
        ],
      },
      {
        id: "q7r8s9t0-u1v2-3456-rstu-0123456789gh",
        price: 620,
        originalPrice: 640,
        description: "Succulent lamb chops, perfect for grilling.",
        bestDeal: false,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "r8s9t0u1-v2w3-4567-stuv-1234567890hi",
            mediaId: "s9t0u1v2-w3x4-5678-tuvw-2345678901ij",
            mediaUrl:
              "https://plus.unsplash.com/premium_photo-1667545932065-59f39c3c4f2c?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Lamb Chop 500g",
          },
        ],
      },
    ],
  },

  //chicken
  {
    id: "e5f6g7h8-i9j0-1234-fghi-5678901234ef",
    title: "Fresh Chicken",
    categoryTitle: "chicken",
    variants: [
      {
        id: "f6g7h8i9-j0k1-2345-ghij-6789012345fg",
        price: 600,
        originalPrice: 600,
        description: "Freshly cut chicken",
        bestDeal: false,
        discountedSale: false,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "h8i9j0k1-l2m3-4567-ijkl-8901234567hi",
            mediaId: "i9j0k1l2-m3n4-5678-jklm-9012345678ij",
            mediaUrl:
              "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746604823%2Fsafefoods%2Fz1ffllbrcrozxgvqrpsw.webp&w=384&q=75",
            mediaTitle: "Fresh Chicken",
          },
        ],
      },
      {
        id: "g7h8i9j0-k1l2-3456-hijk-7890123456gh",
        price: 2800,
        originalPrice: 2800,
        description: "Freshly cut chicken",
        bestDeal: false,
        discountedSale: false,
        unitTitle: "5kg",
        mediaItems: [
          {
            id: "i9j0k1l2-m3n4-5678-jklm-9012345678ij",
            mediaId: "j0k1l2m3-n4o5-6789-klmn-0123456789jk",
            mediaUrl:
              "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1751343613%2Fsafefoods%2Fdupvetodkgqm1vvwbjsh.webp&w=640&q=75",
            mediaTitle: "Fresh Chicken",
          },
        ],
      },
    ],
  },
  {
    id: "5e6f7890-1234-5678-efgh-4567890123ab",
    title: "Chicken Breast",
    categoryTitle: "chicken",
    variants: [
      {
        id: "v6w7x8y9-z0a1-2345-wxyz-5678901234bc",
        price: 600,
        originalPrice: 650,
        description: "Lean chicken breast, great for grilling.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "w7x8y9z0-a1b2-3456-xyza-6789012345cd",
            mediaId: "x8y9z0a1-b2c3-4567-yzab-7890123456de",
            mediaUrl:
              "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Chicken Breast 1kg",
          },
        ],
      },
      {
        id: "y9z0a1b2-c3d4-5678-zabc-6789012345ef",
        price: 320,
        originalPrice: 340,
        description: "Lean chicken breast, great for grilling.",
        bestDeal: false,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "z0a1b2c3-d4e5-6789-abcd-7890123456fg",
            mediaId: "a1b2c3d4-e5f6-7890-bcde-8901234567gh",
            mediaUrl:
              "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Chicken Breast 500g",
          },
        ],
      },
    ],
  },

  // vegetables
  {
    id: "3m456789-0123-4567-mnop-2345678901ij",
    title: "Bell Pepper Red",
    categoryTitle: "vegetables",
    variants: [
      {
        id: "r4s5t6u7-v8w9-0123-stuv-9012345678jk",
        price: 360,
        originalPrice: 380,
        description: "Sweet, crunchy bell peppers, great for salads.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "s5t6u7v8-w9x0-1234-tuvw-0123456789kl",
            mediaId: "t6u7v8w9-x0y1-2345-uvwx-1234567890lm",
            mediaUrl:
              "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Bell Pepper Red 1kg",
          },
        ],
      },
      {
        id: "u7v8w9x0-y1z2-3456-vwxy-0123456789kl",
        price: 190,
        originalPrice: 200,
        description: "Sweet, crunchy bell peppers, great for salads.",
        bestDeal: false,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "v8w9x0y1-z2a3-4567-wxyz-1234567890lm",
            mediaId: "w9x0y1z2-a3b4-5678-xyza-2345678901mn",
            mediaUrl:
              "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Bell Pepper Red 500g",
          },
        ],
      },
    ],
  },
  {
    id: "4n567890-1234-5678-nopq-3456789012jk",
    title: "Broccoli",
    categoryTitle: "vegetables",
    variants: [
      {
        id: "x0y1z2a3-b4c5-6789-yzab-1234567890lm",
        price: 170,
        originalPrice: 180,
        description: "Nutrient-rich broccoli, great for steaming.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "y1z2a3b4-c5d6-7890-zabc-2345678901mn",
            mediaId: "z2a3b4c5-d6e7-8901-abcd-3456789012no",
            mediaUrl:
              "https://plus.unsplash.com/premium_photo-1702403157830-9df749dc6c1e?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Broccoli 500g",
          },
        ],
      },
      {
        id: "a3b4c5d6-e7f8-9012-bcde-2345678901mn",
        price: 300,
        originalPrice: 300,
        description: "Nutrient-rich broccoli, great for steaming.",
        bestDeal: false,
        discountedSale: false,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "b4c5d6e7-f8g9-0123-cdef-3456789012no",
            mediaId: "c5d6e7f8-g9h0-1234-defg-4567890123op",
            mediaUrl:
              "https://plus.unsplash.com/premium_photo-1702403157830-9df749dc6c1e?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Broccoli 1kg",
          },
        ],
      },
    ],
  },
  {
    id: "5o678901-2345-6789-opqr-4567890123kl",
    title: "Papaya",
    categoryTitle: "vegetables",
    variants: [
      {
        id: "d6e7f8g9-h0i1-2345-efgh-3456789012mn",
        price: 210,
        originalPrice: 230,
        description: "Sweet, juicy papaya, great for smoothies.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "e7f8g9h0-i1j2-3456-fghi-4567890123no",
            mediaId: "f8g9h0i1-j2k3-4567-ghij-5678901234op",
            mediaUrl:
              "https://plus.unsplash.com/premium_photo-1675639895212-696149c275f9?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Papaya 1kg",
          },
        ],
      },
      {
        id: "g9h0i1j2-k3l4-5678-hijk-4567890123no",
        price: 110,
        originalPrice: 120,
        description: "Sweet, juicy papaya, great for smoothies.",
        bestDeal: false,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "h0i1j2k3-l4m5-6789-ijkl-5678901234op",
            mediaId: "i1j2k3l4-m5n6-7890-jklm-6789012345pq",
            mediaUrl:
              "https://plus.unsplash.com/premium_photo-1675639895212-696149c275f9?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Papaya 500g",
          },
        ],
      },
    ],
  },
  {
    id: "6p789012-3456-7890-pqrs-5678901234lm",
    title: "Lettuce",
    categoryTitle: "vegetables",
    variants: [
      {
        id: "j2k3l4m5-n6o7-8901-klmn-5678901234op",
        price: 120,
        originalPrice: 130,
        description: "Leafy green lettuce, perfect for salads and wraps.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "k3l4m5n6-o7p8-9012-lmno-6789012345pq",
            mediaId: "l4m5n6o7-p8q9-0123-mnop-7890123456qr",
            mediaUrl:
              "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Lettuce 500g",
          },
        ],
      },
      {
        id: "m5n6o7p8-q9r0-1234-nopq-6789012345pq",
        price: 200,
        originalPrice: 200,
        description: "Leafy green lettuce, perfect for salads and wraps.",
        bestDeal: false,
        discountedSale: false,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "n6o7p8q9-r0s1-2345-opqr-7890123456qr",
            mediaId: "o7p8q9r0-s1t2-3456-pqrs-8901234567rs",
            mediaUrl:
              "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Lettuce 1kg",
          },
        ],
      },
    ],
  },
  {
    id: "7q890123-4567-8901-qrst-6789012345mn",
    title: "Carrot",
    categoryTitle: "vegetables",
    variants: [
      {
        id: "p8q9r0s1-t2u3-4567-qrst-7890123456qr",
        price: 150,
        originalPrice: 160,
        description: "Crunchy, sweet carrots, great for snacking.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "q9r0s1t2-u3v4-5678-rstu-8901234567rs",
            mediaId: "r0s1t2u3-v4w5-6789-stuv-9012345678st",
            mediaUrl:
              "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Carrot 1kg",
          },
        ],
      },
      {
        id: "s1t2u3v4-w5x6-7890-tuvw-8901234567rs",
        price: 80,
        originalPrice: 85,
        description: "Crunchy, sweet carrots, great for snacking.",
        bestDeal: false,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "t2u3v4w5-x6y7-8901-uvwx-9012345678st",
            mediaId: "u3v4w5x6-y7z8-9012-vwxy-0123456789tu",
            mediaUrl:
              "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Carrot 500g",
          },
        ],
      },
    ],
  },
  {
    id: "8r901234-5678-9012-rstu-7890123456no",
    title: "Cabbage",
    categoryTitle: "vegetables",
    variants: [
      {
        id: "v4w5x6y7-z8a9-0123-wxyz-9012345678st",
        price: 180,
        originalPrice: 190,
        description: "Leafy green cabbage, great for salads and stir-fries.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "w5x6y7z8-a9b0-1234-xyza-0123456789tu",
            mediaId: "x6y7z8a9-b0c1-2345-yzab-1234567890uv",
            mediaUrl:
              "https://images.unsplash.com/photo-1730815046052-75a1b90117e2?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Cabbage 1kg",
          },
        ],
      },
      {
        id: "y7z8a9b0-c1d2-3456-zabc-0123456789tu",
        price: 100,
        originalPrice: 105,
        description: "Leafy green cabbage, great for salads and stir-fries.",
        bestDeal: false,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "z8a9b0c1-d2e3-4567-abcd-1234567890uv",
            mediaId: "a9b0c1d2-e3f4-5678-bcde-2345678901vw",
            mediaUrl:
              "https://images.unsplash.com/photo-1730815046052-75a1b90117e2?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Cabbage 500g",
          },
        ],
      },
    ],
  },
  {
    id: "9s012345-6789-0123-stuv-8901234567op",
    title: "Tomato",
    categoryTitle: "vegetables",
    variants: [
      {
        id: "b0c1d2e3-f4g5-6789-cdef-1234567890uv",
        price: 200,
        originalPrice: 220,
        description: "Juicy, red tomatoes, perfect for salads and sauces.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "c1d2e3f4-g5h6-7890-defg-2345678901vw",
            mediaId: "d2e3f4g5-h6i7-8901-efgh-3456789012wx",
            mediaUrl:
              "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Tomato 1kg",
          },
        ],
      },
      {
        id: "e3f4g5h6-i7j8-9012-fghi-2345678901vw",
        price: 110,
        originalPrice: 120,
        description: "Juicy, red tomatoes, perfect for salads and sauces.",
        bestDeal: false,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "f4g5h6i7-j8k9-0123-ghij-3456789012wx",
            mediaId: "g5h6i7j8-k9l0-1234-hijk-4567890123xy",
            mediaUrl:
              "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Tomato 500g",
          },
        ],
      },
    ],
  },
  {
    id: "0t123456-7890-1234-tuvw-9012345678pq",
    title: "Zucchini",
    categoryTitle: "vegetables",
    variants: [
      {
        id: "h6i7j8k9-l0m1-2345-ijkl-3456789012wx",
        price: 160,
        originalPrice: 170,
        description: "Versatile zucchini, great for grilling and baking.",
        bestDeal: true,
        discountedSale: true,
        unitTitle: "1kg",
        mediaItems: [
          {
            id: "i7j8k9l0-m1n2-3456-jklm-4567890123xy",
            mediaId: "j8k9l0m1-n2o3-4567-klmn-5678901234yz",
            mediaUrl:
              "https://images.unsplash.com/photo-1596056094719-10ba4f7ea650?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Zucchini 1kg",
          },
        ],
      },
      {
        id: "k9l0m1n2-o3p4-5678-lmno-4567890123xy",
        price: 85,
        originalPrice: 90,
        description: "Versatile zucchini, great for grilling and baking.",
        bestDeal: false,
        discountedSale: true,
        unitTitle: "500g",
        mediaItems: [
          {
            id: "l0m1n2o3-p4q5-6789-mnop-5678901234yz",
            mediaId: "m1n2o3p4-q5r6-7890-nopq-6789012345za",
            mediaUrl:
              "https://images.unsplash.com/photo-1596056094719-10ba4f7ea650?auto=format&fit=crop&w=500&q=60",
            mediaTitle: "Zucchini 500g",
          },
        ],
      },
    ],
  },
];
