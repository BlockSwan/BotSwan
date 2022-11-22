const Discord = require("discord.js");
const { URL, emoji } = require("../constants");

module.exports = {
  name: "testnet",
  description: "Send a button link to the testnet interface",
  permission: Discord.PermissionFlagsBits.ManageMessages,
  dm: false,
  category: "Information",
  options: [],

  async run(bot, message, args) {
    message.reply({
      components: [
        new Discord.ActionRowBuilder().setComponents(
          new Discord.ButtonBuilder()
            .setURL(URL.testnet)
            .setLabel("Blockswan Testnet dApp")
            .setEmoji(emoji)
            .setStyle(Discord.ButtonStyle.Link)
        ),
      ],
    });
  },
};
