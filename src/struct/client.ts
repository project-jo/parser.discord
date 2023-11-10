import { Client as BaseClient, GatewayIntentBits } from "discord.js";
import { EventService } from "../services/event.js";
import { CommandService } from "../services/command.js";

export class Client extends BaseClient {
  constructor(token: string) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.MessageContent
      ]
    });
    this.token = token;
  }

  public Listeners: EventService = new EventService(this);
  public Commands: CommandService = new CommandService(this);

  start(): void {
    this.login(this.token!).then(async () => {
      await this.registerListeners();
    })
  }

  public async registerListeners(): Promise<void> {
    try {
      await this.Listeners._initialize();
    } catch (e) {
      console.error(`Failed while registering listeners ${e}`);
    }
  }

  public async registerCommands(): Promise<void> {
    try {
      await this.Commands._initialize();
    } catch (e) {
      console.error(`Failed while registering commands ${e}`);
    }
  }
}
