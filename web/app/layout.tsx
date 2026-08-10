import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Curata",
  description: "One page for what you love — movies, TV shows, and restaurants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
