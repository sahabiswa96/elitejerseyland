"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { QRCodeSVG } from "qrcode.react";
import { generateUpiLink, UPI_CONFIG } from "@/lib/upi";
import { 
  AlertTriangle, UploadCloud, X, Image as ImageIcon, Hash, 
  Phone, Mail, Clock, ShieldCheck 
} from "lucide-react";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderNumber = searchParams.get("orderNumber") || "";
  const amount = parseFloat(searchParams.get("amount") || "0");

  const [activeTab, setActiveTab] = useState<"utr" | "screenshot">("utr");
  const [utr, setUtr] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const upiLink = generateUpiLink({
    amount,
    note: `Order ${orderNumber}`,
    txnId: orderNumber,
  });

  function openUPI() {
    window.location.href = upiLink;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError("");
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Image size must be under 5MB.");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  async function handleSubmit() {
    setError("");
    setConfirming(true);

    try {
      const formData = new FormData();
      
      if (activeTab === "utr") {
        if (!utr.trim() || utr.length < 12) {
          setError("Please enter a valid 12-digit UTR.");
          setConfirming(false);
          return;
        }
        formData.append("utr", utr.trim());
      } else {
        if (!file) {
          setError("Please upload a payment screenshot.");
          setConfirming(false);
          return;
        }
        formData.append("screenshot", file);
      }

      const res = await fetch(`/api/orders/${orderNumber}/confirm-payment`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      router.push(`/track-order?orderNumber=${orderNumber}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setConfirming(false);
    }
  }

  if (!orderNumber || amount <= 0) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-[#fffdf7]">
        <div className="rounded-3xl border bg-white p-10 text-center shadow-xl max-w-md">
          <p className="text-[#7a6641]">Invalid payment details.</p>
          <button onClick={() => router.push("/cart")} className="mt-6 px-6 py-3 rounded-xl bg-[#c99500] text-white font-semibold">
            Go to Cart
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fffdf7] via-[#fff8e8] to-[#fffdf7] pt-24 pb-16 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* ==========================================
               LEFT SIDE: Instructions & Warnings
          ========================================== */}
          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            
            {/* Amount & ID Card */}
            <div className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white shadow-xl p-8 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#a87400] font-bold">Total Payable Amount</p>
              <h1 className="mt-3 text-5xl font-bold text-[#2b2112]">
                ₹{amount.toLocaleString("en-IN")}
              </h1>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#fff6df] px-4 py-2 border border-[rgba(201,149,0,0.15)]">
                <p className="text-xs text-[#a87400] font-semibold">Order ID:</p>
                <p className="text-sm font-bold text-[#2b2112] tracking-wide">{orderNumber}</p>
              </div>
            </div>

            {/* MEGA WARNING BOX */}
            <div className="rounded-[24px] border-2 border-red-200 bg-red-50 p-6 relative overflow-hidden">
              <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-red-200 opacity-20 blur-2xl"></div>
              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 border border-red-200">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-800">Mandatory Action Required!</h3>
                  <p className="mt-2 text-sm leading-relaxed text-red-700">
                    After completing your UPI payment, you <span className="font-extrabold underline">MUST</span> submit the 12-digit UTR number or upload a payment screenshot from the right side.
                  </p>
                  <div className="mt-4 rounded-lg bg-white/60 border border-red-200 px-4 py-3 backdrop-blur-sm">
                    <p className="text-sm font-bold text-red-600">
                      ⚠️ If you leave this page without submitting proof, you will lose your Order ID and the booking will be permanently cancelled.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps Guide */}
            <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white shadow-lg p-6">
              <h3 className="text-base font-bold text-[#2b2112] mb-5">How to Complete Payment</h3>
              
              <div className="space-y-5">
                {[
                  { step: "1", title: "Pay via UPI", desc: "Click 'Pay Now' or scan the QR code using PhonePe, Google Pay, or Paytm." },
                  { step: "2", title: "Save the UTR", desc: "After successful payment, note down the 12-digit 'UTR' or 'Reference Number' shown on the screen." },
                  { step: "3", title: "Submit Proof", desc: "Switch to the right panel and enter the UTR or upload a screenshot of the success screen." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2b2112] text-white text-xs font-bold">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#2b2112]">{item.title}</p>
                      <p className="text-xs text-[#7a6641] leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-[#fffdf7] p-6">
              <h3 className="text-sm font-bold text-[#2b2112] mb-4">Facing issues with payment?</h3>
              <div className="space-y-3">
                <a href="tel:+918981537417" className="flex items-center gap-3 text-sm text-[#2b2112] hover:text-[#a87400] transition">
                  <Phone size={16} className="text-[#c99500]" /> +91 7003240920
                </a>
                <a href="mailto:sahabiswa180@gmail.com" className="flex items-center gap-3 text-sm text-[#2b2112] hover:text-[#a87400] transition break-all">
                  <Mail size={16} className="text-[#c99500] shrink-0" /> elitejerseyland@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* ==========================================
               RIGHT SIDE: Payment Actions
          ========================================== */}
          <div className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white shadow-xl p-6 md:p-8">
            
            <div className="text-center mb-6 border-b border-[rgba(201,149,0,0.1)] pb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1 mb-4">
                <ShieldCheck size={14} className="text-green-600" />
                <span className="text-xs font-bold text-green-700">Secure UPI</span>
              </div>
              <h2 className="text-xl font-bold text-[#2b2112]">Scan & Pay</h2>
            </div>

            {/* QR */}
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-[#fffdf7] border border-[rgba(201,149,0,0.1)] shadow-sm">
                <QRCodeSVG value={upiLink} size={180} fgColor="#2b2112" bgColor="#fffdf7" />
              </div>
            </div>
            
            <p className="text-center mt-3 text-xs text-[#7a6641]">
              UPI ID: <span className="font-bold text-[#2b2112]">{UPI_CONFIG.vpa}</span>
            </p>

            {/* MAIN PAY BUTTON */}
            <button onClick={openUPI} className="mt-5 w-full rounded-2xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] py-4 text-white font-semibold text-lg shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2">
              🚀 Pay Now with UPI
            </button>

            {/* APP BUTTONS */}
            <div className="mt-5 grid grid-cols-4 gap-2">
              <a href={upiLink} className="upi-btn bg-[#5F259F] text-[10px]">PhonePe</a>
              <a href={upiLink} className="upi-btn bg-[#4285F4] text-[10px]">GPay</a>
              <a href={upiLink} className="upi-btn bg-[#00BAF2] text-[10px]">Paytm</a>
              <a href={upiLink} className="upi-btn bg-black text-[10px]">BHIM</a>
            </div>

            {/* VERIFICATION SECTION */}
            <div className="mt-8 border-t border-[rgba(201,149,0,0.15)] pt-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-[#2b2112]">Submit Payment Proof</h3>
                <div className="flex items-center gap-1 text-xs text-red-500 font-semibold bg-red-50 px-2 py-1 rounded-md">
                  <Clock size={12} /> Required
                </div>
              </div>
              
              {/* TABS */}
              <div className="flex gap-1 mb-5 rounded-xl bg-[#fff8e8] p-1">
                <button
                  type="button"
                  onClick={() => { setActiveTab("utr"); setError(""); }}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition ${activeTab === "utr" ? "bg-white text-[#2b2112] shadow-sm" : "text-[#7a6641]"}`}
                >
                  <Hash size={14} /> Enter UTR
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab("screenshot"); setError(""); }}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition ${activeTab === "screenshot" ? "bg-white text-[#2b2112] shadow-sm" : "text-[#7a6641]"}`}
                >
                  <ImageIcon size={14} /> Screenshot
                </button>
              </div>

              {/* UTR TAB */}
              {activeTab === "utr" && (
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#9b8b6f] font-bold block mb-2">
                    12-Digit UTR / Reference Number
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={utr}
                    onChange={(e) => setUtr(e.target.value.toUpperCase())}
                    placeholder="e.g., 432156789012"
                    className="w-full h-12 rounded-xl border border-[rgba(201,149,0,0.2)] bg-[#fafaf9] px-4 text-sm font-mono tracking-widest text-[#2b2112] placeholder:text-gray-400 outline-none focus:border-[#c99500] focus:ring-2 focus:ring-[rgba(201,149,0,0.1)]"
                  />
                </div>
              )}

              {/* SCREENSHOT TAB */}
              {activeTab === "screenshot" && (
                <div>
                  {!preview ? (
                    <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[rgba(201,149,0,0.3)] bg-[#fafaf9] p-8 cursor-pointer hover:border-[#c99500] hover:bg-[#fffdf7] transition">
                      <UploadCloud size={32} className="text-[#c99500]" />
                      <div className="text-center">
                        <p className="text-sm font-semibold text-[#2b2112]">Click to upload</p>
                        <p className="text-xs text-[#9b8b6f] mt-1">JPG, PNG or WebP (Max 5MB)</p>
                      </div>
                      <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="hidden" />
                    </label>
                  ) : (
                    <div className="relative rounded-2xl border border-[rgba(201,149,0,0.2)] overflow-hidden bg-[#fafaf9]">
                      <img src={preview} alt="Payment Proof" className="w-full h-64 object-contain p-2" />
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <p className="mt-4 flex items-center gap-2 text-xs font-medium text-red-500 bg-red-50 border border-red-100 rounded-lg p-3">
                  <AlertTriangle size={14} className="shrink-0" />
                  {error}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={confirming || (activeTab === "utr" && utr.length < 12) || (activeTab === "screenshot" && !file)}
                className="mt-5 w-full rounded-xl bg-[#2b2112] py-4 text-white font-semibold hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {confirming ? "Submitting..." : "✅ I Have Paid & Submitting Proof"}
              </button>

              <p className="text-center mt-3 text-[10px] text-[#9b8b6f]">
                Do not close this window until proof is submitted.
              </p>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .upi-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 12px 4px;
          border-radius: 12px;
          color: white;
          font-weight: 700;
          transition: 0.2s;
          gap: 2px;
        }
        .upi-btn:hover { opacity: 0.85; }
      `}</style>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#fffdf7] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#c99500] border-t-transparent"></div>
      </main>
    }>
      <PaymentContent />
    </Suspense>
  );
}