const Discord = require("discord.js");

module.exports = async (bot, member) => {
  let db = bot.db;
  const { guild, user } = member;

  let dbUser = await db.User.findOne({
    GuildID: guild?.id,
    discordID: user?.id,
  });
  if (dbUser) {
    await db.User.updateMembership(user?.id, guild.id, false);
  }
};
