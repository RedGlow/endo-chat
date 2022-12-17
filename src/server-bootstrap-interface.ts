export interface Message {
  id: string; // uuid
  from: string;
  timestamp: string; // in ISO format
  line: string;
}

export type MessageCallback = (message: Message) => void;

export interface ServerBootstrap {
  login(
    name: string,
    messageCallback: MessageCallback
  ): {
    /**
     * Get the last N messages (usually 10?).
     */
    getLastMessages(): Message[];
    write(line: string): Promise<void>;
  };
}
