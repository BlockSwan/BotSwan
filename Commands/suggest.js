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
    db.query(bot.queries.getGuild(message.guildId), async (err, guildData) => {
      let modal = SuggestionModal();
      if (guildData?.length < 1 || guildData[0].suggest === "false") {
        return bot.function.reply.error(
          message,
          "Suggestion not `on`, please refer to `/setsuggest` if you are the server owner"
        );
      } else message.showModal(modal);
    });
  },
};
