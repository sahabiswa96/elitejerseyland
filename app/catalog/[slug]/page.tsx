import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./product-details-client";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/products/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getProduct(slug);

  if (!data?.product) {
    notFound();
  }

  return <ProductDetailsClient data={data} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const data = await getProduct(slug);

  if (!data?.product) {
    return {
      title: "Product Not Found | Elite Jersey Land",
    };
  }

  return {
    title: `${data.product.name} | Elite Jersey Land`,
    description: `Buy ${data.product.name} at Elite Jersey Land.`,
  };
}