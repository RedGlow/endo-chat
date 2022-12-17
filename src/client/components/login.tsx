import React, { useCallback } from "react";
import { memo } from "react";
import useStorage, { StorageType } from "./use-storage";

export interface LoginProps {
  onLogin(loginName: string): void;
}

export const Login = memo(function Login({ onLogin }: LoginProps) {
  const [loginName, setLoginName] = useStorage(
    StorageType.Session,
    "login-name",
    "pippo"
  );

  const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setLoginName(ev.target.value);
  }, []);

  const onSubmit = useCallback(
    (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      onLogin(loginName);
    },
    [loginName]
  );

  return (
    <form onSubmit={onSubmit}>
      <p>Your name:</p>
      <input type="text" value={loginName} onChange={onChange} />
      <button type="submit">Login</button>
    </form>
  );
});
