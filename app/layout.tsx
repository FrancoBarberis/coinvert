// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { interTight, spaceGrotesk } from "./fonts";
import "flag-icons/css/flag-icons.min.css";
import ogimage from "../public/CoinvertOGLogo.png";

const PROD_URL = "https://coinvert-5f0y8215k-francobarberis-projects.vercel.app";
// const PROD_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(PROD_URL),
  title: "Coinvert - Free currency conversions",
  description: "Real-time currency converter with live rates.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Coinvert",
    description: "Real-time currency converter.",
    siteName: "Coinvert",
    url: PROD_URL,              // absoluta
    locale: "en_US",
    type: "website",
    images: [
      {
        // Usamos ogImage.src (string) y, gracias a metadataBase, Next genera URL absoluta
        url: ogimage.src,
        width: ogimage.width,   // número
        height: ogimage.height, // número
        alt: "Coinvert - Real-time currency converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coinvert",
    description: "Real-time currency converter.",
    images: [ogimage.src],      // también aceptado
  },
} satisfies Metadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interTight.variable} ${spaceGrotesk.variable}`}>
      <body className="h-screen w-full text-white bg-linear-to-t from-gray-700 via-gray-500 to-gray-700 flex flex-col items-center justify-center">
        {children}
      </body>
    </html>
  );
}
