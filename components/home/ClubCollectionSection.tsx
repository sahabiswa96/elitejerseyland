// elite-jersey-land/components/home/ClubCollectionSection.tsx

import Link from "next/link";

export default function ClubCollectionSection() {
  return (
    <section className="container py-8 md:py-12">
      <div className="relative overflow-hidden rounded-[30px] border border-[rgba(201,149,0,0.14)] bg-white/80 px-6 py-8 shadow-[0_20px_60px_rgba(201,149,0,0.08)] backdrop-blur-xl md:px-10 md:py-10">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(201,149,0,0.12),transparent_65%)]" />
        <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(201,149,0,0.06),transparent_65%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
              Club Collection
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#2b2112] md:text-4xl">
              Modern premium club jerseys with a stronger visual identity.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7a6641] md:text-base">
              Explore a more polished full-width section designed to feel richer,
              cleaner, and more premium while keeping the focus on football culture
              and product discovery.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/catalog" className="btn-primary">
                Explore Catalog
              </Link>
              <Link href="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-[#fffdf7] p-5">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#9b8b6f]">
                Premium Clubs
              </p>
              <h3 className="mt-3 text-lg font-semibold text-[#2b2112]">
                Iconic club jersey drops
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#7a6641]">
                Rich visual presentation with premium white styling and stronger product tone.
              </p>
            </div>

            <div className="rounded-[24px] border border-[rgba(201,149,0,0.18)] bg-[#fff6df] p-5">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#a87400]">
                Limited Offers
              </p>
              <h3 className="mt-3 text-lg font-semibold text-[#2b2112]">
                Selected club deals
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#7a6641]">
                Premium promotional styling without making the page look crowded.
              </p>
            </div>

            <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-[#fffdf7] p-5 sm:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#9b8b6f]">
                Curated Experience
              </p>
              <h3 className="mt-3 text-lg font-semibold text-[#2b2112]">
                A cleaner and more elegant club section
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#7a6641]">
                Designed for desktop and mobile with improved spacing, stronger balance,
                and a more premium full-width layout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}