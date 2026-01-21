
// types/exchange.ts
export type CurrencyCode = string;
export type RatesMap = Record<CurrencyCode, number>;

export interface ExchangeRatesSnapshot {
  base_code: CurrencyCode;
  documentation?: string;
  provider?: string;
  terms_of_use?: string;
  rates: RatesMap;
  result?: "success" | "error";
  time_eol_unix?: number;
  time_last_update_unix: number;   // proveedor (UTC, seg)
  time_next_update_unix?: number;  // proveedor (UTC, seg)
  time_last_update_utc?: string;
  time_next_update_utc?: string;
}

// ➕ Lo que devuelve tu backend con metadatos de caché propios
export interface ExchangeRatesSnapshotWithMeta extends ExchangeRatesSnapshot {
  as_of_unix: number;     // seg, momento de descarga/caché en TU servidor
  cache_ttl_ms: number;   // TTL real (ms) que aplica tu backend
  expires_unix: number;   // seg, as_of_unix + ttl (o min con next_update)
}
