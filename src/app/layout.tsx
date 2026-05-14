import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bank Repossessed Cars — Save on Repo Inventory",
  description:
    "Browse bank- and lender-repossessed vehicles at transparent pricing. Verified listings and a straightforward buying experience.",
  icons: {
    icon: [
      { url: "/bklogo.png", sizes: "any" },
      { url: "/bklogo.png", type: "image/png" },
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
        <link rel="icon" href="/bklogo.png" sizes="any" />
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
