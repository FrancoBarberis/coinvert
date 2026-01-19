import {create} from "zustand";

interface AppState {
    monedaOrigen: string;
    monedaDestino: string;
    setMonedaOrigen: (moneda: string) => void;
    setMonedaDestino: (moneda: string) => void;
}

const useAppStore = create<AppState>(() => ({
    monedaOrigen: "USD",
    monedaDestino: "ARS",
    setMonedaOrigen: (moneda:string) => { useAppStore.setState({ monedaOrigen: moneda}); },
    setMonedaDestino: (moneda:string) => { useAppStore.setState({ monedaDestino: moneda}); },
}));

export default useAppStore; 