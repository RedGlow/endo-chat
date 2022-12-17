import isomorphicWs from "isomorphic-ws";
import { Connection, createConn } from "../message-passing-base.js";

const { WebSocketServer } = isomorphicWs;

export function createConnectionServer(
  hostname: string,
  port: number,
  onConnection: (connection: Connection) => void
) {
  const wss = new WebSocketServer({ host: hostname, port });
  wss.on("connection", (ws) => {
    const conn: Connection = createConn(ws);
    onConnection(conn);
  });
}