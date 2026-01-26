
"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CURRENCY_CODES as currencyCodes } from "../data/currency-codes";
import { currencyToFlagEmoji } from "@/utils/currency-to-flag";

type CurrencyDropdownProps = {
  currencyName: string;
  onChange?: (code: string) => void;
  options?: string[];
  amount: string;
  onAmountChange: (v: string) => void;
};

//TEST ENV
export function ExposeEnv() {
  if (typeof window !== "undefined") {
    (window as any).__SOCKET_DEBUG__ = {
      URL: process.env.NEXT_PUBLIC_SOCKET_URL,
      PATH: process.env.NEXT_PUBLIC_SOCKET_PATH,
    };
    console.log("[ExposeEnv] window.__SOCKET_DEBUG__ listo");
  }
  return null;
}


export default function CurrencyDropdown({
  currencyName,
  onChange,
  options,
  amount,
  onAmountChange
}: CurrencyDropdownProps) {
  const codes = options ?? currencyCodes;

  return (
    <div className="mx-auto w-[90%] lg:w-[40%]">
      {/* Grupo unido: trigger + input */}
      <div className="flex flex-col gap-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="
                h-12 w-full m-0
                justify-between
                text-neutral-900 border border-neutral-200
                rounded-b-none
                hover:cursor-pointer
                bg-emerald-500
                hover:bg-emerald-400
                dark:text-neutral-100 dark:bg-neutral-900 dark:border-neutral-700
                dark:hover:bg-neutral-800
              "
            >

              <span className="font-semibold flex items-center gap-2">
                <span className="emoji text-base">
                  {currencyToFlagEmoji(currencyName)}
                </span>
                <span>{currencyName}</span>
              </span>

              <span aria-hidden>▾</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={6}
            className="
              w-48 max-h-64 overflow-auto
              bg-white text-neutral-900
              dark:bg-neutral-900 dark:text-neutral-100
              z-50
            "
          >
            {codes.map((code) => (
              <DropdownMenuItem
                key={code}
                onClick={() => onChange?.(code)}
                className="font-medium text-[.8rem] cursor-pointer"
              >
                {code}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Input unido al trigger */}
        <input
          type="number"
          value={amount}
          onFocus={(e) => {
            const input = e.currentTarget;
            // Esperar al siguiente tick evita peleas con el focus en algunos browsers
            setTimeout(() => {
              input.select();
            }, 0);
          }}
          onChange={(e) => onAmountChange(e.target.value)}
          min={0}
          className="
            h-12 w-full m-0
            text-right text-lg pr-3
            bg-white text-neutral-900
            border border-t-green-700 border-t-2
            rounded-bl-md
            rounded-br-md
            dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700
          "
        />
      </div>
    </div>
  );
}
