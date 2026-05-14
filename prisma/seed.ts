const sampleProducts = [
  {
    name: "Argentina Home Jersey 2025",
    slug: "argentina-home-jersey-2025",
    category: "National Teams",
    subcategory: "Home Jersey",
    team: "Argentina",
    price: 1499,
    oldPrice: 1899,
    mainImage: "/images/default-product.webp",
    stock: 25,

    // ✅ FIXED (STRING not array)
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    galleryImages: JSON.stringify(["/images/default-product.webp"]),
  },
  {
    name: "Real Madrid Special Edition",
    slug: "real-madrid-special-edition",
    category: "Clubs",
    subcategory: "Special Edition",
    team: "Real Madrid",
    price: 1799,
    oldPrice: 2199,
    mainImage: "/images/default-product.webp",
    stock: 18,

    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    galleryImages: JSON.stringify(["/images/default-product.webp"]),
  },
  {
    name: "Brazil Away Jersey",
    slug: "brazil-away-jersey",
    category: "National Teams",
    subcategory: "Away Jersey",
    team: "Brazil",
    price: 1399,
    oldPrice: 1699,
    mainImage: "/images/default-product.webp",
    stock: 30,

    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    galleryImages: JSON.stringify(["/images/default-product.webp"]),
  },
];