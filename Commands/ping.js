const Discord = require("discord.js");

module.exports = {
  name: "ping",
  description: "Display the latency",
  permission: "None",
  dm: true,
  category: "Information",

  async run(bot, message) {
    await message.reply(`Pong: \`${bot.ws.ping}\``);
  },
};
