import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(201,149,0,0.12)] bg-[#fff9ec]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 md:py-10 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(201,149,0,0.22)] bg-white text-[#c99500]">
                <span className="text-xl font-bold">E</span>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#a87400]">
                  Premium Brand
                </p>
                <h2 className="text-lg font-bold uppercase tracking-[0.16em] text-[#2b2112]">
                  Elite Jersey Land
                </h2>
              </div>
            </div>

            <p className="mt-4 max-w-xl text-sm leading-6 text-[#7a6641]">
              Premium football jersey shopping with a sober, elegant, modern
              sportswear feel and strong product focus.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#a87400]">
                Contact Number
              </p>
              <p className="mt-2 text-sm text-[#2b2112]">+91 8981537417</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#a87400]">
                Email Address
              </p>
              <p className="mt-2 break-all text-sm text-[#2b2112]">
                sahabiswa180@gmail.com
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#a87400]">
                Quick Links
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                <Link href="/" className="text-sm text-[#2b2112] transition hover:text-[#a87400]">
                  Home
                </Link>
                <Link href="/catalog" className="text-sm text-[#2b2112] transition hover:text-[#a87400]">
                  Catalog
                </Link>
                <Link href="/contact" className="text-sm text-[#2b2112] transition hover:text-[#a87400]">
                  Contact
                </Link>
                <Link href="/track-order" className="text-sm text-[#2b2112] transition hover:text-[#a87400]">
                  Track Order
                </Link>
                <Link href="/login" className="text-sm text-[#2b2112] transition hover:text-[#a87400]">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-[rgba(201,149,0,0.12)] pt-4 text-center text-xs text-[#9b8b6f]">
          © 2026 Elite Jersey Land. All rights reserved.
        </div>
      </div>
    </footer>
  );
}