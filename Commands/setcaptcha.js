const Discord = require("discord.js");

module.exports = {
  name: "setcaptcha",
  description: "Set the captcha channel",
  permission: Discord.PermissionFlagsBits.ManageGuild,
  dm: false,
  category: "Administration",
  options: [
    {
      type: "string",
      name: "state",
      description: "State of the captcha",
      required: true,
      autocomplete: true,
    },
    {
      type: "channel",
      name: "channel",
      description: "The captcha channel (create one only for this)",
      required: false,
      autocomplete: false,
    },
    {
      type: "role",
      name: "verified",
      description: "The role that user will get after doing the captcha",
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
        {
          verifiedRoleID: "false",
          captchaChannelID: "false",
        }
      );
      bot.log.query("write", "Updating guild " + guild.id);
      await bot.function.reply.success(message, "Captcha is disabled");
    } else {
      let channel = args.getChannel("channel");
      if (!channel)
        return bot.function.reply.error(
          message,
          "Missing a channel to deploy the captcha"
        );
      channel = guild.channels.cache.get(channel.id);
      if (!channel) bot.function.reply.error(message, "No such channel");

      let verified = args.getRole("verified");
      if (!verified)
        return bot.function.reply.error(message, "Missing a verified role");
      const role = guild.roles.cache.get(verified.id);
      if (!role)
        return bot.function.reply.error(message, "Missing a verified role");

      await db.Guild.updateOne(
        { guildID: guild.id },
        {
          verifiedRoleID: role.id,
          captchaChannelID: channel.id,
        }
      );
      bot.log.query("write", "Updating guild " + guild.id);

      await bot.function.reply.success(
        message,
        `Captcha is enable in the channel ${channel}`
      );
    }
  },
};
