
// lib/socket.ts
import { io, Socket } from "socket.io-client";

const isBrowser = () => typeof window !== "undefined";

let socket: Socket | null = null;

const DEFAULT_URL =
  (isBrowser() ? (window as any).__SOCKET_URL__ : process.env.NEXT_PUBLIC_SOCKET_URL) ||
  "http://127.0.0.1:4000";

const DEFAULT_PATH = process.env.NEXT_PUBLIC_SOCKET_PATH || "/socket.io";

export function getSocket(): Socket {
  if (!isBrowser()) {
    throw new Error("getSocket() sólo puede usarse del lado del cliente");
  }
  if (!socket) {
    socket = io(DEFAULT_URL, {
      path: DEFAULT_PATH,
      // Para diagnóstico y compatibilidad dejamos ambos. Luego, si querés, podés forzar ["websocket"].
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
