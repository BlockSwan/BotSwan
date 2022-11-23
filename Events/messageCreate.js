const Discord = require("discord.js");
const { MAX_XP_PER_MSG, XP_TO_LVL } = require("../constants");

module.exports = async (bot, message) => {
  let db = bot.db;
  const { author, guild, channel } = message;

  if (author.bot || channel.type === Discord.ChannelType.DM) return;

  let guildData = await db.Guild.findOne({
    guildID: guild.id,
  });
  bot.log.query("read", "Reading Guild " + guild.id);

  if (!guildData) {
    await db.Guild.initGuild(guild);
    bot.log.query("write", "Adding Guild");
  }

  let user = await db.User.findOne({
    discordID: author.id,
    guildID: guild.id,
  });
  bot.log.query("read", "Reading Guild " + guild.id);

  if (!user) {
    await db.User.create({
      discordID: author.id,
      guildID: guild.id,
    });
    bot.log.query("write", "CREATING NEW USER" + author.id);
  } else {
    let xpToGive = Math.floor(Math.random() * MAX_XP_PER_MSG);
    await db.XP.create({
      discordID: author.id,
      guildID: guild.id,
      xp: xpToGive,
    });
    bot.log.query("write", "CREATING NEW XP ROW FOR USER " + author.id);

    let sumXP = await db.XP.getUserXP(user.discordID, guild.id);
    bot.log.query("read", "READING TOTAL XP FOR " + author.id);
    let currentLVL = XP_TO_LVL(sumXP);
    let previousLVL = XP_TO_LVL(sumXP - xpToGive);
    let xp = bot.function.calculXp(sumXP);
    if (currentLVL > previousLVL && guildData?.levelChannelID !== "false") {
      let levelChannel = await guild.channels.cache.get(
        guildData.levelChannelID
      );
      if (levelChannel) {
        await levelChannel.send(
          `GG ${author}! You are now level \`${xp.lvl}\` and cumulating \`${xp.xp.current}\`xp`
        );
      }
    }
  }
};
