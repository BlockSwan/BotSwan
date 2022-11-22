const Discord = require("discord.js");
const constants = require("../constants");
const { FOURTEEN_DAYS } = constants;
module.exports = {
  name: "clear",
  description: "Clear a channel",
  permission: Discord.PermissionFlagsBits.ManageMessages,
  dm: false,
  category: "Moderation",
  options: [
    {
      type: "integer",
      name: "number",
      description: "The number of message to delete",
      required: true,
      autocomplete: false,
    },
    {
      type: "channel",
      name: "channel",
      description: "The channel where messages will be deleted",
      required: false,
      autocomplete: false,
    },
    {
      type: "user",
      name: "target",
      description: "The target user to delete messsages",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {
    let channel = args.getChannel("channel");
    if (!channel) channel = message.channel;

    if (
      channel.id !== message.channel.id &&
      !message.guild.channels.cache.get(channel.id)
    )
      return bot.function.reply.error(message, "No channel");

    let number = args.getInteger("number");
    if (!number || number >= 100 || number <= 0)
      return bot.function.reply.error(
        message,
        "The number of message to delete is required and must be between `0` and `99` included."
      );

    let target = args.getUser("target");

    const messages = await channel.messages.fetch({
      limit: number + 1,
    });

    let Embed = new Discord.EmbedBuilder().setColor(0xffffff);

    if (target) {
      let i = 0;
      const filtered = [];
      (await messages).filter((msg) => {
        if (msg.author.id === target.id && number > i) {
          filtered.push(msg);
          i++;
        }
      });

      await channel.bulkDelete(filtered).then((messages) => {
        Embed.setDescription(
          `Successfuly deleted \`${messages.size}\` message(s) from ${target} in the channel ${channel}`
        ).setColor("Green");
        message.reply({ embeds: [Embed], ephemeral: true });
      });
    } else {
      await channel.bulkDelete(number, true).then((messages) => {
        Embed.setDescription(
          `Successfuly deleted \`${messages.size}\` message(s) in the channel ${channel}`
        ).setColor("Green");
        message.reply({ embeds: [Embed], ephemeral: true });
      });
    }
  },
};
