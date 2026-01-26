
// utils/currency-to-flag.ts

export type CurrencyCode = string;

/**
 * Monedas que NO representan un país
 * → no mostrar bandera
 */
const NON_FLAG_CURRENCIES = new Set([
  "XDR",
  "CLF",
  "CNH",
]);

/**
 * Mapping principal ISO 4217 → ISO 3166-1 alpha-2
 * Solo donde tiene sentido mostrar bandera
 */
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  // América
  ARS: "AR",
  BOB: "BO",
  BRL: "BR",
  CAD: "CA",
  CLP: "CL",
  COP: "CO",
  CRC: "CR",
  MXN: "MX",
  PEN: "PE",
  PYG: "PY",
  UYU: "UY",
  USD: "US",

  // Europa
  GBP: "GB",
  CHF: "CH",
  NOK: "NO",
  SEK: "SE",
  DKK: "DK",
  CZK: "CZ",
  PLN: "PL",
  RON: "RO",
  HUF: "HU",

  // Asia
  JPY: "JP",
  KRW: "KR",
  CNY: "CN",
  INR: "IN",
  THB: "TH",
  IDR: "ID",
  PHP: "PH",

  // África
  ZAR: "ZA",
  NGN: "NG",
  KES: "KE",
  MAD: "MA",

  // Oceanía
  AUD: "AU",
  NZD: "NZ",

  // Regionales
  EUR: "EU",
};

/** Convierte ISO 3166‑1 alpha‑2 → emoji */
function countryToEmoji(code: string): string {
  if (code === "EU") return "🇪🇺";

  return code
    .toUpperCase()
    .replace(/[^\p{L}]/gu, "")
    .replace(/./g, char =>
      String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65)
    );
}

/** API pública */
export function currencyToFlagEmoji(currency: CurrencyCode): string {
  if (!currency) return "🏳️";

  const code = currency.toUpperCase();

  // 1️⃣ Monedas sin bandera
  if (NON_FLAG_CURRENCIES.has(code)) {
    return "◻️"; // o 💱 o 🏦
  }

  // 2️⃣ Mapping conocido
  const country = CURRENCY_TO_COUNTRY[code];
  if (country) {
    return countryToEmoji(country);
  }

  // 3️⃣ Fallback seguro (no mentir)
  return "🏳️";
}
