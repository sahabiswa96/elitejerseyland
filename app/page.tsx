import Hero from "@/components/home/Hero";
import BrandStrip from "@/components/home/BrandStrip";
import HomeProductShowcase from "@/components/home/HomeProductShowcase";
import ClubCollectionSection from "@/components/home/ClubCollectionSection";
import HomePromo from "@/components/home/HomePromo";
import HomeMobileBanner from "@/components/home/HomeMobileBanner";

export default function HomePage() {
  return (
    <main>

      {/* MOBILE + TABLET TOP BANNER */}
      <HomeMobileBanner />

      <Hero />
      <BrandStrip />
      <HomeProductShowcase />
      <ClubCollectionSection />
      <HomePromo />

    </main>
  );
}