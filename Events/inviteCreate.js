const Discord = require("discord.js");

module.exports = async (bot, invite) => {
  let db = bot.db;
  bot.invites.get(invite.guild.id).set(invite.code, invite.uses);
  //  await db.Invite.create({ guildID: invite.guild.id, code: invite.code });
};
