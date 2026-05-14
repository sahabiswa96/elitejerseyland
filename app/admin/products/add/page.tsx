"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { addProduct } from "../actions";

const sizeOptions = ["S", "M", "L", "XL", "2XL", "3XL"];

export default function AddProductPage() {
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["M", "L"]);
  const [slug, setSlug] = useState("");
  const [isPending, startTransition] = useTransition();

  // Image file names
  const [mainImageName, setMainImageName] = useState("");
  const [gallery1Name, setGallery1Name] = useState("");
  const [gallery2Name, setGallery2Name] = useState("");
  const [gallery3Name, setGallery3Name] = useState("");
  const [gallery4Name, setGallery4Name] = useState("");

  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const generatedSlug = createSlug(e.target.value);
    setSlug(generatedSlug);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  async function handleSubmit(formData: FormData) {
    formData.set("sizes", JSON.stringify(selectedSizes));

    startTransition(async () => {
      try {
        await addProduct(formData);
      } catch (error) {
        console.error(error);
      }
    });
  }

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
            Add a new product with main image, optional gallery images,
            pricing, sizes, and catalog details.
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
        <form action={handleSubmit} className="space-y-6">

          {/* PRODUCT NAME + SLUG */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                required
                placeholder="Enter product name"
                className="input-premium h-12"
                onChange={handleNameChange}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Slug
              </label>

              <input
                type="text"
                name="slug"
                value={slug}
                readOnly
                required
                placeholder="product-slug"
                className="input-premium h-12"
              />
            </div>
          </div>

          {/* BRAND */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Brand
              </label>

              <input
                type="text"
                name="brand"
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
                name="team"
                placeholder="Argentina / Brazil / Barcelona"
                className="input-premium h-12"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Quality
              </label>

              <input
                type="text"
                name="quality"
                defaultValue="Premium Quality"
                className="input-premium h-12"
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Category
              </label>

              <select name="category" className="input-premium h-12">
                <option value="National Teams">National Teams</option>
                <option value="Clubs">Clubs</option>
                <option value="Special Edition">Special Edition</option>
                <option value="Kids">Kids</option>
                <option value="Full Sleeve">Full Sleeve</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Subcategory
              </label>

              <select name="subcategory" className="input-premium h-12">
                <option value="Half Sleeve">Half Sleeve</option>
                <option value="Full Sleeve">Full Sleeve</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Price
              </label>

              <input
                type="number"
                name="price"
                required
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
                name="oldPrice"
                placeholder="1299"
                className="input-premium h-12"
              />
            </div>
          </div>

          {/* SIZES */}
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

          {/* STOCK + SHORT DESCRIPTION */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Stock Status
              </label>

              <div className="flex h-12 items-center text-sm text-gray-500">
                In Stock
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Short Description
              </label>

              <input
                type="text"
                name="shortDescription"
                placeholder="Short product highlight"
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
                Main Image + Gallery Images
              </h3>

              <p className="mt-2 text-sm leading-7 text-[#7a6641]">
                Main image is required. Gallery images are optional.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {/* MAIN IMAGE */}
              <div className="rounded-[20px] border border-[rgba(201,149,0,0.14)] bg-white p-4">
                <label className="mb-2 block text-sm font-semibold text-[#2b2112]">
                  Main Image *
                </label>

                <input
                  type="file"
                  name="mainImage"
                  required
                  accept="image/*"
                  className="input-premium h-12 py-2.5"
                  onChange={(e) =>
                    setMainImageName(e.target.files?.[0]?.name || "")
                  }
                />

                <p className="mt-2 text-xs text-[#7a6641]">
                  {mainImageName || "Required image"}
                </p>
              </div>

              {/* GALLERY IMAGES */}
              {[
                {
                  name: "gallery1",
                  label: "Gallery Image 1",
                  state: gallery1Name,
                  setter: setGallery1Name,
                },
                {
                  name: "gallery2",
                  label: "Gallery Image 2",
                  state: gallery2Name,
                  setter: setGallery2Name,
                },
                {
                  name: "gallery3",
                  label: "Gallery Image 3",
                  state: gallery3Name,
                  setter: setGallery3Name,
                },
                {
                  name: "gallery4",
                  label: "Gallery Image 4",
                  state: gallery4Name,
                  setter: setGallery4Name,
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="rounded-[20px] border border-[rgba(201,149,0,0.14)] bg-white p-4"
                >
                  <label className="mb-2 block text-sm font-semibold text-[#2b2112]">
                    {item.label}
                  </label>

                  <input
                    type="file"
                    name={item.name}
                    accept="image/*"
                    className="input-premium h-12 py-2.5"
                    onChange={(e) =>
                      item.setter(e.target.files?.[0]?.name || "")
                    }
                  />

                  <p className="mt-2 text-xs text-[#7a6641]">
                    {item.state || "Optional"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FULL DESCRIPTION */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#2b2112]">
              Full Description
            </label>

            <textarea
              name="fullDescription"
              placeholder="Write full product description"
              className="input-premium min-h-[120px] resize-none py-3"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Save Product"}
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