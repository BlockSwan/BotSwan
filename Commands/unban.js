const Discord = require("discord.js");

module.exports = {
  name: "unban",
  description: "Unban a member",
  permission: Discord.PermissionFlagsBits.BanMembers,
  dm: true,
  category: "Moderation",

  options: [
    {
      type: "user",
      name: "user",
      description: "The user to unban",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "reason",
      description: "Why unban this user?",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {
    try {
      let user = args.getUser("user");
      if (!user) return bot.function.reply.error(message, "No user");

      let reason = args.getString("reason");
      if (!reason) reason = "No reason given";

      if (!(await message.guild.bans.fetch()).get(user.id))
        return bot.function.reply.error(message, "This user is not banned");

      try {
        await user.send(
          `You have been unbaned by ${message.user.tag} for the reason: \`${reason}\`\n
			https://discord.gg/fYyk7QBjWb`
        );
      } catch (err) {
        console.log(err);
      }

      await bot.function.reply.success(
        message,
        `${message.user} has unbaned ${user.tag} for the reason: \`${reason}\``
      );
      await message.guild.members.unban(user, reason);
    } catch (err) {
      return message.reply("No user");
    }
  },
};
