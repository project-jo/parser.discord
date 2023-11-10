import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import path from "path";
import { Client } from "../struct/client.js";
import CommandBuilder from "../struct/command.js";
import { getColor } from "../utils/color.js";
import { checkFile, deleteFile, jsonToYaml, yamlToJson } from "../utils/convert.js";

const command = new CommandBuilder()
.setName("convert")
.addAttachmentOption(opt => opt
  .setName('file')
  .setDescription('File attachment')
  .setRequired(true)
)
.setDescription("Convert yaml to json or json to yaml")
.setCallback(
  async (client: Client, interaction: ChatInputCommandInteraction) => {
    const startTime = performance.now();
    await interaction.deferReply();
    const { options, user } = interaction;
    const fileAttachment = options.getAttachment('file', true);

    if (fileAttachment) {
      const url = fileAttachment.url;
      const response = await fetch(url);
      const data = await response.text();
      const fileName = `${user.username}_${path.parse(fileAttachment.name).name}`;
      const isValidFileType = checkFile(fileAttachment.name, fileName)
      let fileOutput = isValidFileType.output;
      let fileSizeFrom: string = '';
      let fileSizeTo: string = '';
      let fileLengthFrom: string = '';
      let fileLengthTo: string = '';
      let thumbnail_url: string = '';
      if (isValidFileType.extension_to.toLowerCase() === 'json') {
        const fileData = yamlToJson(data.trim(), fileName);
        fileSizeFrom = fileData.input_data.file_size;
        fileSizeTo = fileData.output_data.file_size;
        fileLengthFrom = fileData.input_data.total_line.toString();
        fileLengthTo = fileData.output_data.total_line.toString();
        thumbnail_url = 'https://i.ibb.co/8MjvGBf/yaml.png';
      } else if (isValidFileType.extension_to.toLowerCase() === 'yaml') {
        const fileData = jsonToYaml(data.trim(), fileName);
        fileSizeFrom = fileData.input_data.file_size;
        fileSizeTo = fileData.output_data.file_size;
        fileLengthFrom = fileData.input_data.total_line.toString();
        fileLengthTo = fileData.output_data.total_line.toString();
        thumbnail_url = 'https://i.ibb.co/BtMVqb5/json.png';
      }

      const difference = Math.floor(performance.now() - startTime);

      if (fileOutput !== "") {
        const embed = new EmbedBuilder()
        .setTitle('Convert File')
        .addFields(
          {
            name: "File Name",
            value: fileAttachment.name,
          },
          {
            name: "Source File Type",
            value: isValidFileType.extension_from,
          },
          {
            name: "Target File Type",
            value: isValidFileType.extension_to,
          },
          {
            name: "Source File Size",
            value: fileSizeFrom,
          },
          {
            name: "Target File Size",
            value: fileSizeTo,
          },
          {
            name: "Source Line Length",
            value: fileLengthFrom
          },
          {
            name: "Target Line Length",
            value: fileLengthTo
          }
        )
        .setThumbnail(thumbnail_url)
        .setColor(getColor('green'))
        .setTimestamp()
        .setFooter({
          text: `Parser | Executed in ${difference}ms`,
          iconURL: client.user!.displayAvatarURL({ extension: 'png', size: 2048 })
        });

        const message = await interaction.editReply({ embeds: [embed] });
        if (message) {
          await message.reply({ files: [fileOutput] })
          return deleteFile(fileOutput);
        }
      } else {
        return interaction.editReply({ content: "File must be JSON or YAML" });
      }
    }
  }
)

export default command;
