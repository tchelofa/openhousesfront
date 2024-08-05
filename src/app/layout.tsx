'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { useState, useEffect } from "react";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import { metadata } from "./metadata";  // Importar metadata

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    setConsent(getCookieConsentValue() === "true");
  }, []);

  return (
    <html lang="en">
      <head>
        {consent && (
          <>
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
          </>
        )}
      </head>
      <body className={inter.className}>
        {children}
        <CookieConsent
          location="bottom"
          buttonText="Accept"
          declineButtonText="Decline"
          cookieName="userConsent"
          style={{ background: "#2B373B" }}
          buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
          expires={150}
          enableDeclineButton
          onAccept={() => setConsent(true)}
        >
          This website uses cookies to enhance the user experience. By clicking "Accept", you consent to the use of all cookies in accordance with our Privacy Policy.
        </CookieConsent>
      </body>
    </html>
  );
}
