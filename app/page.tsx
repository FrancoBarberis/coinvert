import CurrencyDropdown from "@/components/CurrencyDropdown";

export default function Home() {
  return (
    <div className="items-center justify-center w-full h-full flex flex-col ">
      <h1>Coinvert</h1>
      <CurrencyDropdown currencyName="USD"></CurrencyDropdown>
      <CurrencyDropdown currencyName="ARS"></CurrencyDropdown>
    </div>
  );
}
