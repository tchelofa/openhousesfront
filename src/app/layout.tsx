import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
      <body className={inter.className}>
        
        {children}
      </body>
    </html>
  );
}



