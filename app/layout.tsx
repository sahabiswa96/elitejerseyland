import "./globals.css";
import type { Metadata } from "next";
import LayoutWrapper from "./LayoutWrapper";

export const metadata: Metadata = {
  title: "Elite Jersey Land",
  description: "Premium Football Jerseys | Elite Jersey Land",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}