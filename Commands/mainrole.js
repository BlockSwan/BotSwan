const Discord = require("discord.js");
const MainRoleSelector = require("../Components/Buttons/MainRole");

module.exports = {
  name: "mainrole",
  description: "Display buttons to choose a main role",
  permission: Discord.PermissionFlagsBits.ManageRoles,
  dm: false,
  category: "Administration",
  options: [],

  async run(bot, message, args, db) {
    const { options, guildId, guild, channel } = message;

    try {
      let req = await db.Guild.findOne({ guildID: guildId });
      bot.log.query("read", "READing Guild " + guildId);
      if (!req) return bot.function.reply(message);
      let mainRoles = req.mainRoles || [];
      if (!req || !(mainRoles?.length > 0)) {
        return bot.function.reply.error(
          message,
          "This server does not have any data"
        );
      }

      let roleSector = MainRoleSelector(message, mainRoles);

      await channel.send({
        embeds: [roleSector.embeds],
        components: roleSector.components,
      });

      return bot.function.reply.success(message, "Pannel succesfully sent!");
    } catch (err) {
      console.log(err);
    }
  },
};
