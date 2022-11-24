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
    const { guild, guildId } = message;

    let user;
    if (args.getUser("member")) {
      user = args.getUser("member");
      if (!user || !guild.members.cache.get(user?.id)) {
        return message.reply("No member");
      }
    } else user = message.user;

    let guildData = await db.Guild.findOne({ guildID: guildId });
    bot.log.query("read", "READing Guild " + guildId);

    const levelChannel = bot.channels.cache.get(guildData.levelChannelID);

    if (levelChannel?.id !== message.channel.id) {
      return bot.function.reply.error(
        message,
        levelChannel
          ? `You can't use \`/rank\` in this channel. Please try again in ${levelChannel}`
          : `This command is not allowed. Server Master must configure it with \`/setlevel\` `
      );
    } else {
      let userXP = await db.XP.getUserXP(user.id, guild.id);

      bot.log.query("read", "READing USER " + user.id);

      if (!userXP) return message.reply("This member has `0 xp`");
      await message.deferReply();

      let userRank = await db.XP.getUserRank(user.id, guildId);
      bot.log.query("read", "READing USER RANK FOR " + user.id);

      let Stats = bot.function.calculXp(userXP);
      let inviteCount = await db.User.getUserInvitation(guildId, user.id);

      let Card = await new Rank()
        .setBackground("/Assets/imgs/rank_background.png")
        .setBot(bot)
        .setColorFont("#000000")
        .setRank(userRank)
        .setUser(user)
        .setColorProgressBar("#83f28f")
        .setGuild(guild)
        .setXp(Stats.xp.gained)
        .setLevel(Stats.lvl)
        .setXpNeed(Stats.xp.needed)
        .setInvite(inviteCount)
        .toCard();

      await message.followUp({
        files: [
          new Discord.AttachmentBuilder(Card.toBuffer(), {
            name: "rank.png",
          }),
        ],
      });
    }
  },
};
