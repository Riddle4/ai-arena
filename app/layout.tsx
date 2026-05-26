import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Arena by Cosmo",
  description:
    "A Cosmo-powered arena where AI agents debate, compare reasoning and generate publishable content."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
