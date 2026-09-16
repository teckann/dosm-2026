import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DOSM Datathon 2026 | Socio-Economic Intelligence Dashboard",
  description: "Next.js Socio-Economic Analytics & Predictive Modeling Dashboard for DOSM Datathon 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 min-h-screen text-slate-900">
        {children}
      </body>
    </html>
  );
}
