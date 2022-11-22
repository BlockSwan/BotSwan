const Discord = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
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

    db.query(bot.queries.getTicket(channel.id, guild.id), async (err, res) => {
      let ticket = res[0];
      if (!ticket || ticket === undefined || ticket === null) return;
      const tmp = JSON.parse(ticket.members_json) || [];

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
              message,
              "Ticket is already being deleted"
            );

          const transcriptFile = await createTranscript(channel, {
            limit: -1,
            returrnBuffer: false,
            fileName: `${member.user.username}-ticket-${ticket.type}-${ticket.ticket_id}.html`,
          });

          db.query(bot.queries.closeTicket(ticket.ticket_id));

          const transcriptEmbed = new Discord.EmbedBuilder()
            .setTitle(
              `Transcript Type: ${ticket.type}\nId: ${ticket.ticket_id}`
            )
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

          db.query(bot.queries.getGuild(guild.id), async (err, guildData) => {
            let transcript = guildData[0].transcript;
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
          });
          break;

        case "transcript":
          let newWithTranscript = !ticket.isTranscript;
          db.query(
            bot.queries.toggleTicketTranscript(
              ticket.ticket_id,
              newWithTranscript
            )
          );

          embed.setDescription(
            `Public transcript has been ${
              newWithTranscript ? "enabled" : "disabled"
            }`
          );
          return interaction.reply({ embeds: [embed] });

        case "lockTicket":
          if (
            !member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)
          )
            return bot.function.reply.error(
              interaction,
              "You don't have the permission for that"
            );

          if (ticket.isLock === true)
            return bot.function.reply.error(
              interaction,
              "This ticket is already locked."
            );

          db.query(bot.queries.lockTicket(ticket.ticket_id));

          embed.setDescription("Ticket was locked successfully");
          console.log(tmp);
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
          if (
            !member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)
          )
            return bot.function.reply.error(
              interaction,
              "You don't have the permission for that"
            );

          if (ticket.isLock === false)
            return bot.function.reply.error(
              interaction,
              "Ticket is already unlocked"
            );
          db.query(bot.queries.unlockTicket(ticket.ticket_id));

          embed.setDescription("Ticket was unlocked successfully");

          for (let i = 0; i < tmp.length; i++) {
            let fetchMember = await guild.members.cache.get(tmp[i]);
            channel.permissionOverwrites.edit(fetchMember, {
              SendMessages: true,
            });
          }
          return interaction.reply({ embeds: [embed] });
      }
    });
  },
};
