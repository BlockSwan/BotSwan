const Discord = require("discord.js");
const { emoji } = require("../../constants");

module.exports = () => {
  const Button = new Discord.ActionRowBuilder().setComponents(
    new Discord.ButtonBuilder()
      .setCustomId("goodIdea")
      .setLabel("New proposition")
      .setStyle(Discord.ButtonStyle.Primary)
      .setEmoji("🧠")
  );

  const text = `Does anyone have a good idea for **${emoji} Blockswan**?\n`;
  return { button: Button, content: text };
};
