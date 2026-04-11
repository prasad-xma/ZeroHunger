/*
export const mockProducts = [
  {
    id: "product_1",
    name: "Organic Whole Milk",
    category: "dairy",
    price: 450,
    nutrition: {
      calories: 150,
      protein: 8
    },
    allergens: ["milk"],
    stores: [
      { name: "Whole Foods", price: 450 },
      { name: "Trader Joe's", price: 420 },
      { name: "Safeway", price: 380 }
    ],
    healthScore: 85
  },
  {
    id: "product_2",
    name: "Fresh Strawberries",
    category: "produce",
    price: 350,
    nutrition: {
      calories: 32,
      protein: 0.7
    },
    allergens: [],
    stores: [
      { name: "Whole Foods", price: 350 },
      { name: "Trader Joe's", price: 320 },
      { name: "Safeway", price: 380 }
    ],
    healthScore: 95
  },
  {
    id: "product_3",
    name: "Whole Grain Bread",
    category: "grains",
    price: 280,
    nutrition: {
      calories: 120,
      protein: 4
    },
    allergens: ["gluten", "wheat"],
    stores: [
      { name: "Whole Foods", price: 280 },
      { name: "Trader Joe's", price: 250 },
      { name: "Safeway", price: 270 }
    ],
    healthScore: 75
  },
  {
    id: "product_4",
    name: "Chicken Breast",
    category: "protein",
    price: 1200,
    nutrition: {
      calories: 165,
      protein: 31
    },
    allergens: [],
    stores: [
      { name: "Whole Foods", price: 1200 },
      { name: "Trader Joe's", price: 1100 },
      { name: "Safeway", price: 950 }
    ],
    healthScore: 90
  },
  {
    id: "product_5",
    name: "Almond Butter",
    category: "snacks",
    price: 850,
    nutrition: {
      calories: 190,
      protein: 7
    },
    allergens: ["nuts", "almonds"],
    stores: [
      { name: "Whole Foods", price: 850 },
      { name: "Trader Joe's", price: 750 },
      { name: "Safeway", price: 900 }
    ],
    healthScore: 80
  },
  {
    id: "product_6",
    name: "Greek Yogurt",
    category: "dairy",
    price: 550,
    nutrition: {
      calories: 100,
      protein: 17
    },
    allergens: ["milk"],
    stores: [
      { name: "Whole Foods", price: 550 },
      { name: "Trader Joe's", price: 480 },
      { name: "Safeway", price: 520 }
    ],
    healthScore: 88
  },
  {
    id: "product_7",
    name: "Bananas",
    category: "produce",
    price: 180,
    nutrition: {
      calories: 105,
      protein: 1.3
    },
    allergens: [],
    stores: [
      { name: "Whole Foods", price: 180 },
      { name: "Trader Joe's", price: 160 },
      { name: "Safeway", price: 140 }
    ],
    healthScore: 92
  },
  {
    id: "product_8",
    name: "Quinoa",
    category: "grains",
    price: 650,
    nutrition: {
      calories: 120,
      protein: 4.4
    },
    allergens: [],
    stores: [
      { name: "Whole Foods", price: 650 },
      { name: "Trader Joe's", price: 580 },
      { name: "Safeway", price: 720 }
    ],
    healthScore: 85
  },
  {
    id: "product_9",
    name: "Salmon Fillet",
    category: "protein",
    price: 1800,
    nutrition: {
      calories: 208,
      protein: 22
    },
    allergens: [],
    stores: [
      { name: "Whole Foods", price: 1800 },
      { name: "Trader Joe's", price: 1650 },
      { name: "Safeway", price: 1500 }
    ],
    healthScore: 95
  },
  {
    id: "product_10",
    name: "Mixed Nuts",
    category: "snacks",
    price: 950,
    nutrition: {
      calories: 170,
      protein: 6
    },
    allergens: ["nuts", "peanuts"],
    stores: [
      { name: "Whole Foods", price: 950 },
      { name: "Trader Joe's", price: 780 },
      { name: "Safeway", price: 1000 }
    ],
    healthScore: 78
  },
  {
    id: "product_11",
    name: "Spinach",
    category: "produce",
    price: 250,
    nutrition: {
      calories: 23,
      protein: 2.9
    },
    allergens: [],
    stores: [
      { name: "Whole Foods", price: 250 },
      { name: "Trader Joe's", price: 220 },
      { name: "Safeway", price: 240 }
    ],
    healthScore: 96
  },
  {
    id: "product_12",
    name: "Brown Rice",
    category: "grains",
    price: 380,
    nutrition: {
      calories: 111,
      protein: 2.6
    },
    allergens: [],
    stores: [
      { name: "Whole Foods", price: 380 },
      { name: "Trader Joe's", price: 340 },
      { name: "Safeway", price: 360 }
    ],
    healthScore: 82
  },
  {
    id: "product_13",
    name: "Eggs",
    category: "protein",
    price: 480,
    nutrition: {
      calories: 155,
      protein: 13
    },
    allergens: ["eggs"],
    stores: [
      { name: "Whole Foods", price: 480 },
      { name: "Trader Joe's", price: 450 },
      { name: "Safeway", price: 400 }
    ],
    healthScore: 87
  },
  {
    id: "product_14",
    name: "Peanut Butter",
    category: "snacks",
    price: 520,
    nutrition: {
      calories: 190,
      protein: 8
    },
    allergens: ["peanuts"],
    stores: [
      { name: "Whole Foods", price: 520 },
      { name: "Trader Joe's", price: 420 },
      { name: "Safeway", price: 580 }
    ],
    healthScore: 76
  },
  {
    id: "product_15",
    name: "Avocados",
    category: "produce",
    price: 650,
    nutrition: {
      calories: 160,
      protein: 2
    },
    allergens: [],
    stores: [
      { name: "Whole Foods", price: 650 },
      { name: "Trader Joe's", price: 550 },
      { name: "Safeway", price: 700 }
    ],
    healthScore: 91
  }
];

export const categories = ['all', 'dairy', 'produce', 'grains', 'protein', 'snacks'];

export const stores = ['Whole Foods', "Trader Joe's", 'Safeway'];
*/
