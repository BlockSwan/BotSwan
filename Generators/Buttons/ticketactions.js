const Discord = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
const { GuildFeature } = require("discord.js");
module.exports = {
  async run(bot, interaction, db) {
    const { guild, member, customId, channel } = interaction;

    if (
      !guild.members.me.permissions.has(
        Discord.PermissionFlagsBits.ManageChannels
      )
    )
      return bot.function.reply.error(
        interaction,
        "I don't have permission for this"
      );

    const embed = new Discord.EmbedBuilder().setColor(bot.color);
    let ticket = await db.Ticket.findOne({
      guildID: guild.id,
      channelID: channel.id,
    });

    if (!ticket || ticket === undefined || ticket === null) return;
    const tmp = ticket.membersID || [];

    let members = [];
    for (let i = 0; i < tmp.length; i++) {
      let fetchMember = await guild.members.cache.get(tmp[i]);
      if (!fetchMember) return;
      members.push(fetchMember);
    }

    switch (customId) {
      case "closeTicket":
        if (ticket.isClose === true)
          return bot.function.reply.error(
            interaction,
            "Ticket is already being deleted"
          );

        const transcriptFile = await createTranscript(channel, {
          limit: -1,
          returrnBuffer: false,
          fileName: `${member.user.username}-ticket-${ticket.type}-${ticket.ticketID}.html`,
        });

        await db.Ticket.updateOne(
          { ticketID: ticket.ticketID },
          { isClose: true }
        );
        bot.log.query("write", "updating ticket " + ticket.ticketID);

        const transcriptEmbed = new Discord.EmbedBuilder()
          .setTitle(`Transcript Type: ${ticket.type}\nId: ${ticket.ticketID}`)
          .setFooter({
            text: member.user.tag,
            iconURL: member.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp();
        const transcriptProcess = new Discord.EmbedBuilder()
          .setTitle("Saving transcript...")
          .setDescription(
            "Ticket will be closed in 10seconds. enable DM's for the ticket transcript."
          )
          .setColor("#ff0000")
          .setFooter({
            text: member.user.tag,
            iconURL: member.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp();

        let guildData = await db.Guild.findOne({ guildID: guild.id });
        bot.log.query("read", "reading guild " + guild.id);

        let transcript = guildData.transcriptChannelID;
        const res = await guild.channels.cache.get(transcript).send({
          embeds: ticket.isTranscript
            ? [transcriptEmbed]
            : [
                transcriptEmbed.setDescription(
                  "Public transcript has been disabled for this ticket."
                ),
              ],
          files: ticket.isTranscript ? [transcriptFile] : null,
        });

        channel.send({ embeds: [transcriptProcess] });
        setTimeout(function () {
          member
            .send({
              embeds: [
                transcriptEmbed.setDescription(
                  ticket.isTranscript
                    ? `Access your ticket transcript: ${res.url}`
                    : "Your ticked has public transcript disabled."
                ),
              ],
              files: ticket.isTranscript ? null : [transcriptFile],
            })
            .catch(() =>
              channel.send("Could not send transcript to direct messages")
            );
          channel.delete();
        }, 10000);
        break;

      case "transcript":
        let newWithTranscript = !ticket.isTranscript;

        await db.Ticket.updateOne(
          { ticketID: ticket.ticketID },
          { isTranscript: newWithTranscript }
        );
        bot.log.query("write", "updating ticket " + ticket.ticketID);

        embed.setDescription(
          `Public transcript has been ${
            newWithTranscript ? "enabled" : "disabled"
          }`
        );
        return interaction.reply({ embeds: [embed] });

      case "lockTicket":
        if (!member.permissions.has(Discord.PermissionFlagsBits.ManageChannels))
          return bot.function.reply.error(
            interaction,
            "You don't have the permission for that"
          );

        if (ticket.isLock === true)
          return bot.function.reply.error(
            interaction,
            "This ticket is already locked."
          );

        await db.Ticket.updateOne(
          { ticketID: ticket.ticketID },
          { isLock: true }
        );
        bot.log.query("write", "updating ticket " + ticket.ticketID);

        embed.setDescription("Ticket was locked successfully");
        for (let i = 0; i < tmp.length; i++) {
          let fetchMember = await guild.members.cache.get(tmp[i]);
          if (
            !fetchMember.permissions.has(
              Discord.PermissionFlagsBits.ManageChannels
            )
          )
            console.log(fetchMember);
          channel.permissionOverwrites.edit(fetchMember, {
            SendMessages: false,
          });
        }
        return interaction.reply({ embeds: [embed] });

      case "unlockTicket":
        if (!member.permissions.has(Discord.PermissionFlagsBits.ManageChannels))
          return bot.function.reply.error(
            interaction,
            "You don't have the permission for that"
          );

        if (ticket.isLock === false)
          return bot.function.reply.error(
            interaction,
            "Ticket is already unlocked"
          );
        await db.Ticket.updateOne(
          { ticketID: ticket.ticketID },
          { isLock: false }
        );
        bot.log.query("write", "updating ticket " + ticket.ticketID);

        embed.setDescription("Ticket was unlocked successfully");

        for (let i = 0; i < tmp.length; i++) {
          let fetchMember = await guild.members.cache.get(tmp[i]);
          channel.permissionOverwrites.edit(fetchMember, {
            SendMessages: true,
          });
        }
        return interaction.reply({ embeds: [embed] });
    }
  },
};
