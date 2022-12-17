import debug from "debug";
import React, { useEffect } from "react";
import { memo } from "react";
import { Message } from "../../server-bootstrap-interface";
import { useMainChat } from "../state/main-chat";
import { Messages } from "./messages";

const d = debug("chat-messages");

export interface ChatMessagesProps {
  getLastMessages(): Promise<Message[]>;
}

export const ChatMessages = memo(function ChatMessages({
  getLastMessages,
}: ChatMessagesProps) {
  const { messages, mergeMainChatMessages: mergeMessages } = useMainChat();

  useEffect(() => {
    getLastMessages().then(mergeMessages).catch(console.error);
  }, []);

  return <Messages messages={messages} />;
});
