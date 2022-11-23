const Discord = require("discord.js");
const SuggestionModal = require("../Components/Modals/Suggestion");

module.exports = {
  name: "suggest",
  description: "Create a new suggestion",
  permission: "None",
  dm: true,
  category: "Suggestion",
  options: [],

  async run(bot, message, args, db) {
    const { guildId } = message;
    let guildData = await db.Guild.findOne({ guildID: guildId });
    bot.log.query("read", "READING Guild " + guildId);

    let modal = SuggestionModal();
    if (!guildData || guildData?.suggestChannelID === "false") {
      return bot.function.reply.error(
        message,
        "Suggestion not `on`, please refer to `/setsuggest` if you are the server owner"
      );
    } else message.showModal(modal);
  },
};
