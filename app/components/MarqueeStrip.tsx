const marqueeItems = [
  "PREMIUM FOOTBALL JERSEYS",
  "ELITE JERSEY LAND",
  "BEST QUALITY COLLECTION",
  "MODERN SPORTSWEAR STYLE",
  "SHOP PREMIUM COLLECTION",
  "FAST SUPPORT",
];

export default function MarqueeStrip() {
  const items = [...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <section className="w-full overflow-hidden border-y border-[rgba(201,149,0,0.14)] bg-[#fff6df] py-2.5 md:py-3">
      <div className="marquee">
        <div className="marquee-track">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="mx-5 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.22em] text-[#a87400] sm:mx-6 sm:text-xs md:mx-8 md:text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}