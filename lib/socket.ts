
// lib/socket.ts
"use client";

import { io, Socket } from "socket.io-client";

const isBrowser = () => typeof window !== "undefined";

// Lee con CLAVES ESTÁTICAS → Next inlinea en build
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL as string | undefined;
const SOCKET_PATH = process.env.NEXT_PUBLIC_SOCKET_PATH ?? "/socket.io";

// Validación segura (en cliente) sin tocar process dinámicamente
if (!SOCKET_URL) {
  if (isBrowser()) console.error("[socket] Falta variable pública NEXT_PUBLIC_SOCKET_URL");
  throw new Error("Missing env NEXT_PUBLIC_SOCKET_URL");
}

// --- Singleton HMR-safe ---
declare global {
  // eslint-disable-next-line no-var
  var __APP_SOCKET__: Socket | undefined;
}

export function getSocket(): Socket {
  if (!isBrowser()) {
    throw new Error("getSocket() sólo puede usarse del lado del cliente");
  }

  if (!globalThis.__APP_SOCKET__) {
    const socket = io(SOCKET_URL, {
      path: SOCKET_PATH,
      transports: ["websocket"],   // agrega "polling" si necesitás diagnosticar
      withCredentials: false,      // ponelo en true si usás cookies/sesión
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 800,
      closeOnBeforeunload: true,
    });

    socket.on("connect", () => console.log("[socket] connected", socket.id));
    socket.on("connect_error", (err) =>
      console.error("[socket] connect_error:", err?.message || err)
    );
    socket.on("disconnect", (reason) =>
      console.warn("[socket] disconnect:", reason)
    );

    globalThis.__APP_SOCKET__ = socket;
  }

  return globalThis.__APP_SOCKET__!;
}

export function closeSocket() {
  const s = globalThis.__APP_SOCKET__;
  if (s) {
    try {
      s.removeAllListeners();
      s.disconnect();
    } finally {
      globalThis.__APP_SOCKET__ = undefined;
    }
  }
}
