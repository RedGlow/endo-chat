export interface Message {
  id: string; // uuid
  from: string;
  to: string | null;
  timestamp: string; // in ISO format
  line: string;
}

export type MessageCallback = (message: Message) => void;

export interface ServerBootstrap {
  login(
    name: string,
    messageCallback: MessageCallback,
    dmMessageCallback: MessageCallback
  ): {
    /**
     * Get the last N messages (usually 10?).
     */
    getLastMessages(): Message[];
    /**
     * Write a line in the main chat.
     * @param line the line to write
     */
    write(line: string): Promise<void>;
    /**
     * Message to write to someone
     * @param to recipient of the message
     * @param line line to write
     */
    dmTo(to: string, line: string): Promise<void>;
  };
}
