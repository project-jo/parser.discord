import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Client } from "./client.js";
/**
 * Represents the callback of a command
 */
export type CommandCallback = (client: Client, interaction: ChatInputCommandInteraction) => unknown;

/**
 * A builder that creates API-compatible JSON data for commands.
 */
export default class CommandBuilder extends SlashCommandBuilder {
  /**
   * The callback of this command.
   */
  public readonly callback: CommandCallback = undefined!;

  constructor() {
    super();
  }

  /**
   * Sets the callback of this command.
   *
   * @param callback - The callback to use
   */
  setCallback(callback: CommandCallback): this {
    Reflect.set(this, 'callback', callback);
    return this;
  }
}
