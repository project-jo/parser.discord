import "dotenv/config.js";
import { Client } from "./struct/client.js";

function main() {
  const token: string = process.env.TOKEN!;

  new Client(token).start();
}

main();
