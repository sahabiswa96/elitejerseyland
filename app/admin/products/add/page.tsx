"use client";

import Link from "next/link";
import { useState } from "react";

const sizeOptions = ["S", "M", "L", "XL", "2XL", "3XL"];

export default function AddProductPage() {
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["M", "L"]);
  const [mainImageName, setMainImageName] = useState("");
  const [gallery1Name, setGallery1Name] = useState("");
  const [gallery2Name, setGallery2Name] = useState("");
  const [gallery3Name, setGallery3Name] = useState("");
  const [gallery4Name, setGallery4Name] = useState("");

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
            Products
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[#2b2112]">
            Add Product
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7a6641]">
            Add a new product with main image, optional gallery images, and all
            details required for catalog and product view page.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center rounded-xl border border-[rgba(201,149,0,0.16)] bg-white px-5 py-3 text-sm font-semibold text-[#2b2112] transition hover:border-[rgba(201,149,0,0.3)] hover:text-[#a87400]"
        >
          Back to Products
        </Link>
      </div>

      <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)] md:p-6">
        <form className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Product Name
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                className="input-premium h-12"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Slug
              </label>
              <input
                type="text"
                placeholder="enter-product-slug"
                className="input-premium h-12"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Brand
              </label>
              <input
                type="text"
                defaultValue="Elite Jersey Land"
                className="input-premium h-12"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Team
              </label>
              <input
                type="text"
                placeholder="Argentina / Barcelona / Brazil"
                className="input-premium h-12"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Quality
              </label>
              <input
                type="text"
                defaultValue="Premium Quality"
                className="input-premium h-12"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Category
              </label>
              <select className="input-premium h-12">
                <option>National Teams</option>
                <option>Clubs</option>
                <option>Special Edition</option>
                <option>Kids</option>
                <option>Full Sleeve</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Subcategory
              </label>
              <select className="input-premium h-12">
                <option>Half Sleeve</option>
                <option>Full Sleeve</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Price
              </label>
              <input
                type="number"
                placeholder="999"
                className="input-premium h-12"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Old Price
              </label>
              <input
                type="number"
                placeholder="1299"
                className="input-premium h-12"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-[#2b2112]">
              Available Sizes
            </label>

            <div className="flex flex-wrap gap-3">
              {sizeOptions.map((size) => {
                const active = selectedSizes.includes(size);

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-[#c99500] bg-[#fff6df] text-[#a87400]"
                        : "border-[rgba(201,149,0,0.14)] bg-white text-[#2b2112]"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Stock Status
              </label>
              <select className="input-premium h-12">
                <option>In Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Short Description
              </label>
              <input
                type="text"
                placeholder="Short highlight about this product"
                className="input-premium h-12"
              />
            </div>
          </div>

          {/* IMAGE SECTION */}
          <div className="rounded-[22px] border border-[rgba(201,149,0,0.12)] bg-[#fffdf7] p-4 md:p-5">
            <div className="mb-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#a87400]">
                Product Images
              </p>
              <h3 className="mt-2 text-xl font-bold text-[#2b2112]">
                Main Image + Optional Gallery Images
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#7a6641]">
                Main image is required. Gallery Image 1 to 4 are optional. If
                optional images are not added, frontend will show only the main
                image.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[20px] border border-[rgba(201,149,0,0.14)] bg-white p-4">
                <label className="mb-2 block text-sm font-semibold text-[#2b2112]">
                  Main Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={(e) =>
                    setMainImageName(e.target.files?.[0]?.name || "")
                  }
                  className="input-premium h-12 py-2.5"
                />
                <p className="mt-2 text-xs text-[#7a6641]">
                  {mainImageName || "Required image"}
                </p>
              </div>

              <div className="rounded-[20px] border border-[rgba(201,149,0,0.14)] bg-white p-4">
                <label className="mb-2 block text-sm font-semibold text-[#2b2112]">
                  Gallery Image 1
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setGallery1Name(e.target.files?.[0]?.name || "")
                  }
                  className="input-premium h-12 py-2.5"
                />
                <p className="mt-2 text-xs text-[#7a6641]">
                  {gallery1Name || "Optional"}
                </p>
              </div>

              <div className="rounded-[20px] border border-[rgba(201,149,0,0.14)] bg-white p-4">
                <label className="mb-2 block text-sm font-semibold text-[#2b2112]">
                  Gallery Image 2
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setGallery2Name(e.target.files?.[0]?.name || "")
                  }
                  className="input-premium h-12 py-2.5"
                />
                <p className="mt-2 text-xs text-[#7a6641]">
                  {gallery2Name || "Optional"}
                </p>
              </div>

              <div className="rounded-[20px] border border-[rgba(201,149,0,0.14)] bg-white p-4">
                <label className="mb-2 block text-sm font-semibold text-[#2b2112]">
                  Gallery Image 3
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setGallery3Name(e.target.files?.[0]?.name || "")
                  }
                  className="input-premium h-12 py-2.5"
                />
                <p className="mt-2 text-xs text-[#7a6641]">
                  {gallery3Name || "Optional"}
                </p>
              </div>

              <div className="rounded-[20px] border border-[rgba(201,149,0,0.14)] bg-white p-4">
                <label className="mb-2 block text-sm font-semibold text-[#2b2112]">
                  Gallery Image 4
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setGallery4Name(e.target.files?.[0]?.name || "")
                  }
                  className="input-premium h-12 py-2.5"
                />
                <p className="mt-2 text-xs text-[#7a6641]">
                  {gallery4Name || "Optional"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2b2112]">
              Full Description
            </label>
            <textarea
              placeholder="Write full product description"
              className="input-premium min-h-[120px] resize-none py-3"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Save Product
            </button>

            <Link
              href="/admin/products"
              className="rounded-xl border border-[rgba(201,149,0,0.16)] bg-white px-5 py-3 text-sm font-semibold text-[#2b2112] transition hover:border-[rgba(201,149,0,0.3)] hover:text-[#a87400]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}