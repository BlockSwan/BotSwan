const Discord = require("discord.js");

module.exports = {
  name: "warnlist",
  description: "Display the warns for a given user",
  permission: Discord.PermissionFlagsBits.ManageMessages,
  dm: false,
  category: "Moderation",
  options: [
    {
      type: "user",
      name: "member",
      description: "The user to check",
      required: true,
      autocomplete: false,
    },
  ],

  async run(bot, message, args, db) {
    let user = args.getUser("member");
    if (!user) return message.reply("No member");

    let member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply("No member");

    let userWarns;

    db.query(
      bot.function.queries.getWarn(message.guildId, user.id),
      async (err, userWarns) => {
        if (userWarns?.length < 1)
          return message.reply(`No warns for this user`);
        await userWarns.sort((a, b) => parseInt(b.date) - parseInt(a.date));

        let Embed = new Discord.EmbedBuilder()
          .setColor(bot.color)
          .setTitle(`${user.tag} Warns`)
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setFooter({ text: "Warns" });
        for (let i = 0; i < userWarns?.length; i++) {
          Embed.addFields([
            {
              name: `Warn n°${i + 1}`,
              value: `> **Author** : ${
                (await bot.users.fetch(userWarns[i].author)).tag
              }\n> **Reason** : \`${
                userWarns[i].reason
              }\`\n> **Date** : <t:${Math.floor(
                parseInt(userWarns[i].date) / 1000
              )}>`,
            },
          ]);
        }
        await message.reply({ embeds: [Embed] });
      }
    );
  },
};
