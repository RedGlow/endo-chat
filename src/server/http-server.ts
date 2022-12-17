import express from "express";

export function runHttpServer(port: number) {
  const app = express();
  app.get("/", (_, res) => res.redirect("/index.html"));
  app.use(express.static("static"));
  app.use(express.static("dist/client"));
  return new Promise<void>((resolve) => app.listen(port, resolve));
}
