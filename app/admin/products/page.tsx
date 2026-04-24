"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "./actions";

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  team: string | null;
  category: string;
  subcategory: string | null;
  price: number;
  oldPrice: number | null;
  stock: number;
  quality: string | null;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch products on load
  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      product.name.toLowerCase().includes(q) ||
      product.slug.toLowerCase().includes(q) ||
      (product.team && product.team.toLowerCase().includes(q)) ||
      product.category.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    const result = await deleteProduct(id);
    if (result.success) {
      // Remove from local state immediately for better UX
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Failed to delete product");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
            Products
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[#2b2112]">
            Manage Products
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7a6641]">
            Add, edit, delete, and manage stock status for all products.
          </p>
        </div>

        <Link
          href="/admin/products/add"
          className="inline-flex items-center justify-center rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Add Product
        </Link>
      </div>

      <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
        <div className="mb-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, slug, team, category..."
            className="input-premium h-12"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full text-left">
            <thead>
              <tr className="border-b border-[rgba(201,149,0,0.12)] text-sm text-[#7a6641]">
                <th className="px-3 py-3 font-medium">Product Name</th>
                <th className="px-3 py-3 font-medium">Slug</th>
                <th className="px-3 py-3 font-medium">Team</th>
                <th className="px-3 py-3 font-medium">Category</th>
                <th className="px-3 py-3 font-medium">Subcategory</th>
                <th className="px-3 py-3 font-medium">Price</th>
                <th className="px-3 py-3 font-medium">Stock</th>
                <th className="px-3 py-3 font-medium">Quality</th>
                <th className="px-3 py-3 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[rgba(201,149,0,0.08)] text-sm text-[#2b2112]"
                >
                  <td className="px-3 py-4 font-semibold">{product.name}</td>
                  <td className="px-3 py-4">{product.slug}</td>
                  <td className="px-3 py-4">{product.team || "-"}</td>
                  <td className="px-3 py-4">{product.category}</td>
                  <td className="px-3 py-4">{product.subcategory || "-"}</td>
                  <td className="px-3 py-4 font-semibold text-[#c99500]">
                    ₹{product.price}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        product.stock > 0
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-3 py-4">{product.quality || "-"}</td>
                  <td className="px-3 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="rounded-lg border border-[rgba(201,149,0,0.16)] bg-[#fffdf7] px-3 py-2 text-xs font-semibold text-[#a87400] transition hover:border-[rgba(201,149,0,0.3)]"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="rounded-lg border border-[rgba(220,38,38,0.16)] bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-3 py-8 text-center text-sm text-[#7a6641]"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}