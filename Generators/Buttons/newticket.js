const Discord = require("discord.js");
module.exports = {
  async run(bot, interaction, db) {
    const ticketId = await bot.function.createID("TICKET");

    // if (
    //   !interaction.guild.members.me.permissions.has(
    //     Discord.PermissionFlagsBits.ManageChannels
    //   )
    // )
    //   interaction.reply({
    //     content: "I don't have permissions for this",
    //     ephemeral: true,
    //   });
    db.query(
      bot.queries.getGuild(interaction.guild.id),
      async (err, guildData) => {
        try {
          await interaction.guild.channels
            .create({
              name: `${interaction.user.username}-${ticketId}`,
              type: Discord.ChannelType.GuildText,
              parent: guildData[0].parentTicket,
              permissionOverwrites: [
                {
                  id: guildData[0]?.everyone,
                  deny: [
                    Discord.PermissionFlagsBits.ViewChannel,
                    Discord.PermissionFlagsBits.SendMessages,
                    Discord.PermissionFlagsBits.ReadMessageHistory,
                  ],
                },
                {
                  id: interaction.member.id,
                  allow: [
                    Discord.PermissionFlagsBits.ViewChannel,
                    Discord.PermissionFlagsBits.SendMessages,
                    Discord.PermissionFlagsBits.ReadMessageHistory,
                  ],
                },
              ],
            })
            .then(async (channel) => {
              let members_json = [interaction.member.id];
              db.query(
                bot.queries.initTicket(
                  interaction.guild.id,
                  channel.id,
                  ticketId,
                  false,
                  false,
                  true,
                  interaction.customId,
                  JSON.stringify(members_json)
                )
              );

              const embed = new Discord.EmbedBuilder()
                .setTitle(
                  `${interaction.guild.name} - Ticket: ${interaction.customId}`
                )
                .setDescription(
                  `Hello ${interaction.user}.\nOur team will contact you shortly. Please describe your issue in this channel.`
                )
                .setFooter({
                  text: `${ticketId}`,
                  iconURL: interaction.member.displayAvatarURL({
                    dynamic: true,
                  }),
                })
                .setTimestamp();

              const buttons = new Discord.ActionRowBuilder().setComponents(
                new Discord.ButtonBuilder()
                  .setCustomId("closeTicket")
                  .setLabel("Close ticket")
                  .setStyle(Discord.ButtonStyle.Danger)
                  .setEmoji("❎"),
                new Discord.ButtonBuilder()
                  .setCustomId("lockTicket")
                  .setLabel("Lock the ticket")
                  .setStyle(Discord.ButtonStyle.Secondary)
                  .setEmoji("🔐"),
                new Discord.ButtonBuilder()
                  .setCustomId("unlockTicket")
                  .setLabel("Unlock the ticket")
                  .setStyle(Discord.ButtonStyle.Success)
                  .setEmoji("🔓"),
                new Discord.ButtonBuilder()
                  .setCustomId("transcript")
                  .setLabel("Enable/Disable public transcript")
                  .setStyle(Discord.ButtonStyle.Primary)
                  .setEmoji("📝")
              );

              channel.send({
                embeds: [embed],
                components: [buttons],
              });
              bot.function.reply.success(
                interaction,
                `${interaction.user}, you successfully created a new ticket. Access it at ${channel}.`
              );
            });
        } catch (err) {
          console.log(err);
        }
      }
    );
  },
};
