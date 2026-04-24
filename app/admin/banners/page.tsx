"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Loader2, Upload, Link } from "lucide-react";

type Banner = {
  id: string;
  imageUrl: string;
  createdAt: string;
};

type Message = {
  type: "success" | "error";
  text: string;
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState<"url" | "upload">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ব্যানার লোড করা
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banner");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBanners(data.banners);
    } catch {
      showMessage("error", "Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // URL দিয়ে ব্যানার যোগ
  const handleAddByUrl = async () => {
    if (!imageUrl.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: imageUrl.trim() }),
      });
      if (!res.ok) throw new Error();
      setImageUrl("");
      showMessage("success", "Banner added successfully");
      fetchBanners();
    } catch {
      showMessage("error", "Failed to add banner");
    } finally {
      setSaving(false);
    }
  };

  // ফাইল আপলোড করে ব্যানার যোগ
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Upload failed");
      }

      const data = await res.json();

      // আপলোড হলে সেই URL দিয়ে ব্যানার তৈরি
      const bannerRes = await fetch("/api/admin/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: data.imageUrl }),
      });

      if (!bannerRes.ok) throw new Error();

      showMessage("success", "Banner uploaded successfully");
      fetchBanners();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      showMessage("error", errorMessage);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ব্যানার ডিলিট
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch("/api/admin/banner", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      showMessage("success", "Banner deleted");
      fetchBanners();
    } catch {
      showMessage("error", "Failed to delete banner");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2b2112]">Manage Banners</h1>
        <p className="mt-1 text-sm text-[#8a7a6b]">
          Add, view and delete home page banners
        </p>
      </div>

      {/* Toast Message */}
      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium transition-all ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add Banner Card */}
      <div className="rounded-2xl border border-[rgba(201,149,0,0.14)] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#2b2112] mb-4">
          Add New Banner
        </h2>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 rounded-lg bg-[#fff8e8] p-1 w-fit">
          <button
            onClick={() => setActiveTab("url")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === "url"
                ? "bg-white text-[#2b2112] shadow-sm"
                : "text-[#8a7a6b] hover:text-[#2b2112]"
            }`}
          >
            <Link size={14} />
            Image URL
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === "upload"
                ? "bg-white text-[#2b2112] shadow-sm"
                : "text-[#8a7a6b] hover:text-[#2b2112]"
            }`}
          >
            <Upload size={14} />
            Upload File
          </button>
        </div>

        {/* URL Input */}
        {activeTab === "url" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL (https://...)"
                className="flex-1 rounded-xl border border-[rgba(201,149,0,0.2)] bg-[#fffdf7] px-4 py-3 text-sm text-[#2b2112] placeholder:text-[#b8a898] outline-none transition focus:border-[#c99500] focus:ring-2 focus:ring-[rgba(201,149,0,0.12)]"
                onKeyDown={(e) => e.key === "Enter" && handleAddByUrl()}
              />
              <button
                onClick={handleAddByUrl}
                disabled={saving || !imageUrl.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(201,149,0,0.16)] transition hover:shadow-[0_14px_32px_rgba(201,149,0,0.22)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
                {saving ? "Adding..." : "Add Banner"}
              </button>
            </div>

            {/* URL Preview */}
            {imageUrl.trim() && (
              <div>
                <p className="text-xs font-medium text-[#8a7a6b] mb-2">
                  Preview:
                </p>
                <div className="relative h-[140px] w-full max-w-md overflow-hidden rounded-xl border border-[rgba(201,149,0,0.14)] bg-[#fff8e8]">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* File Upload */}
        {activeTab === "upload" && (
          <div>
            <label
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[rgba(201,149,0,0.3)] bg-[#fffdf7] px-6 py-10 transition hover:border-[#c99500] hover:bg-[#fff6df] ${
                uploading ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {uploading ? (
                <Loader2 size={28} className="animate-spin text-[#c99500]" />
              ) : (
                <Upload size={28} className="text-[#c99500]" />
              )}
              <div className="text-center">
                <p className="text-sm font-medium text-[#2b2112]">
                  {uploading
                    ? "Uploading..."
                    : "Click to select an image"}
                </p>
                <p className="mt-1 text-xs text-[#8a7a6b]">
                  JPG, PNG, WebP — Max 5MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Existing Banners */}
      <div className="rounded-2xl border border-[rgba(201,149,0,0.14)] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#2b2112] mb-4">
          Existing Banners{" "}
          <span className="text-sm font-normal text-[#8a7a6b]">
            ({banners.length})
          </span>
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-[#c99500]" />
          </div>
        ) : banners.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-[#8a7a6b]">
              No banners added yet. Add your first banner above.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {banners.map((banner, idx) => (
              <div
                key={banner.id}
                className="group relative overflow-hidden rounded-xl border border-[rgba(201,149,0,0.14)] bg-[#fffdf7]"
              >
                {/* Order badge */}
                <div className="absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#c99500] text-[10px] font-bold text-white">
                  {idx + 1}
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/90 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                  title="Delete banner"
                >
                  <Trash2 size={14} />
                </button>

                <div className="relative h-[150px] bg-[#fff8e8]">
                  <img
                    src={banner.imageUrl}
                    alt="Banner"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="px-3 py-2.5">
                  <p className="truncate text-xs text-[#8a7a6b]">
                    {banner.imageUrl}
                  </p>
                  <p className="mt-1 text-[10px] text-[#b8a898]">
                    Added:{" "}
                    {new Date(banner.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}