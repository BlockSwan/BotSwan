const Discord = require("discord.js");
const { URL, emoji } = require("../constants");

module.exports = {
  name: "docs",
  description: "Send a button to the docs",
  permission: Discord.PermissionFlagsBits.ManageMessages,
  dm: false,
  category: "Information",
  options: [],

  async run(bot, message, args) {
    message.reply({
      content: `**Want to learn more about ${emoji} Blockswan?**\nAre you familiar with the \`man\` command in a Shell? Whell the following link is the equivalent for the blockswan protocol.`,
      components: [
        new Discord.ActionRowBuilder().setComponents(
          new Discord.ButtonBuilder()
            .setURL(URL.docs)
            .setLabel("Documentation")
            .setEmoji("📋")
            .setStyle(Discord.ButtonStyle.Link)
        ),
      ],
    });
  },
};
