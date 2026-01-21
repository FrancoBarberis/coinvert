
import "./globals.css";
import type { Metadata } from "next";

// TODO:
// io("https://tu-backend.com", { transports: ["websocket", "polling"] });

export const metadata: Metadata = {
  title: "Coinvert - Free currency convertions",
    description: "App designed to easily obtain currency convertions from a server",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="h-screen w-full text-white bg-linear-to-t from-gray-700 via-gray-500 to-gray-700 flex flex-col items-center justify-center"
      >
        {children}
      </body>
    </html>
  );
}
