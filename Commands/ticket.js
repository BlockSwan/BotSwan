const Discord = require("discord.js");

module.exports = {
  name: "ticket",
  description: "Instanciate the ticket message with buttons",
  permission: Discord.PermissionFlagsBits.ManageChannels,
  dm: true,
  category: "Ticket",
  options: [
    {
      type: "string",
      name: "action",
      description: "The ticket action",
      required: false,
      autocomplete: true,
    },
    {
      type: "user",
      name: "member",
      description: "A member from the server",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args, db) {
    const { guildId, options, channel, guild } = message;
    const action = options.getString("action");
    const member = options.getUser("member");

    let guildData = await db.Guild.findOne({ guildID: guildId });
    bot.log.query("read", "reading  Guild " + guildId);

    if (guildData.openTicketChannelID === "false")
      return bot.function.reply.error(
        message,
        `The ticket feature is disabled. Please refer to \`setticket\`.`
      );

    if (!action && !member) {
      let embed = new Discord.EmbedBuilder().setDescription(
        "You can create a new ticket and receive personal support from the team members.\nPlease make sure not to abuse the ticketing featuring. Leverage the community, someone out there must know."
      );

      const buttons = new Discord.ActionRowBuilder().setComponents(
        new Discord.ButtonBuilder()
          .setCustomId("member")
          .setLabel("Report member")
          .setStyle(Discord.ButtonStyle.Danger)
          .setEmoji("⚠️"),
        new Discord.ButtonBuilder()
          .setCustomId("bug")
          .setLabel("dApp bug")
          .setStyle(Discord.ButtonStyle.Secondary)
          .setEmoji("🪲"),

        new Discord.ButtonBuilder()
          .setCustomId("discord")
          .setLabel("Discord support")
          .setStyle(Discord.ButtonStyle.Primary)
          .setEmoji("💻"),
        new Discord.ButtonBuilder()
          .setCustomId("other")
          .setLabel("Others")
          .setStyle(Discord.ButtonStyle.Success)
          .setEmoji("🎫")
      );

      await guild.channels.cache.get(guildData.openTicketChannelID)?.send({
        embeds: [embed],
        components: [buttons],
      });
      return bot.function.reply.success(
        message,
        `Ticket message has been sent!`
      );
    } else if (!action || !member)
      return bot.function.reply.error(
        message,
        "Either use options, either don't"
      );
    else if (action && member) {
      embed = new Discord.EmbedBuilder();

      let ticket = await db.Ticket.findOne({
        guildID: guildId,
        channelID: channel.id,
      });
      bot.log.query("read", "reading  Guild " + guildId);

      if (!ticket || ticket === undefined || ticket === null)
        return bot.function.reply.error(
          message,
          "Seems like there is no such ticket"
        );

      switch (action) {
        case "add":
          if (ticket.membersID?.includes(member.id))
            return bot.function.reply.error(
              message,
              "User already in the ticket"
            );

          ticket.membersID.push(member.id);
          await ticket.save();
          bot.log.query("write", "writing to ticket in channel" + channel.id);

          channel.permissionOverwrites.edit(member.id, {
            SendMessages: true,
            ViewChannel: true,
            ReadMessageHistory: true,
          });

          message.channel.send({
            embeds: [
              embed
                .setColor("#7CFC00")
                .setDescription(`${member} has been added to the ticket.`),
            ],
          });

          bot.function.reply.success(message, "User added!");
          break;
        case "remove":
          if (!ticket.membersID?.includes(member.id))
            return bot.function.reply.error(message, "User not in the ticket");
          let members = ticket.membersID?.filter((e) => e !== member.id);
          await db.Ticket.updateOne(
            { guildID: guildId, channelID: channel.id },
            {
              membersID: members,
            }
          );
          bot.log.query("write", "writing to ticket in channel" + channel.id);

          channel.permissionOverwrites.edit(member.id, {
            SendMessages: false,
            ViewChannel: false,
            ReadMessageHistory: false,
          });

          message.reply({
            embeds: [
              embed
                .setColor("#7CFC00")
                .setDescription(`${member} has been removed from the ticket.`),
            ],
          });
          break;
        default:
          message.reply({
            content: "The action must be `add` or `remove`.",
            ephemeral: true,
          });
          break;
      }
    }
  },
};
