import {create} from "zustand";
import { ExchangeRatesSnapshot } from "@/types/exchange";

interface AppState {
    rates: ExchangeRatesSnapshot | null;
    monedaOrigen: string;
    monedaDestino: string;
    setMonedaOrigen: (moneda: string) => void;
    setMonedaDestino: (moneda: string) => void;
    invert: () => void;
    obtainRates: () => void;
}

const useAppStore = create<AppState>(() => ({
    rates: null,
    monedaOrigen: "USD",
    monedaDestino: "ARS",
    setMonedaOrigen: (moneda:string) => { useAppStore.setState({ monedaOrigen: moneda}); },
    setMonedaDestino: (moneda:string) => { useAppStore.setState({ monedaDestino: moneda}); },
    invert: () => {
        const currentOrigen = useAppStore.getState().monedaOrigen;
        const currentDestino = useAppStore.getState().monedaDestino;
        useAppStore.setState({ monedaOrigen: currentDestino, monedaDestino: currentOrigen });
    },
    obtainRates: () =>{
        return;
    }
}));

export default useAppStore; 