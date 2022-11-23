const Discord = require("discord.js");

module.exports = async (bot, guild) => {
  let db = bot.db;

  let data = await db.Guild.findOne({ GuildID: guild.id });
  console.log(data);
  if (!data) {
    await db.Guild.initGuild(guild);
  }
};
