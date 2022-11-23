const Discord = require("discord.js");

module.exports = {
  name: "delrole",
  description: "Delete a role",
  permission: Discord.PermissionFlagsBits.ManageRoles,
  dm: false,
  category: "Administration",
  options: [
    {
      type: "role",
      name: "role",
      description: "The role to delete",
      required: true,
      autocomplete: false,
    },
  ],

  async run(bot, message, args, db) {
    const { guildId, member } = message;

    const role = args.getRole("role");

    try {
      if (role.position >= member.roles.highest.position)
        return bot.function.reply.error(
          message,
          "I don't have permission for that"
        );

      let req = await db.Guild.findOne({ guildID: guildId });
      bot.log.query("readu", "READING Guild " + guildId);
      let reactionRoles = req?.reactionRoles || [];

      var foundRole = reactionRoles?.findIndex((x) => x?.roleID == role?.id);
      if (foundRole === -1 || foundRole === undefined) {
        return bot.function.reply.error(
          message,
          "Add this role before deleting it."
        );
      }
      reactionRoles.splice(foundRole, 1);
      await db.Guild.updateOne(
        { guildID: guildId },
        {
          reactionRoles: reactionRoles,
        }
      );
      bot.log.query("readu", "READING Guild " + guildId);
      return bot.function.reply.success(message, `Role succesfully deleted!`);
    } catch (err) {
      console.log(err);
    }
  },
};
