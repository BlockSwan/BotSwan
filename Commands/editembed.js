const Discord = require("discord.js");

module.exports = {
  name: "editembed",
  description: "Edit an embed a message in a channel",
  permission: Discord.PermissionFlagsBits.ManageMessages,
  dm: false,
  category: "Moderation",
  options: [
    {
      type: "channel",
      name: "channel",
      description: "The channel where the message is sent",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "msgid",
      description: "The ID of the message to modify in the channel",
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

    let messageId = args.getString("msgid");
    const msg = channel.messages.fetch(messageId);
    if (!messageId || !msg)
      return bot.function.reply.error(message, "No message to modify");
    let modifyMessage = await channel.messages.fetch(messageId);
    if (!modifyMessage)
      return bot.function.reply.error(message, "No message to modify");

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

    try {
      await modifyMessage.edit({
        embeds: [Embed],
        files: [file],
      });
      await bot.function.reply.success(message, "Embed modified!");
    } catch (err) {}
  },
};
