import type { Metadata } from "next";
import CatalogClient from "@/components/catalog/CatalogClient";

type Props = {
  params: Promise<{ subcategory: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const decoded = decodeURIComponent(subcategory);

  return {
    title: `${decoded} Jerseys | Elite Jersey Land`,
    description: `Browse ${decoded} premium jerseys and football kits at Elite Jersey Land.`,
  };
}

export default async function SubCategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const decoded = decodeURIComponent(subcategory);

  return (
    <main className="mx-auto w-full max-w-[1650px] px-6 py-12 md:px-8 md:py-16 2xl:px-10">
      <CatalogClient
        lockedSubcategory={decoded}
        heading={`${decoded} premium jerseys with a cleaner, modern identity.`}
        subheading={`Explore the ${decoded} collection with smart search, product filters, sorting and load more browsing.`}
      />
    </main>
  );
}