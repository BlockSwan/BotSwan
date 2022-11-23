const Discord = require("discord.js");

const ErrorEmbed = (message) =>
  new Discord.EmbedBuilder()
    .setDescription(
      "❌ " + message || "Something wrong happened. Try again later..."
    )
    .setColor("#ff0000");

module.exports = ErrorEmbed;
