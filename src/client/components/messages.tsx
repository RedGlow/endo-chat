import { format } from "date-fns";
import React, { useCallback } from "react";
import { memo } from "react";
import { Message } from "../../server-bootstrap-interface";
import useIntentionallyOpenedChats from "../state/use-intentionally-opened-chats";

export interface MessagesProps {
  messages: Message[];
}

export const Messages = memo(function Messages({ messages }: MessagesProps) {
  return (
    <div className="chat_messages__container">
      {messages.map((message) => (
        <MessageComponent key={message.id} message={message} />
      ))}
    </div>
  );
});

interface MessageComponentProps {
  message: Message;
}

const MessageComponent = memo(function MessageComponent({
  message,
}: MessageComponentProps) {
  const intentionallyOpenedChats = useIntentionallyOpenedChats();
  const onAuthorClick = useCallback(() => {
    intentionallyOpenedChats.addName(message.from);
  }, [intentionallyOpenedChats, message]);
  return (
    <p key={message.id} className="chat_messages__entry">
      <span className="chat_messages__timestamp">
        [{format(new Date(message.timestamp), "dd/MM HH:mm")}]
      </span>
      <span className="chat_messages__author" onClick={onAuthorClick}>
        {message.from}
      </span>
      :<span className="chat_messages__line">{message.line}</span>
    </p>
  );
});
