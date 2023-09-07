import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.REACT_APP_WEBSOCKET_URL;

export const socket = (roomId) => io(URL, { query: { roomId } });
