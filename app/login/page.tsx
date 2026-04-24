import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const metadata = {
  title: "Login | Elite Jersey Land",
  description: "Login to your account - Elite Jersey Land",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
            Loading login page...
          </div>
        }
      >
        <LoginClient />
      </Suspense>
    </main>
  );
}