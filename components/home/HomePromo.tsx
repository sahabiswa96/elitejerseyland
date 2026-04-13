// elite-jersey-land/components/home/HomePromo.tsx

import Link from "next/link";

export default function HomePromo() {
  return (
    <section className="container pb-12 md:pb-16">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,#101010,#161616,#101010)] px-5 py-7 md:px-8 md:py-8">
        <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(201,162,39,0.18),transparent_65%)]" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#c9a227]">
              Limited Time
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              Premium deals on selected jerseys.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-400">
              A modern and elegant promo section to highlight offers without making
              the page look crowded.
            </p>
          </div>

          <Link href="/catalog" className="btn-primary">
            Shop Offers
          </Link>
        </div>
      </div>
    </section>
  );
}