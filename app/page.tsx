
"use client";
import CurrencyDropdown from "@/components/CurrencyDropdown";
import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const {
    monedaOrigen,
    setMonedaOrigen,
    monedaDestino,
    setMonedaDestino,
    invert,
    obtainRates,
    rates,
    convertServer, // async (from, to, amount)
  } = useAppStore();

  const lastUpdateUnix = rates?.time_last_update_unix;
  const lastUpdateDate = lastUpdateUnix ? new Date(lastUpdateUnix * 1000) : null;

  // 1) Trae snapshot al montar (incluí la fn en deps; Zustand la mantiene estable)
  useEffect(() => {
    obtainRates();
  }, [obtainRates]);

  // 2) Estado para el rate (y loading/error opcional)
  const [rate, setRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);

  // 3) Cuando cambian las monedas, pedile al backend el rate para amount=1
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingRate(true);
      const res = await convertServer(monedaOrigen, monedaDestino, 1);
      if (!cancelled) {
        setRate(res?.rate ?? null);
        setLoadingRate(false);
      }
    })();
    return () => { cancelled = true; };
  }, [convertServer, monedaOrigen, monedaDestino]);

  // Texto de última actualización
  const lastUpdateText = useMemo(
    () => (lastUpdateDate ? lastUpdateDate.toLocaleString() : "-"),
    [lastUpdateDate]
  );

  return (
    <div className="items-center justify-center w-full min-h-screen flex flex-col gap-6 px-4">
      <h1 className="font-extrabold text-emerald-500 text-4xl lg:text-5xl">Coinvert</h1>
      <h3 className="text-base lg:text-lg text-center max-w-[90%]">
        Your free currency conversion tool
      </h3>

      <CurrencyDropdown currencyName={monedaOrigen} onChange={setMonedaOrigen} />

      <Button
        onClick={invert}
        variant="outline"
        size="icon"
        aria-label="Swap currencies"
        title="Swap currencies"
        className="rounded-full text-neutral-800 font-bold hover:cursor-pointer hover:bg-gray-200"
      >
        <ArrowUpDown aria-hidden className="h-5 w-5 opacity-100" />
      </Button>

      <CurrencyDropdown currencyName={monedaDestino} onChange={setMonedaDestino} />

      <p className="text-sm">
        1 {monedaOrigen} = {loadingRate ? "…" : (rate ? rate.toFixed(6) : "—")} {monedaDestino}
      </p>

      <p className="text-xs text-neutral-500">
        Last updated: {lastUpdateText}
      </p>
    </div>
  );
}
