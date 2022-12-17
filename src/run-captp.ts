import "ses";
import debug from "debug";
import { Connection } from "./message-passing-base";
import { makeCapTP } from "@endo/captp";

const d = debug("run-captp");

export interface ExtendedBootstrap<TBootstrap> {
  bootstrap: TBootstrap;
  onEnd?: () => void;
}

export function runCapTP<TMyBootstrap, TRemoteBootstrap = any>(
  id: string,
  myconn: Connection,
  getExtendedBootstrap: () => ExtendedBootstrap<TMyBootstrap>,
  onEnd?: () => void
) {
  const extendedBootstrap = getExtendedBootstrap();
  const myBootstrap = harden(extendedBootstrap.bootstrap);
  d("run as %s", id);
  // Create a message dispatcher and bootstrap.
  // Messages on myconn are exchanged with JSON-able objects.
  const { dispatch, getBootstrap, abort } = makeCapTP(
    "myid-" + id,
    myconn.send,
    myBootstrap
  );
  myconn.onReceive = (obj) => dispatch(obj);
  myconn.onEnd = () => {
    onEnd && onEnd();
    extendedBootstrap.onEnd && extendedBootstrap.onEnd();
    abort(undefined);
  };
  return getBootstrap() as TRemoteBootstrap;
}
