import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="h-[calc(100vh-48px)] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(201,149,0,0.08),transparent_24%),linear-gradient(to_bottom,#fffdf7,#fff8e8_45%,#fffdf7)]">
      <div className="container flex h-full items-center justify-center py-10 md:py-16">
        <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#a87400]">
              Elite Jersey Land
            </p>

            <h1 className="mt-4 max-w-xl text-5xl font-bold leading-tight text-[#2b2112]">
              Reset your password and get back to shopping.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-8 text-[#7a6641]">
              Enter your email address to receive a reset link and regain access
              to your Elite Jersey Land account.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md overflow-hidden rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white/80 p-6 shadow-[0_24px_80px_rgba(201,149,0,0.08)] backdrop-blur-xl sm:p-8">
            <div className="text-center">
              <h1 className="mt-4 text-3xl font-bold text-[#2b2112]">
                Forgot Password
              </h1>
              <p className="mt-2 text-sm text-[#7a6641]">
                Enter your email to receive a reset link.
              </p>
            </div>

            <form className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-premium h-12"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Send Reset Link
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-[#7a6641]">
              Back to{" "}
              <Link href="/login" className="font-semibold text-[#a87400] transition hover:opacity-80">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}