import { Far } from "@endo/marshal";
import { Message } from "../server-bootstrap-interface";
import { useMainChat } from "./state/main-chat";

export interface ClientBootstrap {
  dm(message: Message): void;
}

export const clientBootstrap = (): ClientBootstrap =>
  Far("client-bootstrap", {
    dm(message: Message) {
      useMainChat.setState((state) => ({
        ...state,
        dms: [...state.dms, message],
      }));
    },
  });
