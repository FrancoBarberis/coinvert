
// utils/format-minimal-decimals.ts

/**
 * Convierte un string numérico a su representación con
 * SOLO los decimales necesarios:
 *  - "1.2300" -> "1.23"
 *  - "2.0"    -> "2"
 *  - "003.400"-> "3.4"
 *  - ".500"   -> "0.5"
 *  - "0."     -> "0"   (si se llama en blur/confirmación)
 *
 * Si no es un número válido, retorna el string original.
 */
export function formatMinimalDecimals(raw: string): string {
  if (raw == null) return "";

  let s = raw.trim();

  // Vacíos o solo punto
  if (s === "" || s === ".") return s;

  // Reemplazar coma por punto si querés soportar locales
  // s = s.replace(",", ".");

  // Permitir un sign opcional
  const sign = s.startsWith("-") ? "-" : "";
  if (sign) s = s.slice(1);

  // Validar patrón simple: dígitos con punto opcional y más dígitos
  if (!/^\d*\.?\d*$/.test(s)) return raw;

  // Normalizar: "003.400" -> "3.400"  | "000" -> "0"
  let [intPart, decPart = ""] = s.split(".");
  intPart = intPart.replace(/^0+(?=\d)/, ""); // quita ceros a la izquierda
  if (intPart === "") intPart = "0";

  if (decPart === "") {
    // Sin decimales o "1." -> "1" (solo en blur/confirmación)
    return sign + intPart;
  }

  // Quitar ceros de la cola en la parte decimal: "2300" -> "23"
  decPart = decPart.replace(/0+$/, "");

  // Si no queda nada en los decimales -> número entero
  if (decPart === "") return sign + intPart;

  return sign + intPart + "." + decPart;
}

/**
 * Sanitiza mientras se tipea (onChange):
 * - Evita más de un punto y caracteres no numéricos.
 * - Permite estados intermedios como "1." o "-"
 */
export function sanitizeWhileTyping(raw: string): string {
  let s = raw.replace(",", ".");           // opcional
  s = s.replace(/[^\d.\-]/g, "");          // solo dígitos, punto, signo
  // Mantener un solo signo al principio
  s = s.replace(/(?!^)-/g, "");
  // Mantener un solo punto
  const firstDot = s.indexOf(".");
  if (firstDot !== -1) {
    s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, "");
  }
  return s;
}
