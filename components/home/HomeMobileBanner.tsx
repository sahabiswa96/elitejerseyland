"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

type Banner = {
  id: string;
  imageUrl: string;
};

export default function HomeMobileBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [index, setIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await fetch("/api/banners");
        if (!res.ok) return;

        const data = await res.json();
        setBanners(data.banners || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadBanners();
  }, []);

  const extendedBanners =
    banners.length > 1
      ? [banners[banners.length - 1], ...banners, banners[0]]
      : banners;

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const handleTransitionEnd = useCallback(() => {
    if (banners.length <= 1) return;

    if (index === banners.length + 1) {
      setIsAnimating(false);
      setIndex(1);
    } else if (index === 0) {
      setIsAnimating(false);
      setIndex(banners.length);
    }
  }, [index, banners.length]);

  if (!banners.length) return null;

  return (
    <section className="xl:hidden">
      <div className="relative overflow-hidden border border-b-0 aspect-[40/73]">
        {/* slider wrapper */}
        <div
          className={`flex h-full ${
            isAnimating ? "transition-transform duration-500 ease-in-out" : ""
          }`}
          style={{
            // সরাসরি viewport width (vw) দিয়ে ক্যালকুলেট করা হচ্ছে, এতে আর কোনো এরর নেই
            transform: `translateX(-${index * 100}vw)`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedBanners.map((banner, i) => (
            <div
              key={`${banner.id}-clone-${i}`}
              // প্রতিটা স্লাইডকে জোর করে ঠিক মোবাইল স্ক্রিনের সমান করে দেওয়া হচ্ছে
              className="relative h-full min-w-[100vw] flex-shrink-0"
            >
              <Image
                src={banner.imageUrl}
                alt={`Banner ${i + 1}`}
                fill
                priority={i === 1}
                sizes="100vw"
                // object-cover দেওয়ায় কোনো কালো স্পেস থাকবে না, পুরো জায়গা ছবি দিয়ে ভরে যাবে
                className="object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}