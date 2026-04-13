// elite-jersey-land/components/home/BrandStrip.tsx

const items = [
  "Premium Quality",
  "Luxury Sportswear",
  "Modern Fit",
  "Club Collection",
  "National Team",
  "Elite Finish",
];

export default function BrandStrip() {
  return (
    <section className="container pb-4 md:pb-8 hidden xl:block">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.28em] text-neutral-500 md:text-xs">
          {items.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}