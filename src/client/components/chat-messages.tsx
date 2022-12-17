import { format } from "date-fns";
import React, { useEffect } from "react";
import { memo } from "react";
import { Message } from "../../server-bootstrap-interface";
import { useMainChat } from "../state/main-chat";

export interface ChatMessagesProps {
  getLastMessages(): Promise<Message[]>;
}

export const ChatMessages = memo(function ChatMessages({
  getLastMessages,
}: ChatMessagesProps) {
  const { messages, prependAllMessages } = useMainChat();

  useEffect(() => {
    getLastMessages().then(prependAllMessages).catch(console.error);
  }, []);

  return (
    <div className="chat_messages__container">
      {messages.map((message) => (
        <p key={message.id} className="chat_messages__entry">
          <span className="chat_messages__timestamp">
            [{format(new Date(message.timestamp), "dd/MM HH:mm")}]
          </span>
          <span className="chat_messages__author">{message.from}</span>:
          <span className="chat_messages__line">{message.line}</span>
        </p>
      ))}
    </div>
  );
});
