import { ChatInputCommandInteraction } from "discord.js";
import { Client } from "../struct/client.js";
import EventBuilder from "../struct/event.js";


// ╭──────────────────────────────────────────────────────────╮
// │  Interaction Create                                      │
// │  Detect on command interaction                           │
// ╰──────────────────────────────────────────────────────────╯
const interactionCreate = new EventBuilder(false)
.setName('interactionCreate')
.setCallback(
  async (client: Client, interaction: ChatInputCommandInteraction) => {
    const commandService = client.Commands;
    const command = commandService.commands.get(interaction.commandName);
    if (command) {
      await command.callback(client, interaction);
    }
  }
)

export default interactionCreate;
