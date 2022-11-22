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
    await db.query(
      bot.queries.getGuild(message.guildId),
      async (err, currentGuild) => {
        const levelChannel = bot.channels.cache.get(currentGuild[0].level);

        if (currentGuild[0].level !== message.channel.id) {
          return bot.function.reply.error(
            message,
            levelChannel
              ? `You can't use \`/leaderboard\` in this channel. Please try again in ${levelChannel}`
              : `This command is not allowed. Server Master must configure it with \`/setlevel\` `
          );
        } else {
          db.query(
            bot.queries.getAllUsers(message.guildId),
            async (err, AllUsersXp) => {
              await message.deferReply();
              if (AllUsersXp?.length < 1) return message.reply("No XP at all");

              const leaderboard = AllUsersXp?.sort(function (a, b) {
                return parseFloat(b.xp) - parseFloat(a.xp);
              });

              const Leaderboard = new LeaderBoard()
                .setBackground(
                  "https://4kwallpapers.com/images/walls/thumbs_3t/4530.png"
                )
                .setBot(bot)
                .setColorFont("#000000")
                .setGuild(message.guild);

              for (
                let i = 0;
                i < (AllUsersXp?.length > 10 ? 10 : AllUsersXp.length);
                i++
              ) {
                let Stats = bot.function.calculXp(leaderboard[i].xp);
                await Leaderboard.addUser(
                  await bot.users.fetch(leaderboard[i].discord_id),
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
          );
        }
      }
    );
  },
};
