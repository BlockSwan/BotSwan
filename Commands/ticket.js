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
    const { guildId, options, channel } = message;
    const action = options.getString("action");
    const member = options.getUser("member");

    db.query(bot.queries.getGuild(guildId), async (err, guildData) => {
      if (guildData[0].ticket === "false")
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

        await message.guild.channels.cache.get(guildData[0].ticket)?.send({
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

        db.query(
          bot.queries.getTicket(channel.id, guildId),
          async (err, res) => {
            let ticket = res[0];
            console.log(ticket);
            if (!ticket || ticket === undefined || ticket === null)
              return bot.function.reply.error(
                message,
                "Seems like there is no such ticket"
              );

            switch (action) {
              case "add":
                if (ticket.members_json?.includes(member.id))
                  return bot.function.reply.error(
                    message,
                    "User already in the ticket"
                  );

                let new_json = JSON.parse(ticket.members_json) || [];
                new_json.push(member.id);
                db.query(
                  bot.queries.editTicketMembers(
                    channel.id,
                    guildId,
                    JSON.stringify(new_json)
                  )
                );

                channel.permissionOverwrites.edit(member.id, {
                  SendMessages: true,
                  ViewChannel: true,
                  ReadMessageHistory: true,
                });

                message.reply({
                  embeds: [
                    embed
                      .setColor("#7CFC00")
                      .setDescription(
                        `${member} has been added to the ticket.`
                      ),
                  ],
                });
                break;
              case "remove":
                if (!ticket.members_json?.includes(member.id))
                  return bot.function.reply.error(
                    message,
                    "User not in the ticket"
                  );
                let json = JSON.parse(ticket.members_json) || [];
                let members = json.filter((e) => e !== member.id);
                db.query(
                  bot.queries.editTicketMembers(
                    channel.id,
                    guildId,
                    JSON.stringify(members)
                  )
                );

                channel.permissionOverwrites.edit(member.id, {
                  SendMessages: false,
                  ViewChannel: false,
                  ReadMessageHistory: false,
                });

                message.reply({
                  embeds: [
                    embed
                      .setColor("#7CFC00")
                      .setDescription(
                        `${member} has been removed from the ticket.`
                      ),
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
        );
      }
    });
  },
};
