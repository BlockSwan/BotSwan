const Discord = require("discord.js");

module.exports = {
  name: "delmainrole",
  description: "Delete a main role",
  permission: Discord.PermissionFlagsBits.ManageRoles,
  dm: false,
  category: "Administration",
  options: [
    {
      type: "role",
      name: "role",
      description: "The main role to delete",
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
      bot.log.query("read", "Reading Guild " + guildId);

      let mainRoles = req.mainRoles || [];

      var foundRole = mainRoles?.findIndex((x) => x?.roleID == role?.id);
      if (foundRole === -1 || foundRole === undefined) {
        return bot.function.reply.error(
          message,
          "Add this role before deleting it."
        );
      }
      mainRoles.splice(foundRole, 1);
      await db.Guild.updateOne({ guildID: guildId }, { mainRoles: mainRoles });
      bot.log.query("write", "UPDATING Guild " + guildId);

      return bot.function.reply.success(message, `Role successfully deleted!`);
    } catch (err) {
      console.log(err);
    }
  },
};
