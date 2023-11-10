import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { performance } from "perf_hooks";
import { Client } from "../struct/client.js";
import CommandBuilder from "../struct/command.js";
import { getColor } from "../utils/color.js";

const command = new CommandBuilder()
.setName("ping")
.setDescription("Get bot websocket and api latency")
.setCallback(
  async (client: Client, interaction: ChatInputCommandInteraction) => {
    const startTime = performance.now();

    await interaction.deferReply();
    const message = await interaction.fetchReply();

    const botLatency = Math.round(message.createdTimestamp - interaction.createdTimestamp);
    const apiLatency = Math.round(client.ws.ping);
    const difference = Math.floor(performance.now() - startTime);

    const embed = new EmbedBuilder()
    .setTitle("Ping")
    .setDescription("Pong!")
    .setColor(getColor('blue'))
    .addFields(
      {
        name: 'API Latency',
        value: `\`${apiLatency}ms\``,
        inline: true
      },
      {
        name: 'Bot Latency',
        value: `\`${botLatency}ms\``,
        inline: true
      }
    )
    .setFooter({
      text: `${client.user!.username} | Executed in ${difference}ms`,
      iconURL: client.user!.displayAvatarURL({ extension: 'png', size: 2048 })
    })

    return interaction.editReply({ embeds: [embed] });
  }
)

export default command;
