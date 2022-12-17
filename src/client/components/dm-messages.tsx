import React, { useCallback, useState } from "react";
import { memo } from "react";
import { useMainChat } from "../state/main-chat";
import useUsername from "../state/use-username";
import { Messages } from "./messages";
import { WriteLine } from "./write-line";

export interface DMMessagesProps {
  withPerson: string;
  dmTo(to: string, line: string): Promise<void>;
}

export const DMMessages = memo(function DMMessages({
  withPerson,
  dmTo,
}: DMMessagesProps) {
  const username = useUsername((state) => state.username);
  const messages = useMainChat((state) =>
    state.dms.filter(
      (dm) =>
        (dm.from === withPerson && dm.to === username) ||
        (dm.to === withPerson && dm.from === username)
    )
  );
  // const appendDM = useMainChat((state) => state.appendDM);
  const write = useCallback((line: string) => dmTo(withPerson, line), [dmTo]);
  return (
    <>
      <Messages messages={messages} />
      <WriteLine write={write} />
    </>
  );
});
