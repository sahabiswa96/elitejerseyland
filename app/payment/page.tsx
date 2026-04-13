// elite-jersey-land/app/payment/page.tsx

"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { QRCodeSVG } from "qrcode.react";
import { generateUpiLink, UPI_CONFIG } from "@/lib/upi";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderNumber = searchParams.get("orderNumber") || "";
  const amount = parseFloat(searchParams.get("amount") || "0");
  const [confirming, setConfirming] = useState(false);

  const upiLink = generateUpiLink({
    amount,
    note: `Order ${orderNumber}`,
    txnId: orderNumber,
  });

  async function handleConfirmPayment() {
    if (!orderNumber) return;

    setConfirming(true);

    try {
      const res = await fetch(`/api/orders/${orderNumber}/confirm-payment`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to confirm");
      }

      router.push(`/track-order?orderNumber=${orderNumber}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setConfirming(false);
    }
  }

  if (!orderNumber || amount <= 0) {
    return (
      <main className="min-h-screen pt-28 pb-16">
        <div className="container max-w-2xl mx-auto text-center">
          <div className="rounded-[28px] border border-[rgba(201,149,0,0.18)] bg-white p-10">
            <p className="text-[#7a6641]">Invalid payment details. Please try again from cart.</p>
            <a href="/cart" className="btn-primary mt-6 inline-flex">
              Go to Cart
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-16">
      <div className="container max-w-2xl mx-auto">
        <div className="rounded-[28px] border border-[rgba(201,149,0,0.18)] bg-white p-6 md:p-10 shadow-[0_20px_60px_rgba(201,149,0,0.08)]">

          {/* HEADER */}
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
              Complete Payment
            </p>
            <h1 className="mt-3 text-2xl font-bold text-[#2b2112] md:text-3xl">
              Pay ₹{amount.toLocaleString("en-IN")}
            </h1>
            <p className="mt-2 text-sm text-[#7a6641]">
              Order: <span className="font-semibold text-[#2b2112]">{orderNumber}</span>
            </p>
          </div>

          {/* QR CODE */}
          <div className="mt-8 flex justify-center">
            <div className="rounded-[22px] border border-[rgba(201,149,0,0.14)] bg-[#fffdf7] p-6">
              <QRCodeSVG
                value={upiLink}
                size={200}
                bgColor="transparent"
                fgColor="#2b2112"
                level="H"
              />
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-[#7a6641]">
            যেকোনো UPI অ্যাপ দিয়ে QR স্ক্যান করো
          </p>

          {/* UPI ID */}
          <div className="mt-5 flex items-center justify-center gap-3 rounded-xl border border-[rgba(201,149,0,0.14)] bg-[#fff6df] px-4 py-3">
            <span className="text-sm text-[#7a6641]">UPI ID:</span>
            <span className="font-semibold text-[#2b2112]">{UPI_CONFIG.vpa}</span>
          </div>

          {/* UPI APP BUTTONS */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a
              href={upiLink}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#5F259F] px-4 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              PhonePe
            </a>

            <a
              href={upiLink}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#4285F4] px-4 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Google Pay
            </a>

            <a
              href={upiLink}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#00BAF2] px-4 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Paytm
            </a>

            <a
              href={upiLink}
              className="flex items-center justify-center gap-2 rounded-xl border border-[rgba(201,149,0,0.18)] bg-[#fffdf7] px-4 py-3.5 text-sm font-semibold text-[#2b2112] transition hover:border-[rgba(201,149,0,0.32)]"
            >
              Any UPI
            </a>
          </div>

          {/* STEPS */}
          <div className="mt-8 rounded-2xl border border-[rgba(201,149,0,0.1)] bg-[#fffdf7] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a87400] mb-3">
              Steps
            </p>
            <ol className="space-y-2.5 text-sm text-[#7a6641]">
              <li className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c99500] text-[10px] font-bold text-white">1</span>
                উপরের যেকোনো বাটনে ক্লিক করো বা QR স্ক্যান করো
              </li>
              <li className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c99500] text-[10px] font-bold text-white">2</span>
                UPI অ্যাপে ₹{amount.toLocaleString("en-IN")} pay করো
              </li>
              <li className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c99500] text-[10px] font-bold text-white">3</span>
                পেমেন্ট হয়ে গেলে নিচের বাটনে ক্লিক করো
              </li>
            </ol>
          </div>

          {/* CONFIRM BUTTON */}
          <button
            onClick={handleConfirmPayment}
            disabled={confirming}
            className="mt-6 w-full rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-6 py-4 text-base font-semibold text-white shadow-[0_10px_30px_rgba(201,149,0,0.25)] transition hover:opacity-90 disabled:opacity-60"
          >
            {confirming ? "Confirming..." : "✓ I Have Completed Payment"}
          </button>

          <p className="mt-4 text-center text-[11px] text-[#9b8b6f]">
            পেমেন্ট ভেরিফিকেশনে ১-২ ঘণ্টা লাগতে পারে।
          </p>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 text-center text-sm text-[#7a6641]">
          Loading...
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}