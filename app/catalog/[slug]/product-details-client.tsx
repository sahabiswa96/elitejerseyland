"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { addToCart } from "@/lib/cart";
import {
  Check,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  RefreshCcw,
} from "lucide-react";

type ProductData = {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  category: string;
  subcategory?: string | null;
  team?: string | null;
  mainImage: string;
  galleryImages: string | null;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

type ProductResponse = {
  product: ProductData;
  relatedProducts: ProductData[];
};

type Props = {
  data: ProductResponse;
};

export default function ProductDetailsClient({ data }: Props) {
  const router = useRouter();
  const { product, relatedProducts } = data;

  // State for authentication check
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null); // <-- NEW: Track user role
  const [checkingAuth, setCheckingAuth] = useState(true);

  const images = useMemo(() => {
    let gallery: string[] = [];
    try {
      if (product.galleryImages) {
        gallery = JSON.parse(product.galleryImages);
      }
    } catch (e) {
      console.error("Failed to parse gallery images", e);
    }
    return [product.mainImage || "/images/default-product.webp", ...gallery].filter(Boolean);
  }, [product.mainImage, product.galleryImages]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);

  // Check if user is logged in and their role
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          setUserRole(data.user?.role || null); // <-- NEW: Save role (ADMIN / CUSTOMER)
          setIsLoggedIn(data.user && data.user.role === "CUSTOMER");
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setIsLoggedIn(false);
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setZoomed(false);
    setZoomPosition({ x: 50, y: 50 });
  }, [product.slug]);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  // Check authentication before adding to cart
  async function checkAuthAndProceed(action: () => Promise<void>) {
    if (checkingAuth) {
      return;
    }

    // <-- NEW FIX: If user is Admin, show alert and don't redirect to login
    if (userRole === "ADMIN") {
      alert("Admins cannot add items to cart. Please use a customer account to purchase.");
      return;
    }

    if (!isLoggedIn) {
      // Save current page URL to redirect back after login
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      router.push("/login");
      return;
    }

    await action();
  }

  async function handleAddToCart() {
    await checkAuthAndProceed(async () => {
      try {
        setAdding(true);
        for (let i = 0; i < quantity; i++) {
          await addToCart(product.id);
        }
        window.dispatchEvent(new Event("cart-updated"));
        alert("Product added to cart");
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to add to cart");
      } finally {
        setAdding(false);
      }
    });
  }

  async function handleBuyNow() {
    await checkAuthAndProceed(async () => {
      try {
        setBuying(true);
        for (let i = 0; i < quantity; i++) {
          await addToCart(product.id);
        }
        router.push("/checkout");
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed");
      } finally {
        setBuying(false);
      }
    });
  }

  const discountPercentage =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#f8f4ec_100%)]">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 md:py-8 lg:px-8 lg:py-10">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#c99500] border-t-transparent mx-auto"></div>
              <p className="text-sm text-[#7a6641]">Loading product details...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Calculate if buttons should be disabled
  const isDisabled = adding || buying || product.stock <= 0 || userRole === "ADMIN";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#f8f4ec_100%)]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 md:py-8 lg:px-8 lg:py-10">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium text-[#8c7a5a] sm:text-sm">
          <Link href="/" className="transition hover:text-[#a87400]">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/catalog" className="transition hover:text-[#a87400]">
            Catalog
          </Link>
          <ChevronRight size={14} />
          <span className="text-[#2b2112]">{product.name}</span>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.03fr_0.97fr] xl:gap-10">
          {/* Left Side: Images */}
          <div className="grid gap-4 lg:grid-cols-[96px_1fr] xl:grid-cols-[110px_1fr]">
            {/* Thumbnails */}
            <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {images.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 overflow-hidden rounded-2xl border bg-white transition duration-200 ${
                    selectedImage === index
                      ? "border-[#c99500] shadow-[0_10px_26px_rgba(201,149,0,0.16)]"
                      : "border-[#eee4d2] hover:border-[#dcc28a]"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="h-20 w-20 object-cover sm:h-24 sm:w-24 lg:h-[92px] lg:w-[92px] xl:h-[106px] xl:w-[106px]"
                  />
                </button>
              ))}
            </div>

            {/* Main Image Display */}
            <div className="order-1 overflow-hidden rounded-[28px] border border-[#eadfca] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] lg:order-2">
              <div className="relative">
                <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
                  {discountPercentage > 0 ? (
                    <span className="rounded-full bg-[#2b2112] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
                      {discountPercentage}% Off
                    </span>
                  ) : null}

                  <span
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${
                      product.stock > 0
                        ? "bg-[#e9f8ef] text-[#117a39]"
                        : "bg-[#fff0f0] text-[#c63737]"
                    }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <div
                  className="mx-auto w-full max-w-[560px] cursor-zoom-in overflow-hidden bg-[radial-gradient(circle_at_top,#fff6df,transparent_45%)]"
                  onMouseEnter={() => setZoomed(true)}
                  onMouseLeave={() => {
                    setZoomed(false);
                    setZoomPosition({ x: 50, y: 50 });
                  }}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="aspect-[4/4.8] w-full object-cover transition-transform duration-200 ease-out"
                    style={{
                      transform: zoomed ? "scale(1.75)" : "scale(1)",
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="rounded-[28px] border border-[#eadfca] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:p-6 lg:p-7 xl:p-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
              Elite Jersey Land
            </p>

            <h1 className="mt-3 text-2xl font-bold leading-tight text-[#2b2112] sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#fff6df] px-4 py-2 text-xs font-semibold text-[#a87400]">
                Category: {product.category}
              </span>

              {product.team ? (
                <span className="rounded-full bg-[#f8f6f1] px-4 py-2 text-xs font-semibold text-[#7a6641]">
                  Team: {product.team}
                </span>
              ) : null}

              {product.subcategory ? (
                <span className="rounded-full bg-[#f8f6f1] px-4 py-2 text-xs font-semibold text-[#7a6641]">
                  {product.subcategory}
                </span>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <span className="text-3xl font-bold text-[#2b2112] sm:text-4xl">
                ₹{product.price.toFixed(2)}
              </span>

              {product.oldPrice ? (
                <span className="pb-1 text-lg text-[#a08f72] line-through">
                  ₹{product.oldPrice.toFixed(2)}
                </span>
              ) : null}
            </div>

            <div className="mt-6 rounded-2xl border border-[#f0e4ce] bg-[#fffaf1] p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-[0_8px_20px_rgba(0,0,0,0.03)]">
                  <Truck size={18} className="mt-0.5 text-[#a87400]" />
                  <div>
                    <p className="text-sm font-semibold text-[#2b2112]">
                      Fast Delivery
                    </p>
                    <p className="mt-1 text-xs text-[#7a6641]">
                      Quick shipping across locations
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-[0_8px_20px_rgba(0,0,0,0.03)]">
                  <ShieldCheck size={18} className="mt-0.5 text-[#a87400]" />
                  <div>
                    <p className="text-sm font-semibold text-[#2b2112]">
                      Premium Quality
                    </p>
                    <p className="mt-1 text-xs text-[#7a6641]">
                      Trusted material and finish
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-[0_8px_20px_rgba(0,0,0,0.03)]">
                  <RefreshCcw size={18} className="mt-0.5 text-[#a87400]" />
                  <div>
                    <p className="text-sm font-semibold text-[#2b2112]">
                      Easy Support
                    </p>
                    <p className="mt-1 text-xs text-[#7a6641]">
                      Smooth help and order assistance
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 border-t border-[#efe4d1] pt-6">
              <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-[#7a6641]">
                Quantity
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="inline-flex items-center justify-between rounded-2xl border border-[#eadfca] bg-[#fbf9f5] p-1 sm:min-w-[160px]">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-[#2b2112] transition hover:bg-[#fff0c7]"
                  >
                    <Minus size={17} />
                  </button>

                  <span className="flex h-11 min-w-[48px] items-center justify-center text-base font-semibold text-[#2b2112]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-[#2b2112] transition hover:bg-[#fff0c7]"
                  >
                    <Plus size={17} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isDisabled}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#2b2112] px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ShoppingBag size={17} />
                  {adding ? "Adding..." : "Add To Cart"}
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isDisabled}
                className="mt-3 w-full rounded-2xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_12px_26px_rgba(201,149,0,0.18)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {buying ? "Processing..." : "Buy It Now"}
              </button>

              {/* Updated Login/Admin Messages */}
              {!isLoggedIn && userRole !== "ADMIN" && (
                <p className="mt-3 text-center text-xs text-[#a87400]">
                  Please <Link href="/login" className="font-semibold underline hover:no-underline">login</Link> to add items to cart
                </p>
              )}
              
              {userRole === "ADMIN" && (
                <p className="mt-3 text-center text-xs font-medium text-red-500">
                  You are logged in as Admin. Customers can only purchase items.
                </p>
              )}
            </div>

            <div className="mt-7 border-t border-[#efe4d1] pt-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#2b2112]">
                Why You'll Love It
              </h2>

              <div className="mt-4 grid gap-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#fff6df] text-[#a87400]">
                    <Check size={13} />
                  </span>
                  <p className="text-sm leading-6 text-[#6f6250]">
                    Stylish and premium jersey look with a clean modern finish.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#fff6df] text-[#a87400]">
                    <Check size={13} />
                  </span>
                  <p className="text-sm leading-6 text-[#6f6250]">
                    Great for casual wear, collections, gifting, and fan styling.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#fff6df] text-[#a87400]">
                    <Check size={13} />
                  </span>
                  <p className="text-sm leading-6 text-[#6f6250]">
                    Carefully presented for a rich desktop and mobile shopping feel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-[30px] border border-[#eadfca] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:p-6 md:mt-16 md:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
                Recommended
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#2b2112] sm:text-3xl">
                You May Also Like
              </h2>
            </div>

            <Link
              href="/catalog"
              className="inline-flex w-fit items-center justify-center rounded-full border border-[#eadfca] bg-[#f8f6f1] px-5 py-2.5 text-sm font-semibold text-[#2b2112] transition hover:border-[#c99500] hover:text-[#a87400]"
            >
              View All
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/catalog/${item.slug}`}
                className="group overflow-hidden rounded-[24px] border border-[#eadfca] bg-[#fffdfa] shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-[#c99500] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
              >
                <div className="overflow-hidden bg-[#f5efe3]">
                  <img
                    src={item.mainImage || "/images/default-product.webp"}
                    alt={item.name}
                    className="aspect-[4/4.6] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="p-4 sm:p-5">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#9b8b6f]">
                    Elite Jersey Land
                  </p>
                  <h3 className="mt-2 line-clamp-2 min-h-[44px] text-sm font-semibold leading-6 text-[#2b2112]">
                    {item.name}
                  </h3>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-base font-bold text-[#c99500]">
                      ₹{item.price.toFixed(2)}
                    </p>

                    <span className="rounded-full bg-[#fff6df] px-3 py-1.5 text-[11px] font-semibold text-[#a87400]">
                      View
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}