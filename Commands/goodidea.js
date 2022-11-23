const Discord = require("discord.js");
const { emoji } = require("../constants");

module.exports = {
  name: "goodidea",
  description: "Reply with a button to create a suggestion",
  permission: "None",
  dm: true,
  category: "Suggestion",
  options: [],

  async run(bot, message, args, db) {
    const { guildId } = message;

    let guildData = await db.Guild.findOne({ guildID: guildId });
    bot.log.query("read", "readding Guild " + guildId);
    if (!guildData || guildData?.suggestChannelID === "false") {
      return bot.function.reply.error(
        message,
        "Suggestion not `on`, please refer to `/setsuggest` if you are the server owner"
      );
    } else {
      const Button = new Discord.ActionRowBuilder().setComponents(
        new Discord.ButtonBuilder()
          .setCustomId("goodIdea")
          .setLabel("New proposition")
          .setStyle(Discord.ButtonStyle.Primary)
          .setEmoji("🧠")
      );

      await message.reply({
        content: `Does anyone have a good idea for **${emoji} Blockswan** ?`,
        components: [Button],
      });
    }
  },
};
