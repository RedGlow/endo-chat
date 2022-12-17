import React from "react";
import { createRoot } from "react-dom/client";
import { Message, MessageCallback, ServerBootstrap } from "../../server-bootstrap-interface";
import { Root } from "./root";

export type LoginMethod = (username: string, messageCallback: MessageCallback) => Promise<{
  getLastMessages(): Promise<Message[]>;
  write(line: string): Promise<void>;
  dmTo(to: string, line: string): Promise<void>
}>

export function mount(login: LoginMethod) {
  var rootElement = document.getElementById("root");
  if (rootElement === null) {
    throw new Error("Cannot find root DOM element.");
  }
  const root = createRoot(rootElement);
  root.render(<Root login={login}/>);
}
