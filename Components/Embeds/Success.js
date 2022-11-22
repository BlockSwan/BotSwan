const Discord = require("discord.js");

const SuccessEmbed = (
  message = `Command done successfully! Thanks for using the **${config.emojiLogo} DAO **!`,
  fields = []
) => {
  let embed = new Discord.EmbedBuilder()
    .setDescription("✅ " + message)
    .setColor("Green");
  for (let i = 0; i < fields?.length; i++) {
    embed.addFields([
      {
        name: fields[i].name,
        value: fields[i].value,
      },
    ]);
  }
  return embed;
};

module.exports = SuccessEmbed;
