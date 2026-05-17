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
        <Script id="smartsupp-head" strategy="beforeInteractive">
          {`
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = 'edab3fb7445291b8e303e5729a769ddecd835bec';
            window.smartsupp||(function(d) {
              var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
              s=d.getElementsByTagName('script')[0];c=d.createElement('script');
              c.type='text/javascript';c.charset='utf-8';c.async=true;
              c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
            })(document);
          `}
        </Script>
      </head>
      <body className={`${quicksand.variable} font-sans antialiased`}>
        <Toaster richColors position="top-center" />
        <noscript>
          Powered by{" "}
          <a href="https://www.smartsupp.com" target="_blank">
            Smartsupp
          </a>
        </noscript>
        {children}
      </body>
    </html>
  );
}
