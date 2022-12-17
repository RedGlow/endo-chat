import React, { useCallback, useState } from "react";
import { memo } from "react";
import { LoginMethod } from ".";
import { Message } from "../../server-bootstrap-interface";
import { useMainChat } from "../state/main-chat";
import { ChatMessages } from "./chat-messages";
import { Login } from "./login";
import { WriteLine } from "./write-line";

export interface RootProps {
  login: LoginMethod;
}

enum LoginState {
  NotLoggedIn,
  LoggingIn,
  LoggedIn,
}

type NotLoggedInState = { type: LoginState.NotLoggedIn };
const notLoggedInState: NotLoggedInState = { type: LoginState.NotLoggedIn };
type LoggingInState = { type: LoginState.LoggingIn };
const loggingInState: LoggingInState = { type: LoginState.LoggingIn };
type LoggedInState = {
  type: LoginState.LoggedIn;
  iface: {
    getLastMessages: () => Promise<Message[]>;
    write: (line: string) => Promise<void>;
  };
};
type State = NotLoggedInState | LoggingInState | LoggedInState;

export const Root = memo(function Root({ login }: RootProps) {
  const [state, setState] = useState<State>(notLoggedInState);
  const mainChat = useMainChat();

  const onLogin = useCallback(
    (loginName: string) => {
      setState(loggingInState);
      login(loginName, mainChat.appendMessage)
        .then((iface) => {
          setState({ type: LoginState.LoggedIn, iface });
        })
        .catch((err) => {
          setState(notLoggedInState);
          console.error(err);
        });
    },
    [mainChat.appendMessage]
  );

  return state.type === LoginState.LoggingIn ? <p>Logging in...</p> : state.type === LoginState.NotLoggedIn ? (
    <Login onLogin={onLogin} />
  ) : (
    <>
      <ChatMessages getLastMessages={state.iface.getLastMessages} />
      <WriteLine write={state.iface.write} />
    </>
  );
});
