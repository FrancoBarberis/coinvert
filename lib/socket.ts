//lib/socket.ts
import { io, Socket } from "socket.io-client";

// Para evitar que se inicialice en SSR:
const isBrowser = typeof window !== "undefined";

let socket: Socket | null = null;

export type SocketAuth = {
    token?: string;
};

const DEFAULT_URL = (isBrowser ? (window as any).__SOCKET_URL__ : process.env.NEXT_PUBLIC_SOCKET_URL) || "http://localhost:3000";

const DEFAULT_PATH = process.env.NEXT_PUBLIC_SOCKET_PATH || "/socket.io";

//Singleton initializer
export function getSocket(
    url: string = DEFAULT_URL,
    auth?: SocketAuth
): Socket {
    if (!isBrowser) {
        throw new Error("Socket must be used in client browser");
    } if (!socket) {
        socket = io(url, {
            path: DEFAULT_PATH,
            transports: ["websocket"],
            autoConnect: true,
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 500,
            auth,
        })

        socket.on("connect", () => {
            console.log("Socket conectado:", socket?.id);
        });
        socket.on("connect_error", (err) => {
            console.error("Socket connect error", err.message);
        });
        socket.on("disconnect", (reason) => {
            console.warn("Socket disconnected", reason);
        });
    }
    return socket;
}
//Helper to close socket after the app is closed
export function closeSocke() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
