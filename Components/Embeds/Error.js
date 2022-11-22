const Discord = require("discord.js");

const ErrorEmbed = (message = "Something wrong happened. Try again later...") =>
  new Discord.EmbedBuilder()
    .setDescription("❌ " + message)
    .setColor("#ff0000");

module.exports = ErrorEmbed;
