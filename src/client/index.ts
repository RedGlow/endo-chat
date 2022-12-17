import "ses";
import "@endo/init";
import { v4 as uuidv4 } from "uuid";
import debug from "debug";
import { E, Far } from "@endo/captp";
import {
  Message,
  MessageCallback,
  ServerBootstrap,
} from "../server-bootstrap-interface";
import { runCapTP } from "../run-captp";
import { clientBootstrap } from "./client-bootstrap";
import { createConnectionClient } from "./message-passing-client";
import { mount } from "./components";
import { useMainChat } from "./state/main-chat";

const d = debug("client");

async function go() {
  d("creating connection...");
  const connection = await createConnectionClient("127.0.0.1", 9382);
  d("connection created!");
  const b: ServerBootstrap = await runCapTP(
    uuidv4(),
    connection,
    () => ({ bootstrap: clientBootstrap() }), // TODO: onEnd
    undefined
  );
  var bootstrap = E(b);
  const login = async (username: string, messageCallback: MessageCallback) => {
    const dm = (message: Message) => {
      useMainChat.setState((state) => ({
        ...state,
        dms: [...state.dms, message],
      }));
    }
    const i = E(
      await bootstrap.login(
        username,
        Far("messageCallback", messageCallback),
        Far("dmMessageCallback", dm)
      )
    );
    return {
      getLastMessages: () => i.getLastMessages(),
      write: (line: string) => i.write(line),
      dmTo: (to: string, line: string): Promise<void> => i.dmTo(to, line)
    };
  };

  mount(login);
}

go()
  .then(() => d("all done"))
  .catch(console.error);
