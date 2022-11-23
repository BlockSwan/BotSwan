const Discord = require("discord.js");
module.exports = {
  async run(bot, interaction, db) {
    const ticketId = await bot.function.createID("TICKET");
    const { guild, guildId, user, member } = interaction;

    // if (
    //   !interaction.guild.members.me.permissions.has(
    //     Discord.PermissionFlagsBits.ManageChannels
    //   )
    // )
    //   interaction.reply({
    //     content: "I don't have permissions for this",
    //     ephemeral: true,
    //   });
    let guildData = await db.Guild.findOne({ guildID: guildId });
    bot.log.query("read", "reading guild " + guildId);
    if (
      !guildData ||
      guildData.openTicketChannelID === "false" ||
      guildData.transcriptChannelID === "false" ||
      guildData.parentTicketChannelID === "false" ||
      guildData.everyoneRoleID === "false"
    )
      return;
    try {
      await guild.channels
        .create({
          name: `${user.username}-${ticketId}`,
          type: Discord.ChannelType.GuildText,
          parent: guildData?.parentTicketChannelID,
          permissionOverwrites: [
            {
              id: guildData.everyoneRoleID,
              deny: [
                Discord.PermissionFlagsBits.ViewChannel,
                Discord.PermissionFlagsBits.SendMessages,
                Discord.PermissionFlagsBits.ReadMessageHistory,
              ],
            },
            {
              id: member.id,
              allow: [
                Discord.PermissionFlagsBits.ViewChannel,
                Discord.PermissionFlagsBits.SendMessages,
                Discord.PermissionFlagsBits.ReadMessageHistory,
              ],
            },
          ],
        })
        .then(async (channel) => {
          let membersID = [member.id];
          await db.Ticket.initTicket(
            guild,
            ticketId,
            channel.id,
            membersID,
            interaction.customId
          );
          bot.log.query("write", "CREATING Ticket" + ticketId);

          const embed = new Discord.EmbedBuilder()
            .setTitle(`${guild.name} - Ticket: ${interaction.customId}`)
            .setDescription(
              `Hello ${user}.\nOur team will contact you shortly. Please describe your issue in this channel.`
            )
            .setFooter({
              text: `${ticketId}`,
              iconURL: member.displayAvatarURL({
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
  },
};
