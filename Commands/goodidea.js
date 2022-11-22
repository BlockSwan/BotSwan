const Discord = require("discord.js");
const SuggestionModal = require("../Components/Modals/Suggestion");
const { emoji } = require("../constants");

module.exports = {
  name: "goodidea",
  description: "Reply with a button to create a suggestion",
  permission: "None",
  dm: true,
  category: "Suggestion",
  options: [],

  async run(bot, message, args, db) {
    db.query(bot.queries.getGuild(message.guildId), async (err, guildData) => {
      let modal = SuggestionModal();
      if (guildData?.length < 1 || guildData[0].suggest === "false") {
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
    });
  },
};
