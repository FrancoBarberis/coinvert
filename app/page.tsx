
"use client";
import CurrencyDropdown from "@/components/CurrencyDropdown";
import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const {
    monedaOrigen, setMonedaOrigen,
    monedaDestino, setMonedaDestino,
    invert, obtainRates, rates,
    convertServer, isSnapshotFresh
  } = useAppStore();

  useEffect(() => { obtainRates(); }, [obtainRates]);

  const [fromAmount, setFromAmount] = useState<string>("1");
  const [toAmount, setToAmount]     = useState<string>("");
  const [activeField, setActiveField] = useState<"from" | "to">("from");

  const [rate, setRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);

  // Pedir rate al backend cuando cambian las monedas
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

  // Recalcular el dependiente al cambiar rate o el par
  useEffect(() => {
    if (!rate) {
      if (activeField === "from") setToAmount("");
      else setFromAmount("");
      return;
    }
    if (activeField === "from") {
      const n = Number(fromAmount);
      if (!fromAmount || !Number.isFinite(n)) { setToAmount(""); return; }
      setToAmount(String(n * rate));
    } else {
      const n = Number(toAmount);
      if (!toAmount || !Number.isFinite(n)) { setFromAmount(""); return; }
      setFromAmount(String(n / rate));
    }
  }, [rate, monedaOrigen, monedaDestino]);

  // Handlers de escritura
  const handleFromChange = (value: string) => {
    setActiveField("from");
    setFromAmount(value);
    const n = Number(value);
    if (!rate || value === "" || !Number.isFinite(n)) { setToAmount(""); return; }
    setToAmount(String(n * rate));
  };

  const handleToChange = (value: string) => {
    setActiveField("to");
    setToAmount(value);
    const n = Number(value);
    if (!rate || value === "" || !Number.isFinite(n)) { setFromAmount(""); return; }
    setFromAmount(String(n / rate));
  };

  // Solo para mostrar (no tocar estado)
  const pretty = (v: string) => {
    const n = Number(v);
    return !Number.isFinite(n) ? v : n.toFixed(6);
  };

  const lastUpdatedText = useMemo(() => {
    if (!rates?.as_of_unix) return "-";
    return new Date(rates.as_of_unix * 1000).toLocaleString();
  }, [rates?.as_of_unix]);

  return (
    <div className="items-center justify-center w-full min-h-screen flex flex-col gap-6 px-4">
      <h1 className="font-extrabold text-emerald-500 text-4xl lg:text-5xl">Coinvert</h1>
      <h3 className="text-base lg:text-lg text-center max-w-[90%]">
        Your free currency conversion tool
      </h3>

      {/* ORIGEN */}
      <CurrencyDropdown
        currencyName={monedaOrigen}
        onChange={setMonedaOrigen}
        amount={activeField === "from" ? fromAmount : pretty(fromAmount)}
        onAmountChange={handleFromChange}
      />

      {/* SWAP */}
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

      {/* DESTINO */}
      <CurrencyDropdown
        currencyName={monedaDestino}
        onChange={setMonedaDestino}
        amount={activeField === "to" ? toAmount : pretty(toAmount)}
        onAmountChange={handleToChange}
      />

      {/* Ratio y metadata */}
      <p className="text-sm">
        1 {monedaOrigen} = {loadingRate ? "…" : (rate ? rate.toFixed(6) : "—")} {monedaDestino}
      </p>
      <p className="text-xs text-neutral-500">
        Last updated: {lastUpdatedText} {isSnapshotFresh() ? "" : <span className="text-amber-500 ml-1">stale</span>}
      </p>
    </div>
  );
}
