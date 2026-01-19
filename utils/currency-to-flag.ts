
// utils/currency-to-flag.ts
// Mapeo rápido de moneda (ISO 4217) → país (ISO 3166-1 alpha-2)
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  ARS: "AR",
  USD: "US",
  EUR: "EU", // 👈 para euro no hay una bandera oficial de país; usamos "EU" (emojis no estándar).
  BRL: "BR",
  GBP: "GB",
  JPY: "JP",
  CLP: "CL",
  UYU: "UY",
  PYG: "PY",
  COP: "CO",
  MXN: "MX",
  CAD: "CA",
  AUD: "AU",
  NZD: "NZ",
  CNY: "CN",
  INR: "IN",
  CHF: "CH",
  SEK: "SE",
  NOK: "NO",
  DKK: "DK",
  // ...agregá las que uses
};

// Convierte "AR" → 🇦🇷; "US" → 🇺🇸
function countryCodeToFlagEmoji(cc: string) {
  // Para "EU" no hay bandera emoji estándar; devolvemos símbolo europeo u otra marca
  if (cc.toUpperCase() === "EU") return "🇪🇺";
  return cc
    .toUpperCase()
    .replace(/./g, (ch) =>
      String.fromCodePoint(0x1f1e6 - 65 + ch.charCodeAt(0))
    );
}

export function currencyToFlagEmoji(currency: string): string {
  const cc = CURRENCY_TO_COUNTRY[currency.toUpperCase()];
  return cc ? countryCodeToFlagEmoji(cc) : "🏳️"; // fallback neutro
}
