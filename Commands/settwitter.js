const Discord = require("discord.js");

module.exports = {
  name: "settwitter",
  description: "Set the twitter channel",
  permission: Discord.PermissionFlagsBits.ManageGuild,
  dm: false,
  category: "Administration",
  options: [
    {
      type: "string",
      name: "state",
      description: "State of the twitter",
      required: true,
      autocomplete: true,
    },
    {
      type: "channel",
      name: "channel",
      description: "The twitter channel",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args, db) {
    const { guild, guildId } = message;
    let state = args.getString("state");
    if (state !== "on" && state !== "off")
      return bot.function.reply.error(message, "State must be `on` or `off`");
    if (state === "off") {
      await db.Guild.updateOne(
        { guildID: guildId },
        {
          twitterChannelID: "false",
        }
      );
      bot.log.query("write", "Writing to Guild " + guildId);
      await bot.function.reply.success(message, "Twitter is disabled");
    } else {
      let channel = args.getChannel("channel");
      if (!channel)
        return bot.function.reply.error(
          message,
          "Missing a channel to deploy the twitter"
        );
      channel = guild.channels.cache.get(channel.id);
      if (!channel) bot.function.reply.error(message, "No such channel");
      await db.Guild.updateOne(
        { guildID: guildId },
        {
          twitterChannelID: channel.id,
        }
      );
      bot.log.query("write", "Writing to Guild " + guildId);

      await bot.function.reply.success(
        message,
        `twitter is enable in the channel ${channel}`
      );
    }
  },
};
