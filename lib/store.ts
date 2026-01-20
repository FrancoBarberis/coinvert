
import { create } from "zustand";
import type { ExchangeRatesSnapshot } from "@/types/exchange";

type ConvertResponse = {
  from: string;
  to: string;
  amount: number;
  rate: number;
  converted: number;
  base: string;
  asOf: number; // ms epoch
};

interface AppState {
  rates: ExchangeRatesSnapshot | null;
  monedaOrigen: string;
  monedaDestino: string;

  setMonedaOrigen: (moneda: string) => void;
  setMonedaDestino: (moneda: string) => void;
  invert: () => void;

  obtainRates: () => Promise<void>;

  /** Calcula en backend y devuelve la respuesta de conversión (rate + converted) */
  convertServer: (
    monedaOrigen: string,
    monedaDestino: string,
    cantidad?: number
  ) => Promise<ConvertResponse | null>;

  /** Calcula localmente a partir del snapshot: rate(to)/rate(from) */
  rateBetween: (from: string, to: string) => number | null;
}

const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

const useAppStore = create<AppState>((set, get) => ({
  rates: null,
  monedaOrigen: "USD",
  monedaDestino: "ARS",

  setMonedaOrigen: (moneda) => set({ monedaOrigen: moneda }),
  setMonedaDestino: (moneda) => set({ monedaDestino: moneda }),

  invert: () => {
    const { monedaOrigen, monedaDestino } = get();
    set({ monedaOrigen: monedaDestino, monedaDestino: monedaOrigen });
  },

  obtainRates: async () => {
    try {
      if (!backend) {
        console.warn("[obtainRates] NEXT_PUBLIC_BACKEND_URL no está configurado");
        return;
      }
      const res = await fetch(`${backend}/api/rates`, {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) {
        console.error("[obtainRates] HTTP", res.status);
        return;
      }
      const json: ExchangeRatesSnapshot = await res.json();
      set({ rates: json });
    } catch (error) {
      console.error("[obtainRates] Fetch error:", error);
    }
  },

  convertServer: async (from, to, amount = 1) => {
    try {
      if (!backend) {
        console.warn("[convertServer] NEXT_PUBLIC_BACKEND_URL no está configurado");
        return null;
      }
      const params = new URLSearchParams({
        from,
        to,
        amount: String(Number.isFinite(amount) ? amount : 1),
      });

      const res = await fetch(`${backend}/api/rates/convert?${params.toString()}`, {
        method: "GET",
      });
      if (!res.ok) {
        console.error("[convertServer] HTTP", res.status);
        return null;
      }
      const data: ConvertResponse = await res.json();
      return data;
    } catch (error) {
      console.error("[convertServer] Fetch error:", error);
      return null;
    }
  },

  rateBetween: (from, to) => {
    const snapshot = get().rates;
    if (!snapshot?.rates) return null;
    const rFrom = snapshot.rates[from];
    const rTo = snapshot.rates[to];
    if (!rFrom || !rTo) return null;
    return rTo / rFrom;
  },
}));

export default useAppStore;
