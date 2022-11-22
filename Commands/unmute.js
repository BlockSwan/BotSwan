const Discord = require("discord.js");
const ms = require("ms");
module.exports = {
  name: "unmute",
  description: "Unmute a member",
  permission: Discord.PermissionFlagsBits.ModerateMembers,
  dm: false,
  category: "Moderation",
  options: [
    {
      type: "user",
      name: "member",
      description: "The member to mute",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "reason",
      description: "Why is the user muted",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {
    let user = args.getUser("member");
    if (!user) return bot.function.reply.error(message, "No user");

    let member = message.guild.members.cache.get(user.id);
    if (!member) return bot.function.reply.error(message, "No member");

    let reason = args.getString("reason");
    if (!reason) reason = "No reason given";

    if (!member.moderatable)
      return bot.function.reply.error(message, "Can't unmute this user");
    if (
      message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0
    )
      return bot.function.reply.error(message, "Can't unmute this user");
    if (!member.isCommunicationDisabled())
      return bot.function.reply.error(message, "This member is not muted.");
    try {
      await user.send(
        `You have been unmuted by ${message.user.tag} for the reason : \`${reason}\``
      );
    } catch {}

    await bot.function.reply.success(
      message,
      `${message.user} has unmuted ${user.tag} for the reason : \`${reason}\``
    );

    await member.timeout(null, reason);
  },
};
