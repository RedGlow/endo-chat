import React, { ChangeEvent, useCallback, useState } from "react";
import { memo } from "react";

export interface WriteLineProps {
  write: (line: string) => Promise<void>;
}

export const WriteLine = memo(function WriteLine({ write }: WriteLineProps) {
  const [text, setText] = useState("");
  const [disabled, setDisabled] = useState(false);

  const onTextChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setText(ev.target.value);
  }, []);

  const onSendClick = useCallback(() => {
    setDisabled(true);
    setText("");
    write(text)
      .catch(console.error)
      .then(() => {
        setDisabled(false);
      });
  }, [text]);

  return (
    <div>
      <span>Write a message:</span>
      <input
        type="text"
        value={text}
        onChange={onTextChange}
        disabled={disabled}
      />
      <button
        role="button"
        type="button"
        onClick={onSendClick}
        disabled={disabled}
      >
        Send
      </button>
    </div>
  );
});
