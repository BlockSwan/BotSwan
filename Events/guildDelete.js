const Discord = require("discord.js");

module.exports = async (bot, guild) => {
  let db = bot.db;

  bot.invites.delete(guild.id);

  let data = await db.Guild.findOne({ GuildID: guild.id });
  if (!data) {
    await db.Guild.initGuild(guild);
  }
  await db.Guild.updateOne({ guildID: guild.id }, { isDelete: true });
};
