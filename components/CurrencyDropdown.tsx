
"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CURRENCY_CODES as currencyCodes } from "../data/currency-codes";

type CurrencyDropdownProps = {
  currencyName: string;
  onChange?: (code: string) => void;
  options?: string[];
};

export default function CurrencyDropdown({
  currencyName,
  onChange,
  options,
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
                text-neutral-900 bg-white border border-neutral-200
                rounded-b-none  /* une con el input */
                hover:bg-neutral-50
                dark:text-neutral-100 dark:bg-neutral-900 dark:border-neutral-700
                dark:hover:bg-neutral-800
              "
            >
              <span className="font-semibold">{currencyName}</span>
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
          type="text"
          placeholder="0"
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
