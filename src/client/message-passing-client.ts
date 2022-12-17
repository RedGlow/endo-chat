import WebSocket from "isomorphic-ws";
import { Connection, createConn } from "../message-passing-base";

export function createConnectionClient(
  hostname: string,
  port: number
): Promise<Connection> {
  const socket = new WebSocket(`ws://${hostname}:${port}`);
  socket.binaryType = "arraybuffer";
  const conn = createConn(socket);
  return new Promise((resolve) =>
    socket.addEventListener("open", () => resolve(conn))
  );
}
