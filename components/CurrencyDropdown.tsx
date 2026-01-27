
"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CURRENCY_CODES as currencyCodes } from "../data/currency-codes";
import { currencyToFlagIconCode } from "@/utils/currency-to-flag";
import { sanitizeWhileTyping, formatMinimalDecimals } from "@/utils/format-minimal-decimals";

type CurrencyDropdownProps = {
  currencyName: string;
  onChange?: (code: string) => void;
  options?: string[];
  amount: string;
  onAmountChange: (v: string) => void;
};

export default function CurrencyDropdown({
  currencyName,
  onChange,
  options,
  amount,
  onAmountChange,
}: CurrencyDropdownProps) {
  const codes = options ?? currencyCodes;

  const flagCode = currencyToFlagIconCode(currencyName); // "ar" | "us" | "eu" | null

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
                {/* Bandera SVG (flag-icons) o fallback 💱 */}
                {flagCode ? (
                  <span className={`fi fi-${flagCode} w-5 h-5`} aria-hidden />
                ) : (
                  <span className="text-neutral-100/80" aria-hidden>💱</span>
                )}
                <span>{currencyName}</span>
              </span>
              <span aria-hidden>▾</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={6}
            className="
              w-56 max-h-64 overflow-auto
              bg-white text-neutral-900
              dark:bg-neutral-900 dark:text-neutral-100
              z-50
            "
          >
            {codes.map((code) => {
              const c = currencyToFlagIconCode(code);
              return (
                <DropdownMenuItem
                  key={code}
                  onClick={() => onChange?.(code)}
                  className="font-medium text-[.9rem] cursor-pointer flex items-center gap-2"
                >
                  {c ? <span className={`fi fi-${c}`} aria-hidden /> : <span aria-hidden>💱</span>}
                  <span>{code}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Input unido al trigger: decimales mínimos */}
        <input
          type="text"            // control total del string
          inputMode="decimal"    // teclado decimal en mobile
          value={amount}
          onFocus={(e) => {
            const input = e.currentTarget;
            setTimeout(() => input.select(), 0);
          }}
          onChange={(e) => {
            const next = sanitizeWhileTyping(e.target.value); // permite "1.", ".5", etc.
            onAmountChange(next);
          }}
          onBlur={(e) => {
            const normalized = formatMinimalDecimals(e.target.value); // "solo los decimales necesarios"
            onAmountChange(normalized);
          }}
          className="
            h-12 w-full m-0
            text-right text-lg pr-3
            bg-white text-neutral-900
            border border-t-green-700 border-t-2
            rounded-bl-md
            rounded-br-md
            dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700
          "
          placeholder="0"
        />
      </div>
    </div>
  );
}
