const Discord = require("discord.js");
const LeaderBoard = require("../Class/LeaderBoard");

module.exports = {
  name: "leaderboard",
  description: "Display the XP leaderboard",
  permission: "None",
  dm: false,
  category: "Experience",
  options: [],

  async run(bot, message, args, db) {
    const { guildId, channel, guild } = message;

    let guildData = await db.Guild.findOne({ guildID: guildId });
    bot.log.query("read", "reading  Guild " + guildId);

    const levelChannel = bot.channels.cache.get(guildData?.levelChannelID);

    if (levelChannel?.id !== channel.id) {
      return bot.function.reply.error(
        message,
        levelChannel
          ? `You can't use \`/leaderboard\` in this channel. Please try again in ${levelChannel}`
          : `This command is not allowed. Server Master must configure it with \`/setlevel\` `
      );
    } else {
      let leaderboard = await db.XP.getLeaderboard(guildId);
      console.log(leaderboard);
      bot.log.query("read", "reading guild " + guildId);

      await message.deferReply();
      if (leaderboard?.length < 1) return message.reply("No XP at all");

      const Leaderboard = new LeaderBoard()
        .setBackground(
          "https://4kwallpapers.com/images/walls/thumbs_3t/4530.png"
        )
        .setBot(bot)
        .setColorFont("#000000")
        .setGuild(guild);

      for (
        let i = 0;
        i < (leaderboard?.length > 10 ? 10 : leaderboard.length);
        i++
      ) {
        let Stats = bot.function.calculXp(leaderboard[i].sum_xp);
        await Leaderboard.addUser(
          await bot.users.fetch(leaderboard[i]._id),
          parseInt(Stats.lvl),
          parseInt(Stats.xp.current),
          parseInt(Stats.xp.required)
        );
      }
      const Image = await Leaderboard.toLeaderboard();
      await message.followUp({
        files: [
          new Discord.AttachmentBuilder(Image.toBuffer(), {
            name: "leaderboard.png",
          }),
        ],
      });
    }
  },
};
