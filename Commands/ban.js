const Discord = require("discord.js");

module.exports = {
  name: "ban",
  description: "Ban a member",
  permission: Discord.PermissionFlagsBits.BanMembers,
  dm: false,
  category: "Moderation",
  options: [
    {
      type: "user",
      name: "member",
      description: "The member to ban",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "reason",
      description: "Why ban this user?",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {
    try {
      let user = await bot.users.fetch(args._hoistedOptions[0].value);
      if (!user) return bot.function.reply.error(message, "No member to ban");
      let member = message.guild.members.cache.get(user.id);
      let reason = args.getString("reason");
      if (!reason) reason = "No reason given";
      if (message.user.id === user?.id)
        return bot.function.reply.error(message, "Can't ban yourself");
      if ((await message.guild.fetchOwner()).id === user.id)
        return bot.function.reply.error(message, "Can't ban server owner");
      if (member && !member?.bannable)
        return bot.function.reply.error(message, "Can't ban this member");
      if (
        member &&
        message.member.roles.highest.comparePositionTo(member.roles.highest) <=
          0
      )
        return bot.function.reply.error(message, "Can't ban this user");
      if ((await message.guild.bans.fetch()).get(user.id))
        return bot.function.reply.error(
          message,
          "This member is already banned"
        );
      try {
        await user.send(
          `You have been banned of the ${message.guild.name} discord server by ${message.user.tag} for the reason: \`${reason}\``
        );
      } catch (err) {}
      await bot.function.reply.success(
        message,
        `${message.user} has banned ${user.tag} for the reason: \`${reason}\``
      );
      await message.guild.bans.create(user.id, { reason: reason });
    } catch (err) {
      return bot.function.reply.error(message, "No member to ban");
    }
  },
};
