const Discord = require("discord.js");

module.exports = {
  name: "warn",
  description: "Warn a member",
  permission: Discord.PermissionFlagsBits.ManageMessages,
  dm: true,
  category: "Moderation",
  options: [
    {
      type: "user",
      name: "member",
      description: "Member to ban",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "reason",
      description: "Why warn this user?",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args, db) {
    let user = args.getUser("member");
    if (!user) return message.reply("No member to warn");
    let member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply("No member to warn");

    let reason = args.getString("reason");
    if (!reason) reason = "No reason given";

    if (message.user.id === user?.id)
      return bot.function.reply.error(message, "Can't warn yourself");

    if ((await message.guild.fetchOwner()).id === user.id)
      return bot.function.reply.error(message, "Can't warn server owner");

    if (
      message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0
    )
      return bot.function.reply.error(message, "Can't warn this user ");
    if (
      (await message.guild.members.fetchMe()).roles.highest.comparePositionTo(
        member.roles.highest
      ) <= 0
    )
      return bot.function.reply.error(message, "Can't warn this user ");

    try {
      await user.send(
        `${message.user.tag} has warned you in ${message.guild.name} for the following reasong: \`${reason}\``
      );
    } catch (err) {}

    await bot.function.reply.success(
      message,
      `You have warned ${user.tag} with success for the following reasong: \`${reason}\``
    );

    let ID = await bot.function.createID("WARN");

    let saveWarn = bot.function.queries.saveWarn(
      message.guild.id,
      user.id,
      message.user.id,
      ID,
      reason.replace(/'/g, "\\'"),
      Date.now()
    );
    db.query(saveWarn);
  },
};
