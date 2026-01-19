
"use client";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Si exportaste con nombre en tu archivo:
//   export const CURRENCY_CODES = [...];
// entonces este import es correcto:
import { CURRENCY_CODES as currencyCodes } from "../data/currency-codes";

type CurrencyDropdownProps = {
    /** Código seleccionado actual (ej.: "ARS") */
    currencyName: string;
    /** Callback al elegir una moneda en el menú */
    onChange?: (code: string) => void;
    /** Lista opcional para sobrescribir los códigos (si vienen del socket/snapshot) */
    options?: string[];
};

export default function CurrencyDropdown({
    currencyName,
    onChange,
    options,
}: CurrencyDropdownProps) {
    const codes = options ?? currencyCodes;

    return (

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-28 justify-between text-neutral-900 bg-white border-neutral-200 hover:bg-neutral-50 dark:text-neutral-100 dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-neutral-800" >
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
        "
            >
                {codes.map((code) => (
                    <DropdownMenuItem
                        key={code}
                        onClick={() => onChange?.(code)}
                        className={code === currencyName ? "font-semibold" : undefined}
                    >
                        {code}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>

        </DropdownMenu>

    );
}
