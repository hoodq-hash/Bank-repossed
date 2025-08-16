import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";

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
      { url: "/chariot_logo.png", sizes: "any" },
      { url: "/chariot_logo.png", type: "image/png" },
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
        <link rel="icon" href="/chariot_logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
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
      <body className={`${outfit.variable} font-outfit antialiased`}>
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
