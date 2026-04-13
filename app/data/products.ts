export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  stock: "In Stock" | "Out of Stock";
  category: string;
};

export const products: Product[] = [
  {
    id: 1,
    slug: "ronaldo-brazil-special-edition",
    name: "Ronaldo Brazil Special Edition Embroidery",
    price: 350,
    image: "/images/default-product.webp",
    stock: "In Stock",
    category: "Special Editions",
  },
  {
    id: 2,
    slug: "messi-argentina-home",
    name: "Messi Argentina Home Kit Embroidery",
    price: 360,
    image: "/images/default-product.webp",
    stock: "In Stock",
    category: "National Teams",
  },
  {
    id: 3,
    slug: "beckham-united-retro",
    name: "Beckham United 1999 / 00 Retro Embroidery",
    price: 380,
    image: "/images/default-product.webp",
    stock: "In Stock",
    category: "Retro Jerseys",
  },
  {
    id: 4,
    slug: "yellow-club-special",
    name: "Special Yellow Club Edition",
    price: 380,
    image: "/images/default-product.webp",
    stock: "In Stock",
    category: "Club Jerseys",
  },
  {
    id: 5,
    slug: "blue-training-kit",
    name: "Blue Training Kit",
    price: 420,
    image: "/images/default-product.webp",
    stock: "In Stock",
    category: "Training Kits",
  },
  {
    id: 6,
    slug: "fan-version-barca-home",
    name: "Barca Fan Version Home Kit",
    price: 399,
    image: "/images/default-product.webp",
    stock: "Out of Stock",
    category: "Fan Version",
  },
];