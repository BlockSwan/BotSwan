const Discord = require("discord.js");
const { MAX_XP_PER_MSG, XP_TO_LVL } = require("../constants");

module.exports = async (bot, message) => {
  let db = bot.db;

  if (message.author.bot || message.channel.type === Discord.ChannelType.DM)
    return;

  db.query(
    bot.function.queries.getGuild(message.guild.id),
    async (err, serverData) => {
      if (serverData?.length < 1) {
        db.query(bot.function.queries.initGuild(message.guild.id));
      }
      db.query(
        bot.function.queries.getUser(message.author.id, message.guildId),
        async (err, user) => {
          if (user?.length < 1) {
            let ID = await bot.function.createID("USER");
            db.query(
              bot.function.queries.initUser(
                ID,
                message.author.id,
                message.guildId
              )
            );
          } else {
            let xpToGive = Math.floor(Math.random() * MAX_XP_PER_MSG);
            db.query(
              bot.function.queries.addXp(
                message.author.id,
                message.guildId,
                parseInt(user[0].xp) + xpToGive
              )
            );

            let curr_lvl = XP_TO_LVL(user[0].xp);
            let newUserXp = parseInt(user[0].xp) + xpToGive;
            let xp = bot.function.calculXp(newUserXp);

            if (xp.lvl > curr_lvl && serverData[0].level !== "false") {
              let levelChannel = await message.guild.channels.cache.get(
                serverData[0].level
              );
              if (levelChannel) {
                await levelChannel.send(
                  `GG ${message.author}! You are now level \`${xp.lvl}\` and cumulating \`${xp.xp.current}\`xp`
                );
              }
            }
          }
        }
      );
    }
  );
};
