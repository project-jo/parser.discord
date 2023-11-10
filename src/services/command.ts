import { AsciiTable3 } from "ascii-table3";
import { Collection, REST, Routes } from "discord.js";
import { Client } from "../struct/client.js";
import CommandBuilder from "../struct/command.js";
import { find, readFiles } from "../utils/file.js";

export class CommandService {
  readonly commands = new Collection<string, CommandBuilder>();

  constructor(protected client: Client) { }

  async _initialize() {
    const table = new AsciiTable3('Typy').setHeading('Command', 'Status').setAlignCenter(2);
    this.commands.clear();
    const paths = await readFiles(`${process.cwd()}/dist/esm/commands`);
    await Promise.all(
      paths.map(async (path) => {
        const command: CommandBuilder = await find(path).catch(() => { });
        this.commands.set(command.name, command);
        table.addRow(command.name, 'CONNECTED');
      })
    ).catch((e) => {
      console.log(e);
    });
    const rest = new REST({ version: '10' }).setToken(this.client.token!);
    const commands: any[] = [];
    this.commands.forEach((command) => {
      commands.push(command.toJSON());
    })

    await rest.put(Routes.applicationGuildCommands(this.client.user!.id, process.env.GUILD_ID!), {
      body: commands
    }).catch((e) => {
      console.log(e);
    })
    return console.log(table.toString());
  }
}
