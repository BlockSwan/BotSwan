const Discord = require("discord.js");

module.exports = async (bot) => {
  bot.guilds.cache.forEach(async (guild) => {
    let guildData = await bot.db.Guild.findOne({ guildID: guild.id });

    if (guildData?.roleCounters?.length > 0) {
      for (let chan of guildData?.roleCounters) {
        let channel = await guild.channels.cache.get(chan.channel);
        if (channel) {
          let count = await bot.function.countRoleMember(guild, chan?.roleID);

          let text = chan?.description.replace("%%", count);
          channel.setName(text);
        }
      }
    }
  });
};
