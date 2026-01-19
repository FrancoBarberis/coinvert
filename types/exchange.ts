
export type CurrencyCode = string;                 // Si querés, lo cambiamos por union estático
export type RatesMap = Record<CurrencyCode, number>;

export interface ExchangeRatesSnapshot {
  base_code: CurrencyCode;
  documentation?: string;
  provider?: string;
  terms_of_use?: string;
  rates: RatesMap;
  result?: "success" | "error";
  time_eol_unix?: number;
  time_last_update_unix: number;   // segundos (→ *1000 para ms)
  time_next_update_unix?: number;
}
