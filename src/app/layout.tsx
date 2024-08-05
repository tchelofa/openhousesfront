import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenHouses - Your home with respect.",
  description: "Tired of wasting time on Irish property listings? OpenHouses connects respectful tenants with qualified landlords. Find your perfect match now! Browse thousands of listings, connect directly with landlords, and rent with confidence. Visit our website and start your search today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=G-ZNJTH4YYRC`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZNJTH4YYRC');
          `}
        </Script>
        {/* Google Ads */}
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7617273455696170"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
