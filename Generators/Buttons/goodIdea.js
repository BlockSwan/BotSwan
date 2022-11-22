const Discord = require("discord.js");
const SuggestionModal = require("../../Components/Modals/Suggestion");

module.exports = {
  async run(bot, interaction, db) {
    db.query(
      bot.queries.getGuild(interaction.guildId),
      async (err, guildData) => {
        let modal = SuggestionModal();
        if (guildData?.length < 1 || guildData[0].suggest === "false") {
          return bot.function.reply.error(
            interaction,
            "Suggestion not `on`, please refer to `/setsuggest` if you are the server owner"
          );
        } else interaction.showModal(modal);
      }
    );
  },
};
