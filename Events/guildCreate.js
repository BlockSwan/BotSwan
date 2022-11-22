const Discord = require("discord.js");

module.exports = async (bot, guild) => {
  let db = bot.db;

  db.query(bot.queries.getGuild(guild.id), async (err, guildData) => {
    if (guildData?.length < 1) {
      db.query(bot.queries.initGuild(guild.id));
    }
  });
};
