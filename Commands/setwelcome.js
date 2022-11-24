const Discord = require("discord.js");

module.exports = {
  name: "setwelcome",
  description: "Set the welcome channel",
  permission: Discord.PermissionFlagsBits.ManageGuild,
  dm: false,
  category: "Administration",
  options: [
    {
      type: "string",
      name: "state",
      description: "State of the welcome",
      required: true,
      autocomplete: true,
    },
    {
      type: "channel",
      name: "channel",
      description: "The welcome channel",
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
        { welcomeChannelID: "false" }
      );
      bot.log.query("write", "Writing to Guild " + guildId);
      await bot.function.reply.success(message, "welcome is disabled");
    } else {
      let channel = args.getChannel("channel");
      if (!channel)
        return bot.function.reply.error(
          message,
          "Missing a channel to deploy the welcome"
        );
      channel = guild.channels.cache.get(channel.id);
      if (!channel) bot.function.reply.error(message, "No such channel");
      await db.Guild.updateOne(
        { guildID: guildId },
        { welcomeChannelID: channel.id }
      );
      bot.log.query("write", "Writing to Guild " + guildId);

      await bot.function.reply.success(
        message,
        `Welcome is enable in the channel ${channel}`
      );
    }
  },
};
