const Discord = require("discord.js");

module.exports = async (bot, invite) => {
  let db = bot.db;
  bot.invites.get(invite.guild.id).delete(invite.code);
  //   await db.Invite.updateOne(
  //     { guildID: invite.guild.id, code: invite.code },
  //     { isDelete: true }
  //   );
};
