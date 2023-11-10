import { AsciiTable3 } from "ascii-table3";
import { Collection } from "discord.js";
import { Client } from "../struct/client.js";
import EventBuilder from "../struct/event.js";
import { find, readFiles } from "../utils/file.js";

export class EventService {
  readonly events = new Collection<string, any>();

  constructor(protected client: Client) { }

  async _initialize() {
    try {
      const table = new AsciiTable3('Typy').setHeading('Event', 'Status').setAlignCenter(2);
      this.events.clear();
      const paths = await readFiles(`${process.cwd()}/dist/esm/events`);
      await Promise.all(
        paths.map(async (path) => {
          const event: EventBuilder = await find(path).catch(() => { });
          const callback = (...args: any) => void event.callback(this.client, ...args);
          this.events.set(event.name, callback);

          if (event.once) this.client.once(event.name, callback);
          else this.client.on(event.name, callback);

          table.addRow(event.name, 'CONNECTED');
        })
      )

      return console.log(table.toString());
    } catch (e) {
      console.log(e);
    }
  }
}
