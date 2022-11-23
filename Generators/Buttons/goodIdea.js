const Discord = require("discord.js");
const SuggestionModal = require("../../Components/Modals/Suggestion");

module.exports = {
  async run(bot, interaction, db) {
    const { guildId } = interaction;
    let guildData = await db.Guild.findOne({ guildID: guildId });
    bot.log.query("read", "reading  Guild " + guildId);

    let modal = SuggestionModal();
    if (!guildData || guildData.suggestChannelID === "false") {
      return bot.function.reply.error(
        interaction,
        "Suggestion not `on`, please refer to `/setsuggest` if you are the server owner"
      );
    } else interaction.showModal(modal);
  },
};
