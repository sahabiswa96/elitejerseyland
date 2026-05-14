const marqueeItems = [
  "BEST QUALITY IN INDIA",
  "PREMIUM FOOTBALL JERSEYS",
  "ELITE JERSEY LAND",
  "FAST SUPPORT",
  "MODERN LUXURY SPORTSWEAR",
  "SHOP PREMIUM COLLECTION",
];

export default function MarqueeStrip() {
  const items = [...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <section className="w-full overflow-hidden border-y border-black/10 bg-[#c9a227] py-2.5 md:py-3">
      <div className="marquee">
        <div className="marquee-track">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="mx-5 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.22em] text-black sm:mx-6 sm:text-xs md:mx-8 md:text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}