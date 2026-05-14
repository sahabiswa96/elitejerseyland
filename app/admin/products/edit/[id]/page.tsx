"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getProduct, updateProduct } from "../../actions";

const sizeOptions = ["S", "M", "L", "XL", "2XL", "3XL"];

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [mainImageName, setMainImageName] = useState("");
  const [galleryNames, setGalleryNames] = useState<string[]>(["", "", "", ""]);

  // Fetch product data on mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getProduct(id);
      if (data) {
        setProduct(data);
        setSelectedSizes(JSON.parse(data.sizes || "[]"));
        setMainImageName(data.mainImage);
        setGalleryNames(JSON.parse(data.galleryImages || "[]"));
      } else {
        alert("Product not found");
        router.push("/admin/products");
      }
      setLoading(false);
    };
    fetchData();
  }, [id, router]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
            Products
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[#2b2112]">
            Edit Product
          </h2>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center rounded-xl border border-[rgba(201,149,0,0.16)] bg-white px-5 py-3 text-sm font-semibold text-[#2b2112] transition hover:border-[rgba(201,149,0,0.3)] hover:text-[#a87400]"
        >
          Back to Products
        </Link>
      </div>

      <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)] md:p-6">
        <form action={updateProduct} className="space-y-6">
          {/* Hidden ID */}
          <input type="hidden" name="id" value={product.id} />
          
          {/* Hidden inputs to preserve existing images if not changed */}
          <input type="hidden" name="existingMainImage" value={product.mainImage} />
          <input type="hidden" name="existingGallery" value={JSON.stringify(galleryNames)} />
          
          {/* Hidden Sizes */}
          <input type="hidden" name="sizes" value={JSON.stringify(selectedSizes)} />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={product.name}
                className="input-premium h-12"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                defaultValue={product.slug}
                className="input-premium h-12"
                required
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
                name="brand"
                defaultValue={product.brand || ""}
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
                defaultValue={product.team || ""}
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
                defaultValue={product.quality || ""}
                className="input-premium h-12"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Category
              </label>
              <select
                name="category"
                defaultValue={product.category}
                className="input-premium h-12"
              >
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
              <select
                name="subcategory"
                defaultValue={product.subcategory || ""}
                className="input-premium h-12"
              >
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
                defaultValue={product.price}
                className="input-premium h-12"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Old Price
              </label>
              <input
                type="number"
                name="oldPrice"
                defaultValue={product.oldPrice || ""}
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
              <select 
                name="stock" 
                defaultValue={product.stock > 0 ? "100" : "0"} 
                className="input-premium h-12"
              >
                <option value="100">In Stock</option>
                <option value="0">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Short Description
              </label>
              <input
                type="text"
                name="shortDescription"
                defaultValue={product.shortDescription || ""}
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
                Update Images
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#7a6641]">
                Leave empty to keep existing image.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[20px] border border-[rgba(201,149,0,0.14)] bg-white p-4">
                <label className="mb-2 block text-sm font-semibold text-[#2b2112]">
                  Main Image
                </label>
                <input
                  type="file"
                  name="mainImage"
                  accept="image/*"
                  onChange={(e) =>
                    setMainImageName(e.target.files?.[0]?.name || product.mainImage)
                  }
                  className="input-premium h-12 py-2.5"
                />
                <p className="mt-2 text-xs text-[#7a6641]">
                  Current: {mainImageName}
                </p>
              </div>

              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="rounded-[20px] border border-[rgba(201,149,0,0.14)] bg-white p-4">
                  <label className="mb-2 block text-sm font-semibold text-[#2b2112]">
                    Gallery Image {index + 1}
                  </label>
                  <input
                    type="file"
                    name={`gallery${index + 1}`}
                    accept="image/*"
                    onChange={(e) => {
                      const newGalleries = [...galleryNames];
                      newGalleries[index] = e.target.files?.[0]?.name || galleryNames[index];
                      setGalleryNames(newGalleries);
                    }}
                    className="input-premium h-12 py-2.5"
                  />
                  <p className="mt-2 text-xs text-[#7a6641]">
                    Current: {galleryNames[index] || "None"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2b2112]">
              Full Description
            </label>
            <textarea
              name="fullDescription"
              defaultValue={product.fullDescription || ""}
              className="input-premium min-h-[120px] resize-none py-3"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Update Product
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