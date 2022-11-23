const Discord = require("discord.js");
const { emoji } = require("../../constants");
module.exports = {
  async run(bot, interaction, db) {
    const { guildId } = interaction;
    let guildData = await db.Guild.findOne({ guildID: guildId });
    bot.log.query("read", "reading  Guild " + guildId);

    if (!guildData || guildData.suggestChannelID === "false") return;
    const msg = interaction.fields.getTextInputValue("suggestionContent");
    const title = interaction.fields.getTextInputValue("suggestionTitle");
    let channel = interaction.guild.channels.cache.get(
      guildData.suggestChannelID
    );
    if (!channel) return;

    let Embed = new Discord.EmbedBuilder()
      .setColor("#2596be")
      .setTitle(title)
      .setFooter({
        text: `by ${interaction.user.username}#${interaction.user.discriminator}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(msg)
      .setTimestamp();

    console.log(interaction.user);

    const answer = await channel.send({
      embeds: [Embed],
      fetchReply: true,
    });
    answer.react("❌");
    answer.react("✅");
    bot.function.reply.success(interaction, "Submitted. Thanks!");
    try {
      await interaction.user.send(
        `Your suggestion has been created in ${channel}.\nWe are really greatful for your contribution to the growth of the **${emoji} Blockswan DAO**`
      );
    } catch (err) {}
  },
};
