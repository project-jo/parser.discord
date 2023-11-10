import { config } from "dotenv";
import { Client } from "./struct/client.js";

function main() {
  config();
  const token: string = process.env.TOKEN!;

  new Client(token).start();
}

main();
