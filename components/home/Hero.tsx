"use client";

import Link from "next/link";

const marqueeItems = [
  "Limited Offer",
  "Up to 20% Off",
  "Selected premium jersey pieces this week",
  "Limited Offer",
  "Up to 20% Off",
  "Selected premium jersey pieces this week",
];

export default function Hero() {
  return (
    <section className="hidden xl:block container xl:pt-6 xl:pb-10 xl:md:pt-10 xl:md:pb-14 pb-10">
      <div className="group relative overflow-hidden border border-[rgba(201,149,0,0.14)] bg-white/70 shadow-[0_24px_80px_rgba(201,149,0,0.08)] backdrop-blur-xl transition duration-500 hover:border-[rgba(201,149,0,0.24)] rounded-[30px] rounded-t-none xl:rounded-t-[30px] xl:border-t">

        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,149,0,0.12),transparent_28%)] hidden xl:block" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,149,0,0.05),transparent_22%)] hidden xl:block" />

        <div className="relative grid items-center gap-8 px-5 sm:px-6 md:px-10 xl:px-14 xl:py-14 xl:grid-cols-[1.02fr_0.98fr]">

          {/* LEFT */}
          <div>
            <div className="inline-flex items-center rounded-full border border-[rgba(201,149,0,0.22)] bg-[#fff6df] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#a87400]">
              Elite Jersey Land
            </div>

            <h1 className="mt-6 max-w-3xl text-[26px] leading-[1.25] font-bold text-[#2b2112] sm:text-5xl xl:text-6xl">
              Premium jerseys with a cleaner, more modern identity.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#7a6641] md:text-base">
              Discover football jerseys in a refined white and deep yellow experience
              built around strong visuals, elegant spacing, and premium product focus.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/catalog" className="btn-primary">
                Shop Collection
              </Link>
              <Link href="/track-order" className="btn-secondary">
                Track Order
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[rgba(201,149,0,0.12)] bg-white/85 p-4">
                <p className="text-2xl font-bold text-[#c99500]">500+</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#7a6641]">Jersey Styles</p>
              </div>

              <div className="rounded-2xl border border-[rgba(201,149,0,0.12)] bg-white/85 p-4">
                <p className="text-2xl font-bold text-[#c99500]">Premium</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#7a6641]">Clean Finish</p>
              </div>

              <div className="rounded-2xl border border-[rgba(201,149,0,0.12)] bg-white/85 p-4">
                <p className="text-2xl font-bold text-[#c99500]">24/7</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#7a6641]">Support</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative mx-auto max-w-[620px]">
            <div className="grid grid-cols-2 gap-5">
              <div className="hero-tilt-card rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white/85 p-4">
                <img src="/images/Banner1.webp" className="rounded-[22px]" />
                <h3 className="mt-4 font-semibold">Elite Match Jersey</h3>
                <p className="text-[#c99500] font-bold">₹999</p>
              </div>

              <div className="hero-tilt-card rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white/85 p-4">
                <img src="/images/Banner2.webp" className="rounded-[22px]" />
                <h3 className="mt-4 font-semibold">Club Edition Jersey</h3>
                <p className="text-[#c99500] font-bold">₹1099</p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-full bg-[#fff6df] py-3">
              <div className="hero-offer-track flex min-w-[200%] animate-[heroOfferMoveLTR_16s_linear_infinite]">
                {[...marqueeItems, ...marqueeItems].map((item, i) => (
                  <span key={i} className="mx-6 text-xs uppercase text-[#a87400]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}