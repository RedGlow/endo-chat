export interface IArgs {
  isServer: boolean;
  hostname: string;
  port: number;
  name: string;
}

export const processArgs = () => {
  const args: Partial<IArgs> = {};
  for(var i = 0; i < process.argv.length; i++) {
    switch(process.argv[i]) {
      case "--server": args.isServer = true; break;
      case "--client": args.isServer = false; break;
      case "--hostname": args.hostname = process.argv[i+1]; i++; break;
      case "--port": args.port = parseInt(process.argv[i+1], 10); i++; break;
      case "--name": args.name = process.argv[i+1]; i++; break;
    }
  }
  if(args.hostname === undefined) {
    throw new Error("Missing hostname");
  }
  if(args.port === undefined) {
    throw new Error("Missing port");
  }
  if(args.name === undefined) {
    throw new Error("Missing name");
  }
  if(args.isServer === undefined) {
    throw new Error("Missing server/client flag");
  }
  return args as IArgs;
}