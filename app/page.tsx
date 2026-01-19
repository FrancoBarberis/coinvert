import CurrencyDropdown from "@/components/CurrencyDropdown";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="items-center justify-center w-full h-full flex flex-col text-5xl gap-10  ">
      <h1 className="font-extrabold text-emerald-500 mt-4">Coinvert</h1>
      <h3 className="text-lg text-center max-w-[90%]">Your free currency convertion tool</h3>
      <CurrencyDropdown currencyName="USD"></CurrencyDropdown>
      <Button>I</Button>
      <CurrencyDropdown currencyName="ARS"></CurrencyDropdown>
      <p className="text-2xl">1 USD = 1450 ARS</p>
      <p className="text-sm">Last updated: 1 min ago</p>
    </div>
  );
}
