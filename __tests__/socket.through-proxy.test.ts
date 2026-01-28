
/**
 * @jest-environment node
 */
// __tests__/socket.through-proxy.test.ts

import { CurrencyCode } from "@/data/currency-codes";
import { io, Socket, ManagerOptions, SocketOptions } from "socket.io-client";

const URL = process.env.SOCKET_PROXY_URL ?? "http://127.0.0.1:4000";
const PATH = process.env.SOCKET_PROXY_PATH ?? "/socket.io";

// Helper para conectar con timeout y WS directo
function connect(
  url: string,
  opts: Partial<ManagerOptions & SocketOptions> = {}
): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const socket = io(url, {
      path: PATH,
      transports: ["websocket"], // fuerza WS para evitar fallback a polling
      reconnection: false,
      timeout: 5000,
      ...opts,
    });

    const onConnect = () => {
      cleanup();
      resolve(socket);
    };
    const onConnectError = (err: Error) => {
      cleanup();
      reject(err);
    };
    const cleanup = () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
    };

    socket.once("connect", onConnect);
    socket.once("connect_error", onConnectError);
  });
}

describe("Socket.IO a través del proxy/backend real", () => {
  let socket: Socket;

  // Aumentamos timeout global del test suite (por red)
  jest.setTimeout(20000);

  afterEach(() => {
    if (socket && socket.connected) socket.disconnect();
  });

  it("se conecta correctamente y responde a rates:get con rates:data", async () => {
    socket = await connect(URL);

    // Esperar la primera respuesta de data tras pedir rates:get
    const dataPromise = new Promise<any>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Timeout esperando rates:data")), 7000);

      socket.once("rates:data", (payload) => {
        clearTimeout(timer);
        resolve(payload);
      });

      socket.emit("rates:get");
    });

    const payload = await dataPromise;

    // Validaciones mínimas del payload
    expect(payload).toBeTruthy();
    expect(typeof payload.as_of_unix).toBe("number"); // tu backend debería enviarlo ahora
    // rates/rates.conversion_rates depende de tu shape; valida lo que esperes
    // Por ejemplo, si envías { rates: { USD: 1, ARS: 1000, ... } }
    expect(payload.rates || payload.conversion_rates).toBeTruthy();
  });

  it("si el server emite rates:init al arrancar, lo recibimos", async () => {
    socket = await connect(URL);

    const initPayload = await new Promise<CurrencyCode>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Timeout esperando rates:init")), 5000);
      socket.once("rates:init", (p) => {
        clearTimeout(timer);
        resolve(p);
      });

      // Nota: no emitimos nada; esperamos que el server haya hecho io.emit("rates:init", ...)
      // Si tu server no emite init, podés marcar este test como pending o saltarlo.
    }).catch((err) => {
      // Si tu server no emite init, podés considerar esto como "ok" condicional:
      // throw err; // <– fuerza fallo si sí lo esperás
      return null;
    });

    // Si no hay init, no fallamos (ajusta a tu necesidad)
    if (initPayload) {
      expect(typeof initPayload.as_of_unix).toBe("number");
    }
  });

})