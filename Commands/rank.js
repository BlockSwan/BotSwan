const Discord = require("discord.js");
const Rank = require("../Class/Rank");

module.exports = {
  name: "rank",
  description: "Display the XP of a member",
  permission: "None",
  dm: false,
  category: "Experience",
  options: [
    {
      type: "user",
      name: "member",
      description: "The member to see the xp",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args, db) {
    let user;
    if (args.getUser("member")) {
      user = args.getUser("member");
      if (!user || !message.guild.members.cache.get(user?.id)) {
        return message.reply("No member");
      }
    } else user = message.user;

    db.query(
      bot.queries.getGuild(message.guildId),
      async (err, currentGuild) => {
        const levelChannel = bot.channels.cache.get(currentGuild[0].level);

        if (currentGuild[0].level !== message.channel.id) {
          return bot.function.reply.error(
            message,
            levelChannel
              ? `You can't use \`/rank\` in this channel. Please try again in ${levelChannel}`
              : `This command is not allowed. Server Master must configure it with \`/setlevel\` `
          );
        } else {
          db.query(
            bot.queries.getUser(user.id, message.guildId),
            async (err, userXp) => {
              if (userXp?.length < 1)
                return message.reply("This member has `0 xp`");
              await message.deferReply();

              db.query(
                bot.queries.getAllUsers(message.guildId),
                async (err, AllUsersXp) => {
                  const leaderboard = AllUsersXp.sort(function (a, b) {
                    return parseFloat(b.xp) - parseFloat(a.xp);
                  });

                  let rank =
                    leaderboard.findIndex((r) => r.discord_id === user.id) + 1;

                  let Stats = bot.function.calculXp(userXp[0].xp);

                  let Card = await new Rank()
                    .setBackground("/Assets/imgs/rank_background.png")
                    .setBot(bot)
                    .setColorFont("#000000")
                    .setRank(rank)
                    .setUser(user)
                    .setColorProgressBar("#83f28f")
                    .setGuild(message.guild)
                    .setXp(Stats.xp.gained)
                    .setLevel(Stats.lvl)
                    .setXpNeed(Stats.xp.needed)
                    .toCard();

                  await message.followUp({
                    files: [
                      new Discord.AttachmentBuilder(Card.toBuffer(), {
                        name: "rank.png",
                      }),
                    ],
                  });
                }
              );
            }
          );
        }
      }
    );
  },
};
