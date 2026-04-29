import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Midnight Founder — Start your business tonight",
  description: "11 guided steps from idea to official business. Name, logo, LLC, EIN, bank account, domain, website — free, no credit card.",
  openGraph: {
    title: "The Midnight Founder",
    description: "11 guided steps from idea to official business. Free, no credit card.",
    url: "https://themidnightfounder.com",
    siteName: "The Midnight Founder",
    images: [{ url: "https://themidnightfounder.com/api/og", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Midnight Founder",
    description: "11 guided steps from idea to official business. Free, no credit card.",
    images: ["https://themidnightfounder.com/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
