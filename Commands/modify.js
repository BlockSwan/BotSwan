const Discord = require("discord.js");
const constants = require("../constants");
const { FOURTEEN_DAYS } = constants;
module.exports = {
  name: "modify",
  description: "Modify a message sent in a channel",
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
      name: "msgid",
      description: "The ID of the message to modify in the channel",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "message",
      description: "The content to send",
      required: true,
      autocomplete: false,
    },
    {
      type: "attachment",
      name: "file1",
      description: "Any attached file",
      required: false,
      autocomplete: false,
    },
    {
      type: "attachment",
      name: "file2",
      description: "Any attached file",
      required: false,
      autocomplete: false,
    },
    {
      type: "attachment",
      name: "file3",
      description: "Any attached file",
      required: false,
      autocomplete: false,
    },
    {
      type: "attachment",
      name: "file4",
      description: "Any attached file",
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

    let messageId = args.getString("msgid");
    const msg = channel.messages.fetch(messageId);
    if (!messageId || !msg)
      return bot.function.reply.error(message, "No message to modify");
    let modifyMessage = await channel.messages.fetch(messageId);
    if (!modifyMessage)
      return bot.function.reply.error(message, "No message to modify");

    let content = args.getString("message");
    if (!content || content.length <= 0)
      return bot.function.reply.error(message, "You must modify some content");

    let files = [];
    for (let i = 1; i <= 4; i++) {
      let file = args.getAttachment(`file${i}`);
      if (file) files.push(file);
    }

    try {
      await bot.function.reply.success(message, "Message modified!");
      await modifyMessage.edit({
        content: `${content.split("//n").join("\n")}`,
        files: files,
      });
    } catch (err) {}
  },
};
