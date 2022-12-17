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

export const getServerBootstrapFactory = (): (() => [
  ServerBootstrap,
  () => void
]) => {
  const messages: Message[] = [];
  const allMessageCallbacks: DelayedMessageCallback[] = [];
  const allDMMessageCallbacks: Record<string, DelayedMessageCallback> = {};

  return () => {
    let thisMessageCallback: DelayedMessageCallback | null = null;
    let thisName: string | null = null;
    const onEnd = () => {
      d("check whether we must remove this connection's callback");
      if (thisMessageCallback !== null) {
        d("get idx");
        const idx = allMessageCallbacks.indexOf(thisMessageCallback);
        d("splice array");
        allMessageCallbacks.splice(idx, 1);
        d("we now have %d callbacks", allMessageCallbacks.length);
      }
      d("check whether we must remove this connection's dm callback");
      if (thisName !== null) {
        d("yes, remove it.");
        delete allDMMessageCallbacks[thisName];
      }
    };
    return [
      Far("server-bootstrap", {
        login(
          name: string,
          inputMessageCallback: MessageCallback,
          dmMessageCallback: MessageCallback
        ) {
          d("got login from %s", name);
          thisMessageCallback = E(inputMessageCallback);
          const thisDMMessageCallback = E(dmMessageCallback);
          thisName = name;
          allMessageCallbacks.push(thisMessageCallback);
          allDMMessageCallbacks[name] = thisDMMessageCallback;
          return Far("connection", {
            async write(line: string) {
              const message: Message = {
                from: name,
                to: null,
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
            dmTo(to, line) {
              const message = {
                id: uuidv4(),
                from: name,
                to,
                line,
                timestamp: new Date().toISOString(),
              };
              allDMMessageCallbacks[to](message);
              allDMMessageCallbacks[name](message); // send also to the sender!
              return Promise.resolve();
            },
          });
        },
      }),
      onEnd,
    ];
  };
};
