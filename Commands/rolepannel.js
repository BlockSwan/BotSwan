const Discord = require("discord.js");
const RoleSelector = require("../Components/Builders/Role");

module.exports = {
  name: "rolepannel",
  description: "Display a pannel to choose a role",
  permission: Discord.PermissionFlagsBits.ManageRoles,
  dm: false,
  category: "Administration",
  options: [],

  async run(bot, message, args, db) {
    const { options, guildId, guild, channel } = message;

    try {
      let req = await db.Guild.findOne({ guildID: guildId });
      bot.log.query("read", "readding Guild " + guildId);
      if (!req) return bot.function.reply(message);
      let reactionRoles = req?.reactionRoles || [];
      if (!req || !(reactionRoles?.length > 0)) {
        return bot.function.reply.error(
          message,
          "This server does not have any data"
        );
      }

      let roleSector = RoleSelector(message, reactionRoles);

      channel.send({
        embeds: [roleSector.embed],
        components: roleSector.menuComponents,
      });

      return bot.function.reply.success(message, "Pannel succesfully sent!");
    } catch (err) {
      console.log(err);
    }
  },
};
