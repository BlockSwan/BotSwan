const Discord = require("discord.js");

module.exports = () => {
  const modal = new Discord.ModalBuilder()
    .setTitle("New suggestion")
    .setCustomId("newSuggestion")
    .setComponents(
      new Discord.ActionRowBuilder().setComponents(
        new Discord.TextInputBuilder()
          .setLabel("Suggestion title:")
          .setMinLength(4)
          .setMaxLength(30)
          .setCustomId("suggestionTitle")
          .setStyle(Discord.TextInputStyle.Short)
      ),
      new Discord.ActionRowBuilder().setComponents(
        new Discord.TextInputBuilder()
          .setLabel("Tell us everything below:")
          .setMinLength(10)
          .setCustomId("suggestionContent")
          .setStyle(Discord.TextInputStyle.Paragraph)
      ),
      new Discord.ActionRowBuilder().setComponents(
        new Discord.TextInputBuilder()
          .setLabel("Tell us everything below:")
          .setMinLength(10)
          .setCustomId("stest")
          .setStyle(Discord.TextInputStyle.Paragraph)
      )
    );
  return modal;
};
