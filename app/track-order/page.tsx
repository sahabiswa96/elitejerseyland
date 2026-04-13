const orderStages = ["Ordered", "Packed", "Shipped", "Delivered"] as const;
const currentStage = "Packed";

export default function TrackOrderPage() {
  const currentStageIndex = orderStages.indexOf(currentStage);

  return (
    <main className="container py-10 md:py-14">
      <section className="relative overflow-hidden rounded-[30px] border border-[rgba(201,149,0,0.14)] bg-white/80 shadow-[0_20px_60px_rgba(201,149,0,0.08)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,149,0,0.12),transparent_28%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,149,0,0.05),transparent_22%)]" />

        <div className="relative grid gap-8 px-5 py-8 sm:px-6 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-10">
          {/* LEFT SIDE → HELP PANEL */}
          <div className="lg:pl-2">
            <div className="rounded-[26px] border border-[rgba(201,149,0,0.14)] bg-[#fffdf7] p-5 shadow-[0_12px_32px_rgba(201,149,0,0.06)] md:p-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
                Order Help
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#2b2112]">
                Need help with tracking?
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#7a6641]">
                If you cannot find your order, contact support using your order ID,
                email, or phone number.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#9b8b6f]">
                    Contact Number
                  </p>
                  <p className="mt-2 font-semibold text-[#2b2112]">
                    +91 8981537417
                  </p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#9b8b6f]">
                    Email
                  </p>
                  <p className="mt-2 font-semibold text-[#2b2112]">
                    sahabiswa180@gmail.com
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
                Quick Tips
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-[#fffdf7] p-4">
                  <p className="text-sm font-semibold text-[#2b2112]">
                    Correct Order ID
                  </p>
                  <p className="mt-1 text-sm text-[#7a6641]">
                    Enter the exact order ID received.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fffdf7] p-4">
                  <p className="text-sm font-semibold text-[#2b2112]">
                    Same Email / Phone
                  </p>
                  <p className="mt-1 text-sm text-[#7a6641]">
                    Use the same details used while ordering.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE → MAIN CONTENT */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#a87400]">
              Track Order
            </p>

            <h1 className="mt-3 text-3xl font-bold text-[#2b2112] md:text-4xl">
              Check your order status
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7a6641]">
              Enter your order ID with your email or phone number to see the latest
              progress of your order.
            </p>

            <form className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Order ID"
                className="input-premium h-12"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="input-premium h-12"
                />

                <input
                  type="tel"
                  placeholder="Phone"
                  className="input-premium h-12"
                />
              </div>

              <button
                type="button"
                className="w-full rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-4 py-3 font-semibold text-white transition hover:opacity-90 md:w-auto md:min-w-[180px]"
              >
                Track Order
              </button>
            </form>

            {/* ORDER RESULT */}
            <div className="mt-8 rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-[#fffdf7] p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#9b8b6f]">
                    Order Result
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[#2b2112]">
                    Order #EJL-2026-00124
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[#7a6641]">
                    Your order is currently moving through the delivery process.
                  </p>
                </div>

                <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                  {currentStage}
                </span>
              </div>

              {/* DESKTOP TIMELINE */}
              <div className="mt-8 hidden md:block">
                <div className="relative grid grid-cols-4">
                  {/* base line */}
                  <div className="absolute left-[12.5%] right-[12.5%] top-4 h-[3px] rounded-full bg-[#eadfbe]" />

                  {/* active green line */}
                  <div
                    className="absolute left-[12.5%] top-4 h-[3px] rounded-full bg-green-500 shadow-[0_0_14px_rgba(34,197,94,0.45)] transition-all duration-500"
                    style={{
                      width:
                        currentStageIndex === 0
                          ? "0%"
                          : currentStageIndex === 1
                          ? "25%"
                          : currentStageIndex === 2
                          ? "50%"
                          : "75%",
                    }}
                  />

                  {orderStages.map((stage, index) => {
                    const completed = index <= currentStageIndex;
                    const current = index === currentStageIndex;

                    return (
                      <div
                        key={stage}
                        className="relative flex flex-col items-center text-center"
                      >
                        <div
                          className={`relative z-10 h-8 w-8 rounded-full border-4 transition-all duration-300 ${
                            completed
                              ? "border-green-500 bg-white shadow-[0_0_18px_rgba(34,197,94,0.35)]"
                              : "border-[#d8c79a] bg-white"
                          }`}
                        >
                          <span
                            className={`absolute inset-0 m-auto h-3 w-3 rounded-full ${
                              completed ? "bg-green-500" : "bg-[#d8c79a]"
                            }`}
                          />
                        </div>

                        <p
                          className={`mt-4 text-sm font-semibold ${
                            current
                              ? "text-green-700"
                              : completed
                              ? "text-[#2b2112]"
                              : "text-[#9b8b6f]"
                          }`}
                        >
                          {stage}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MOBILE TIMELINE */}
              <div className="mt-8 space-y-5 md:hidden">
                {orderStages.map((stage, index) => {
                  const completed = index <= currentStageIndex;
                  const current = index === currentStageIndex;
                  const last = index === orderStages.length - 1;

                  return (
                    <div key={stage} className="flex items-start gap-4">
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`relative z-10 h-8 w-8 rounded-full border-4 ${
                            completed
                              ? "border-green-500 bg-white shadow-[0_0_14px_rgba(34,197,94,0.35)]"
                              : "border-[#d8c79a] bg-white"
                          }`}
                        >
                          <span
                            className={`absolute inset-0 m-auto h-3 w-3 rounded-full ${
                              completed ? "bg-green-500" : "bg-[#d8c79a]"
                            }`}
                          />
                        </div>

                        {!last && (
                          <div
                            className={`mt-1 w-[3px] flex-1 rounded-full ${
                              index < currentStageIndex
                                ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.35)]"
                                : "bg-[#eadfbe]"
                            }`}
                            style={{ minHeight: "42px" }}
                          />
                        )}
                      </div>

                      <div className="pt-1">
                        <p
                          className={`text-sm font-semibold ${
                            current
                              ? "text-green-700"
                              : completed
                              ? "text-[#2b2112]"
                              : "text-[#9b8b6f]"
                          }`}
                        >
                          {stage}
                        </p>
                        <p className="mt-1 text-xs text-[#7a6641]">
                          {index < currentStageIndex
                            ? "Completed"
                            : current
                            ? "Current Stage"
                            : "Pending"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-[20px] border border-[rgba(201,149,0,0.12)] bg-white p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#9b8b6f]">
                  Order Summary
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-[#7a6641]">Product</p>
                    <p className="mt-1 font-semibold text-[#2b2112]">
                      Elite Match Jersey
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#7a6641]">Payment Status</p>
                    <p className="mt-1 font-semibold text-[#2b2112]">
                      Payment Pending
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#7a6641]">Total Amount</p>
                    <p className="mt-1 font-semibold text-[#c99500]">₹999</p>
                  </div>

                  <div>
                    <p className="text-sm text-[#7a6641]">Estimated Delivery</p>
                    <p className="mt-1 font-semibold text-[#2b2112]">
                      3 - 5 Working Days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END RIGHT SIDE */}
        </div>
      </section>
    </main>
  );
}