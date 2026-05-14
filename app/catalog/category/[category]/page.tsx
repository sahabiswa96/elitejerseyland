import type { Metadata } from "next";
import CatalogClient from "@/components/catalog/CatalogClient";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);

  return {
    title: `${decoded} Jerseys | Elite Jersey Land`,
    description: `Explore premium ${decoded} jerseys and curated football collections at Elite Jersey Land.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);

  return (
    <main className="mx-auto w-full max-w-[1650px] px-6 py-12 md:px-8 md:py-16 2xl:px-10">
      <CatalogClient
        lockedCategory={decoded}
        heading={`${decoded} jerseys curated for premium football culture.`}
        subheading={`Browse the latest ${decoded} collection with search, filters, sorting and a polished modern catalog experience.`}
      />
    </main>
  );
}