const Discord = require("discord.js");
const { URL, emoji } = require("../constants");

module.exports = {
  name: "about",
  description: "Send all information needed about blockswan",
  permission: Discord.PermissionFlagsBits.ManageMessages,
  dm: false,
  category: "Information",
  options: [],

  async run(bot, message, args) {
    message.reply({
      content: `**WTF is ${emoji} Blockswan?**\nBlockswan is a community-owned and non-custodial digital services marketplace that users can leverage to bolster their online activity. Sell your skills, access the best talents, provide value-added to the network and be rewarded for it.\n`,
      components: [
        new Discord.ActionRowBuilder().setComponents(
          new Discord.ButtonBuilder()
            .setURL(URL.resources)
            .setLabel("All resources")
            .setEmoji("🔗")
            .setStyle(Discord.ButtonStyle.Link)
        ),
      ],
    });
  },
};
