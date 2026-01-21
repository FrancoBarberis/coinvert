
// lib/store.ts
import { create } from "zustand";
import type { ExchangeRatesSnapshotWithMeta } from "@/types/exchange";

type ConvertResponseWire = {
  from: string;
  to: string;
  amount: number;
  rate: number;
  converted: number;
  base: string;
  // del backend:
  as_of_unix?: number;              // seg (si tu /convert lo incluye)
  cache_ttl_ms?: number;
  expires_unix?: number;
  // provider (opcionales)
  provider_time_last_update_unix?: number;
  provider_time_next_update_unix?: number;
};

// Mantenemos tu firma previa (asOf en ms), mapeando el wire:
export type ConvertResponse = {
  from: string;
  to: string;
  amount: number;
  rate: number;
  converted: number;
  base: string;
  asOf: number; // ms epoch (map de as_of_unix)
};

interface AppState {
  rates: ExchangeRatesSnapshotWithMeta | null;
  monedaOrigen: string;
  monedaDestino: string;

  setMonedaOrigen: (moneda: string) => void;
  setMonedaDestino: (moneda: string) => void;
  invert: () => void;

  obtainRates: () => Promise<void>;

  convertServer: (
    monedaOrigen: string,
    monedaDestino: string,
    cantidad?: number
  ) => Promise<ConvertResponse | null>;

  rateBetween: (from: string, to: string) => number | null;

  // ➕ helper de frescura (front-friendly)
  isSnapshotFresh: () => boolean;
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
      const json = (await res.json()) as ExchangeRatesSnapshotWithMeta;
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
        cache: "no-store",
      });
      if (!res.ok) {
        console.error("[convertServer] HTTP", res.status);
        return null;
      }
      const data = (await res.json()) as ConvertResponseWire;

      // Mapear a la forma que ya usabas (asOf en ms).
      // Si el backend no mandó as_of_unix, usamos time_last_update_unix de /api/rates que tengas almacenado.
      const fallbackMs =
        (get().rates?.as_of_unix ? get().rates!.as_of_unix * 1000 : undefined) ??
        (get().rates?.time_last_update_unix ? get().rates!.time_last_update_unix * 1000 : Date.now());

      const asOfMs = data.as_of_unix ? data.as_of_unix * 1000 : fallbackMs;

      const mapped: ConvertResponse = {
        from: data.from,
        to: data.to,
        amount: data.amount,
        rate: data.rate,
        converted: data.converted,
        base: data.base,
        asOf: asOfMs,
      };
      return mapped;
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

  // ➕ helper: determina si la caché está vigente según metadatos
  isSnapshotFresh: () => {
    const snap = get().rates;
    if (!snap?.as_of_unix || !snap?.cache_ttl_ms) return false;
    const asOfMs = snap.as_of_unix * 1000;
    return Date.now() - asOfMs <= snap.cache_ttl_ms;
  },
}));

export default useAppStore;
