const Discord = require("discord.js");

module.exports = {
  name: "setsuggest",
  description: "Set the suggestion channel",
  permission: Discord.PermissionFlagsBits.ManageGuild,
  dm: false,
  category: "Administration",
  options: [
    {
      type: "string",
      name: "state",
      description: "State of the suggestion",
      required: true,
      autocomplete: true,
    },
    {
      type: "channel",
      name: "channel",
      description: "The suggestion channel",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args, db) {
    const { guildId, guild } = message;
    let state = args.getString("state");
    if (state !== "on" && state !== "off")
      return bot.function.reply.error(message, "State must be `on` or `off`");
    if (state === "off") {
      await db.Guild.updateOne(
        { guildID: guildId },
        { suggestChannelID: "false" }
      );
      bot.log.query("write", "Writing to Guild " + guildId);
      await bot.function.reply.success(message, "Suggestion is disabled");
    } else {
      let channel = args.getChannel("channel");
      if (!channel)
        return bot.function.reply.error(
          message,
          "Missing a channel to deploy the suggestion"
        );
      channel = guild.channels.cache.get(channel.id);
      if (!channel) bot.function.reply.error(message, "No such channel");
      await db.Guild.updateOne(
        { guildID: guildId },
        { suggestChannelID: channel.id }
      );
      bot.log.query("write", "Writing to Guild " + guildId);

      await bot.function.reply.success(
        message,
        `Suggestion is enable in the channel ${channel}`
      );
    }
  },
};
