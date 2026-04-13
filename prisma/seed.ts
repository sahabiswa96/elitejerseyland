import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@elitejerseyland.com" },
    update: {},
    create: {
      firstName: "Elite",
      lastName: "Admin",
      email: "admin@elitejerseyland.com",
      phone: "9999999999",
      address: "Admin Address",
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("Admin ready:", admin.email);

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
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log("Sample products seeded");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed error:", error);
    await prisma.$disconnect();
    process.exit(1);
  });