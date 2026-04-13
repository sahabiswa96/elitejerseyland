// elite-jersey-land/components/home/HomeMobileBanner.tsx

import Link from "next/link";

export default function HomeMobileHero() {
  return (
    <section className="xl:hidden">
      <div className="overflow-hidden border border-b-0 rounded-b-none">
        <img src="/images/bannerimg.jpg" className="w-full object-cover" />
      </div>
    </section>
  );
}