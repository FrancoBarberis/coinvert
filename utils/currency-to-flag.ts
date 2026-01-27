
// utils/currency-to-flag-icon.ts
export type CurrencyCode = string;

const NON_FLAG_CURRENCIES = new Set(["XDR", "CLF", "CNH"]);

const CURRENCY_TO_COUNTRY: Record<string, string> = {
  // América
  ARS: "AR", BOB: "BO", BRL: "BR", CAD: "CA", CLP: "CL", COP: "CO",
  CRC: "CR", MXN: "MX", PEN: "PE", PYG: "PY", UYU: "UY", USD: "US",
  // Europa
  GBP: "GB", CHF: "CH", NOK: "NO", SEK: "SE", DKK: "DK", CZK: "CZ",
  PLN: "PL", RON: "RO", HUF: "HU",
  // Asia
  JPY: "JP", KRW: "KR", CNY: "CN", INR: "IN", THB: "TH", IDR: "ID", PHP: "PH",
  // África
  ZAR: "ZA", NGN: "NG", KES: "KE", MAD: "MA",
  // Oceanía
  AUD: "AU", NZD: "NZ",
  // Regional
  EUR: "EU", // ojo: flag-icons usa 'eu'
};

export function currencyToFlagIconCode(currency?: CurrencyCode): string | null {
  if (!currency) return null;
  const code = currency.toUpperCase();
  if (NON_FLAG_CURRENCIES.has(code)) return null;

  const country = CURRENCY_TO_COUNTRY[code];
  if (!country) return null;

  // flag-icons usa 'eu' para Unión Europea:
  const normalized = country === "EU" ? "eu" : country.toLowerCase();
  return normalized;
}
