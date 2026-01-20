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

const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
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
    obtainRates: async () =>{
        try {
            const freshRates = await fetch(`${backend}/api/rates`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const jsonRates = await freshRates.json();
        useAppStore.setState( { rates:jsonRates})
        console.log(jsonRates)
        } catch (error) {
            console.log("Fetch error")
        }   
    }
}));

export default useAppStore; 