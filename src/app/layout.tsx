import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";
import { SITE, SITE_METADATA } from "@/lib/site";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE_METADATA.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE_METADATA.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: {
    email: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: [
      {
        url: "/bklogo.png",
        width: 512,
        height: 512,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: ["/bklogo.png"],
  },
  icons: {
    icon: [
      { url: "/bklogo.png", sizes: "any" },
      { url: "/bklogo.png", type: "image/png" },
    ],
    apple: { url: "/bklogo.png", type: "image/png" },
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
        <link rel="icon" href="/bklogo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/bklogo.png" />
      </head>
      <body className={`${quicksand.variable} font-sans antialiased`}>
        <Toaster richColors position="top-center" />
        {children}
        <Script id="tawk-to" strategy="lazyOnload">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src="https://embed.tawk.to/6a0b64b3fdbedb1c35338257/1jou82o30";
              s1.charset="UTF-8";
              s1.setAttribute("crossorigin","*");
              s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
