import create from "zustand";
import { Message } from "../../server-bootstrap-interface";

export interface MainChat {
  messages: Message[];
  dms: Message[];
  appendMainChatMessage(message: Message): void;
  mergeMainChatMessages(messages: Message[]): void;
  appendDM(message: Message): void;
}

export const useMainChat = create<MainChat>((set) => ({
  messages: [],
  dms: [],
  mergeMainChatMessages: (messages: Message[]) =>
    set((state) => {
      const existingIds = new Set(state.messages.map((m) => m.id));
      const messagesToAdd = messages.filter(({ id }) => !existingIds.has(id));
      return {
        ...state,
        messages: [...messagesToAdd, ...state.messages],
      };
    }),
  appendMainChatMessage: (message: Message) =>
    set((state) => ({
      ...state,
      messages: [...state.messages, message],
    })),
  appendDM: (message: Message) =>
    set((state) => ({
      ...state,
      dms: [...state.dms, message],
    })),
}));
