import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// Define Outfit with all the weights you might need
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chariot Auto Sales - Buy Cars",
  description: "The trusted platform for buying quality used vehicles",
  icons: {
    icon: [
      { url: "/Screenshot__173_-removebg-preview.png", sizes: "any" },
      { url: "/Screenshot__173_-removebg-preview.png", type: "image/png" },
    ],
    apple: { url: "/apple-icon.png", type: "image/png" },
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/Screenshot__173_-removebg-preview.png"
          sizes="any"
        />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className={`${outfit.variable} font-outfit antialiased`}>
        <Toaster richColors position="top-center" />
        {children}
      </body>
    </html>
  );
}
