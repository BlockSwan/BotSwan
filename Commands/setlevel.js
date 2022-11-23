const Discord = require("discord.js");

module.exports = {
  name: "setlevel",
  description: "Set the leveling channel",
  permission: Discord.PermissionFlagsBits.ManageGuild,
  dm: false,
  category: "Administration",
  options: [
    {
      type: "string",
      name: "state",
      description: "State of the level",
      required: true,
      autocomplete: true,
    },
    {
      type: "channel",
      name: "channel",
      description: "The level channel",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args, db) {
    const { guild } = message;
    let state = args.getString("state");
    if (state !== "on" && state !== "off")
      return bot.function.reply.error(message, "State must be `on` or `off`");
    if (state === "off") {
      await db.Guild.updateOne(
        { guildID: guild.id },
        { levelChannelID: "false" }
      );
      bot.log.query("write", "updating level channel id");

      await bot.function.reply.success(message, "Level is disabled");
    } else {
      let channel = args.getChannel("channel");
      if (!channel)
        return bot.function.reply.error(
          message,
          "Missing a channel to deploy the level"
        );
      channel = guild.channels.cache.get(channel.id);
      if (!channel) bot.function.reply.error(message, "No such channel");
      await db.Guild.updateOne(
        { guildID: guild.id },
        { levelChannelID: channel.id }
      );
      bot.log.query("write", "updating level channel id");

      await bot.function.reply.success(
        message,
        `Levelling is enable in the channel ${channel}`
      );
    }
  },
};
