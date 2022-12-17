import { E } from "@endo/captp";
import { Far } from "@endo/marshal";
import debug from "debug";
import { v4 as uuidv4 } from "uuid";
import {
  Message,
  MessageCallback,
  ServerBootstrap,
} from "../server-bootstrap-interface.js";

const d = debug("server-bootstrap");

type DelayedMessageCallback = (message: Message) => Promise<void>;

export const getServerBootstrapFactory = (): (() => [ServerBootstrap, () => void]) => {
  const messages: Message[] = [];
  const allMessageCallbacks: DelayedMessageCallback[] = [];

  return () => {
    let thisMessageCallback: DelayedMessageCallback | null = null;
    const onEnd = () => {
      d("check whether we must remove this connection's callback");
      if (thisMessageCallback !== null) {
        d("yes: find index...");
        const idx = allMessageCallbacks.indexOf(thisMessageCallback);
        d("at index %d", idx);
        allMessageCallbacks.splice(idx, 1);
        d("we now have %d callbacks", allMessageCallbacks);
      }
    };
    return [
      Far("server-bootstrap", {
        login(name: string, inputMessageCallback: MessageCallback) {
          d("got login from %s", name);
          thisMessageCallback = E(inputMessageCallback);
          allMessageCallbacks.push(thisMessageCallback);
          return Far("connection", {
            async write(line: string) {
              const message: Message = {
                from: name,
                line,
                id: uuidv4(),
                timestamp: new Date().toISOString(),
              };
              messages.push(message);
              d("received message %O, sending to everyone...", message);
              await Promise.all(
                allMessageCallbacks.map((mc) =>
                  mc(message).catch(console.error)
                )
              );
              d("line sent to everyone.");
            },
            getLastMessages() {
              d(
                "reading the last 10 messages from a total list of %d",
                messages.length
              );
              return messages.slice(-10);
            },
          });
        },
      }),
      onEnd,
    ];
  };
};
