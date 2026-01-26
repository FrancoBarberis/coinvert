
// app/fonts.ts
import localFont from "next/font/local";

// Inter Tight variable (si estás usando InterTight en lugar de Inter)
export const interTight = localFont({
  src: [
    {
      path: "./fonts/InterTight-VariableFont_wght.ttf", // o .ttf si solo tenés ttf
      style: "normal",
      weight: "100 900",
    },
  ],
  variable: "--font-inter",   // nombre de variable CSS para la UI
  display: "swap",
});

// Space Grotesk variable
export const spaceGrotesk = localFont({
  src: [
    {
      path: "./fonts/SpaceGrotesk-VariableFont_wght.ttf",
      style: "normal",
      weight: "300 700",
    },
  ],
  variable: "--font-space-grotesk", // nombre de variable CSS para display
  display: "swap",
});
