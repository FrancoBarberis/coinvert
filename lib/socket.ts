
// lib/socket.ts
import { io, Socket } from "socket.io-client";

const isBrowser = () => typeof window !== "undefined";

let socket: Socket | null = null;

function requiredEnv(name: string): string {
  const val = process.env[name as keyof typeof process.env] as string | undefined;
  if (!val) {
    // En cliente, además logueamos en consola
    if (isBrowser()) {
      // @ts-ignore
      console.error(`[socket] Falta variable pública ${name}`);
    }
    throw new Error(`Missing env ${name}`);
  }
  return val;
}

/**
 * Tomamos SIEMPRE la URL desde NEXT_PUBLIC_SOCKET_URL.
 * Sin fallback a localhost en producción para no “colarnos”.
 */
const SOCKET_URL = (() => {
  // En cliente, las NEXT_PUBLIC_* están “incrustadas” en el bundle
  return requiredEnv("NEXT_PUBLIC_SOCKET_URL");
})();

const SOCKET_PATH = process.env.NEXT_PUBLIC_SOCKET_PATH || "/socket.io";

export function getSocket(): Socket {
  if (!isBrowser()) {
    throw new Error("getSocket() sólo puede usarse del lado del cliente");
  }
  if (!socket) {
    socket = io(SOCKET_URL, {
      path: SOCKET_PATH,
      // Durante diagnóstico dejamos ambos; luego podés forzar ["websocket"]
      transports: ["websocket", "polling"],
      autoConnect: true,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 500,
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err?.message || err);
    });
  }
  return socket;
}

export function closeSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
