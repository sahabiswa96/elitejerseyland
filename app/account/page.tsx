import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="container py-10 md:py-14">
      <div className="space-y-8">
        <div className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white p-6 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
            My Account
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#2b2112]">
            Account Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7a6641]">
            Manage your profile, review your orders, and track your purchases.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/account/profile"
            className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)] transition hover:-translate-y-1"
          >
            <h2 className="text-xl font-bold text-[#2b2112]">My Profile</h2>
            <p className="mt-2 text-sm leading-7 text-[#7a6641]">
              Update your personal details and contact information.
            </p>
          </Link>

          <Link
            href="/account/orders"
            className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)] transition hover:-translate-y-1"
          >
            <h2 className="text-xl font-bold text-[#2b2112]">My Orders</h2>
            <p className="mt-2 text-sm leading-7 text-[#7a6641]">
              View all your orders and track delivery progress.
            </p>
          </Link>

          <Link
            href="/track-order"
            className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)] transition hover:-translate-y-1"
          >
            <h2 className="text-xl font-bold text-[#2b2112]">Track Order</h2>
            <p className="mt-2 text-sm leading-7 text-[#7a6641]">
              Check the latest order delivery status quickly.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}