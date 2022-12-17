import WebSocket from "isomorphic-ws";
import debug from "debug";

const d = debug("message-passing");

export interface Connection {
  send(obj: Record<string, any>): void;
  onReceive: (obj: any) => void;
  onEnd: () => void;
}

enum ReadStateType {
  ReadingLength,
  ReadingData,
}

interface ConnectionReadingLengthState {
  type: ReadStateType.ReadingLength;
}

interface ConnectionReadingDataState {
  type: ReadStateType.ReadingData;
  length: number;
}

type ConnectionState =
  | ConnectionReadingLengthState
  | ConnectionReadingDataState;

export function createConn(ws: WebSocket) {
  const conn: Connection = {
    send(obj) {
      d("sending %O", obj);
      const json = JSON.stringify(obj);
      const dataBuffer = Buffer.from(json, "utf-8");
      d("sending an object %d bytes long", dataBuffer.length);

      if (dataBuffer.length > 2 ** 32) {
        throw new Error("Cannot send an object so big");
      }
      const lengthBuffer = Buffer.alloc(4);
      lengthBuffer.writeUInt32LE(dataBuffer.length);
      const finalBuffer = Buffer.concat([lengthBuffer, dataBuffer]);
      const flushed = ws.send(finalBuffer);
      d(
        "sent %d total bytes on socket, flushed? %o",
        finalBuffer.length,
        flushed
      );
    },
    onEnd() {},
    onReceive(obj) {},
  };
  let unprocessed = Buffer.from([]);
  let connectionState: ConnectionState = { type: ReadStateType.ReadingLength };
  ws.addEventListener("message", (ev) => {
    // client implementation will get an ArrayBuffer - because we set socket.binaryType = "arraybuffer" -
    // whereas server implementation will get a Buffer.
    // so much for isomorphism, isomorphic-ws.
    const data = ev.data instanceof ArrayBuffer ? Buffer.from(ev.data) : ev.data as Buffer;
    d("received %d bytes.", data.length);
    unprocessed = Buffer.concat([unprocessed, data]);
    var readSomething = false;
    do {
      readSomething = false;
      if (
        connectionState.type === ReadStateType.ReadingLength &&
        unprocessed.length >= 4
      ) {
        readSomething = true;
        const length = unprocessed.readUint32LE(0);
        d("read length %d", length);
        unprocessed = unprocessed.subarray(4);
        connectionState = {
          type: ReadStateType.ReadingData,
          length,
        };
      } else if (
        connectionState.type === ReadStateType.ReadingData &&
        unprocessed.length >= connectionState.length
      ) {
        readSomething = true;
        const data = unprocessed.subarray(0, connectionState.length);
        d("read %d bytes", data.length);
        unprocessed = unprocessed.subarray(connectionState.length);
        const str = data.toString("utf-8");
        const obj = JSON.parse(str);
        connectionState = {
          type: ReadStateType.ReadingLength,
        };
        if (conn.onReceive) {
          d("sending to onReceive callback: %O", obj);
          conn.onReceive(obj);
        }
      }
    } while (readSomething);
  });
  ws.addEventListener("close", () => {
    d("received close event");
    conn.onEnd();
  });
  return conn;
}
