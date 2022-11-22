const Discord = require("discord.js");

module.exports = {
  name: "embed",
  description: "Embed a message to a channel",
  permission: Discord.PermissionFlagsBits.ManageMessages,
  dm: false,
  category: "Moderation",
  options: [
    {
      type: "channel",
      name: "channel",
      description: "The channel where the message will be sent",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "description",
      description: "The description",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "color",
      description: "The embeded color",
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

    let description = args.getString("description");
    if (!description || description.length <= 0)
      return bot.function.reply.error(message, "Description missing");

    let color = args.getString("color");
    if (!color || !/^#[0-9a-f]{6}/i.test(color)) color = bot.color;

    const file = new Discord.AttachmentBuilder(
      "Assets/imgs/thumbnail_horizon.png"
    );

    let Embed = new Discord.EmbedBuilder()
      .setColor(color)
      .setDescription(`${description.split("//n").join("\n")}`)
      .setAuthor({
        name: message.user.username + ` from Blockswan`,
        iconURL: message.user.displayAvatarURL({ extension: "jpg" }),
      })
      .setThumbnail("attachment://thumbnail_horizon.png");

    await channel.send({
      embeds: [Embed],
      files: [file],
    });
    try {
      await bot.function.reply.success(message, "Embed sent!");
    } catch (err) {}
  },
};
