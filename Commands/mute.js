const Discord = require("discord.js");
const ms = require("ms");
const constants = require("../constants");
const { TWENTY_HEIGHT_DAYS } = constants;
module.exports = {
  name: "mute",
  description: "Mute a member",
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
      name: "time",
      description: "How long should the user be muted?",
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
    if (!user) return bot.function.reply.error(message, "No member to mute");

    let member = message.guild.members.cache.get(user.id);
    if (!member) return bot.function.reply.error(message, "No member to mute");

    let time = args.getString("time");
    if (!time) return bot.function.reply.error(message, "Time is not defined");

    if (isNaN(ms(time)))
      return bot.function.reply.error(message, "Not the good format");
    if (ms(time) > TWENTY_HEIGHT_DAYS)
      return bot.function.reply.error(
        message,
        "Mute can't last more than 28 days"
      );

    let reason = args.getString("reason");
    if (!reason) reason = "No reason attached";

    if (message.user.id === user.id)
      return bot.function.reply.error(message, "Can't mute yourself");
    if ((await message.guild.fetchOwner()).id === user.id)
      return bot.function.reply.error(message, "Can't mute server owner");
    if (!member.moderatable)
      return bot.function.reply.error(message, "Can't mute this member");
    if (
      message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0
    )
      return bot.function.reply.error(message, "Can't mute this member");
    if (member.isCommunicationDisabled())
      return bot.function.reply.error(message, "This member is already muted");

    try {
      await user.send(
        `You have been muted of ${message.guild.name} by ${message.user.tag} during ${time} for the reason: \`${reason}\``
      );
    } catch {}
    await bot.function.reply.success(
      message,
      `${message.user} has muted ${user.tag} during ${time} for the reason \`${reason}\``
    );

    await member.timeout(ms(time), reason);
  },
};
