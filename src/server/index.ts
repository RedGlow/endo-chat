import "ses";
import "@endo/init";
import debug from "debug";
import { ExtendedBootstrap, runCapTP } from "../run-captp.js";
import { processArgs } from "./args.js";
import { getServerBootstrapFactory } from "./server-bootstrap.js";
import { runHttpServer } from "./http-server.js";
import { createConnectionServer } from "./message-passing-server.js";
import { ServerBootstrap } from "../server-bootstrap-interface.js";

const d = debug("server");

const args = processArgs();
if (args.isServer) {
  const bootstrapFactory = getServerBootstrapFactory();
  createConnectionServer(args.hostname, args.port, (connection) => {
    const [bootstrap, onEnd] = bootstrapFactory();
    runCapTP<ServerBootstrap>(
      args.name,
      connection,
      () => ({ bootstrap }),
      onEnd
    );
  });
  d(`ws server started at ws://${args.hostname}:${args.port}`);
  runHttpServer(8099).then(() =>
    d("http server started at http://localhost:8099")
  );
} else {
  d("CLI client no longer supported");
}
