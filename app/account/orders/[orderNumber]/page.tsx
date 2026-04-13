import OrderDetailsClient from "./order-details-client";

type PageProps = {
  params: Promise<{ orderNumber: string }>;
};

export default async function OrderDetailsPage({ params }: PageProps) {
  const { orderNumber } = await params;
  return <OrderDetailsClient orderNumber={orderNumber} />;
}