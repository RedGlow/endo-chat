# EndoChat

A testbed/experiment to make a very simple chat using [Agoric's JavaScript CapTP implementation](https://docs.agoric.com/guides/js-programming/). This is _NOT_ meant as production code, not as a best practice. Its purpose is just to show a starting point with a relatively complete structure.

# How to prepare the environment

The project has been built for NodeJS v. 18. Earlier versions may work as is or with minimal changes, but they have not been tested.

# How to build

Run the following commands:

```sh
npm install
npm run build-server
npm run build-client
```

If you want to make changes and have the compilation run in the background at every change (watch), run the following two commands in two shells and keep them running:

```sh
npm run watch-server
npm run watch-client
```

# How to use

Set the _DEBUG_ environment variable on a shell to 'server' (see [debug](https://github.com/debug-js/debug) documentation for more information).

Then, run the server in a shell:

```sh
node .\dist\server\index.js --server --hostname 127.0.0.1 --port 9382 --name server
```

Parameters are:
- hostname and port: where the WebSocket used for running the CapTP server will run on
- name: name used for this node by the CapTP server

This will print an http address on command line. Open a browser at that address and you will have a simple chat interface.