import { Client } from "../struct/client.js";
import EventBuilder from "../struct/event.js";
import { IconData, createIcon } from "../utils/icon.js";

// ╭──────────────────────────────────────────────────────────╮
// │  Ready                                                   │
// │  Detect once bot ready                                   │
// ╰──────────────────────────────────────────────────────────╯
const ready = new EventBuilder(true)
.setName('ready')
.setCallback(
  async (client: Client) => {
    await client.registerCommands();
    const guild = client.guilds.cache.get(process.env.GUILD_ID!);
    const data: IconData[] = [
      {
        start: 'Logging in...',
        finish: `Logged in as ${client.user!.tag}`
      },
      {
        start: 'Fetching members...',
        finish: `${guild!.memberCount} members`
      }
    ]
    await createIcon(data);
  }
)

export default ready;
