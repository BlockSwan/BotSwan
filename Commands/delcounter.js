const Discord = require("discord.js");

module.exports = {
  name: "delcounter",
  description: "Delete a counter",
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
      let roleCounters = req?.roleCounters || [];

      let newRoleCounters = [];
      for (let i = 0; i < roleCounters?.length; i++) {
        if (roleCounters[i].roleID !== role.id) {
          newRoleCounters.push(roleCounters[i]);
        }
      }

      await db.Guild.updateOne(
        { guildID: guildId },
        {
          roleCounters: newRoleCounters,
        }
      );
      bot.log.query("readu", "READING Guild " + guildId);
      return bot.function.reply.success(
        message,
        `${
          roleCounters?.length - newRoleCounters?.length
        } role(s) succesfully deleted!`
      );
    } catch (err) {
      console.log(err);
    }
  },
};
