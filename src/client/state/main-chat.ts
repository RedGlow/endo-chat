import create from "zustand";
import { Message } from "../../server-bootstrap-interface";

export interface MainChat {
  messages: Message[];
  appendMessage(message: Message): void;
  prependAllMessages(messages: Message[]): void;
}

export const useMainChat = create<MainChat>((set) => ({
  messages: [] as Message[],
  prependAllMessages: (messages: Message[]) =>
    set((state) => ({
      ...state,
      messages: [...messages, ...state.messages],
    })),
  appendMessage: (message: Message) =>
    set((state) => ({
      ...state,
      messages: [...state.messages, message],
    })),
}));
