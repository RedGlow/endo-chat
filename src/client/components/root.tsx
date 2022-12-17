import { uniq } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { memo } from "react";
import { LoginMethod } from ".";
import { Unpromise } from "../../unpromise";
import { useMainChat } from "../state/main-chat";
import useIntentionallyOpenedChats from "../state/use-intentionally-opened-chats";
import useUsername from "../state/use-username";
import { ChatMessages } from "./chat-messages";
import { DMMessages } from "./dm-messages";
import { Login } from "./login";
import { Tabbed } from "./tabbed";
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
type IFace = Unpromise<ReturnType<RootProps["login"]>>;
type LoggedInState = {
  type: LoginState.LoggedIn;
  iface: IFace;
};
type State = NotLoggedInState | LoggingInState | LoggedInState;

export const Root = memo(function Root({ login }: RootProps) {
  const [state, setState] = useState<State>(notLoggedInState);
  const [loginName, setLoginName] = useState("");
  const mainChat = useMainChat();
  const setUsername = useUsername((state) => state.setUsername);

  const onLogin = useCallback(
    (loginName: string) => {
      setState(loggingInState);
      setLoginName(loginName);
      setUsername(loginName);
      login(loginName, mainChat.appendMainChatMessage)
        .then((iface) => {
          setState({ type: LoginState.LoggedIn, iface });
        })
        .catch((err) => {
          setState(notLoggedInState);
          console.error(err);
        });
    },
    [mainChat.appendMainChatMessage]
  );

  return state.type === LoginState.LoggingIn ? (
    <p>Logging in...</p>
  ) : state.type === LoginState.NotLoggedIn ? (
    <Login onLogin={onLogin} />
  ) : (
    <LoggedIn iface={state.iface} loginName={loginName} />
  );
});

const LoggedIn = memo(function LoggedIn({
  iface,
  loginName,
}: {
  iface: IFace;
  loginName: string;
}) {
  const username = useUsername((state) => state.username);
  const dms = useMainChat((state) => state.dms);
  const intentionallyOpenedChats = useIntentionallyOpenedChats();
  const people = useMemo(
    () =>
      uniq(
        dms
          .map((dm) => dm.from)
          .filter((from) => from !== username)
          .concat([...intentionallyOpenedChats.names])
      ).sort(),
    [dms, intentionallyOpenedChats]
  );
  const mainTab = useMemo(
    () => ({
      title: "Main chat",
      content: (
        <>
          <ChatMessages getLastMessages={iface.getLastMessages} />
          <WriteLine write={iface.write} />
        </>
      ),
    }),
    [iface]
  );
  const dmTo = useCallback(
    (...args: Parameters<typeof iface.dmTo>) => iface.dmTo(...args),
    [iface]
  );
  const tabs = useMemo(
    () =>
      [mainTab].concat(
        people.map((person) => ({
          title: person,
          content: <DMMessages withPerson={person} dmTo={dmTo} />,
        }))
      ),
    [mainTab, people]
  );

  return (
    <>
      <p>You are {loginName}</p>
      <Tabbed tabs={tabs} />
    </>
  );
});
