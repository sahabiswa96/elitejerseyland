import type { Metadata } from "next";
import CatalogClient from "@/components/catalog/CatalogClient";

export const metadata: Metadata = {
  title: "Catalog | Elite Jersey Land",
  description:
    "Browse premium football jerseys, national team kits, club jerseys, kids collections, and special edition drops at Elite Jersey Land.",
};

export default function CatalogPage() {
  return (
    <main className="mx-auto w-full max-w-[1650px] px-6 py-12 md:px-8 md:py-16 2xl:px-10">
      <CatalogClient />
    </main>
  );
}