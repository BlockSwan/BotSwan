const Discord = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kick a member",
  permission: Discord.PermissionFlagsBits.KickMembers,
  dm: false,
  category: "Moderation",
  options: [
    {
      type: "user",
      name: "member",
      description: "The member to kick",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "reason",
      description: "Why kick this user?",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {
    let user = args.getUser("member");
    if (!user) return bot.function.reply.error(message, "No member to kick");
    let member = message.guild.members.cache.get(user.id);
    if (!member) return bot.function.reply.error(message, "No member to kick");
    let reason = args.getString("reason");
    if (!reason) reason = "No reason given";
    if (message.user.id === user?.id)
      return bot.function.reply.error(message, "Can't kick yourself");
    if ((await message.guild.fetchOwner()).id === user.id)
      return bot.function.reply.error(message, "Can't kick server owner");
    if (member && !member?.kickable)
      return bot.function.reply.error(message, "Can't kick this member");
    if (
      member &&
      message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0
    )
      return bot.function.reply.error(message, "Can't kick this user");

    try {
      await user.send(
        `You have been kicked of the ${message.guild.name} discord server by ${message.user.tag} for the reason: \`${reason}\``
      );
    } catch (err) {}
    await bot.function.reply.success(
      message,
      `${message.user} has kicked ${user.tag} for the reason: \`${reason}\``
    );
    await member.kick(reason);
  },
};
