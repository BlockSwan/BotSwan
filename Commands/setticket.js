const Discord = require("discord.js");

module.exports = {
  name: "setticket",
  description: "Set the ticket channel",
  permission: Discord.PermissionFlagsBits.ManageGuild,
  dm: false,
  category: "Administration",
  options: [
    {
      type: "string",
      name: "state",
      description: "State of the ticket",
      required: true,
      autocomplete: true,
    },
    {
      type: "channel",
      name: "ticket",
      description: "The channel to open ticket",
      required: false,
      autocomplete: false,
    },
    {
      type: "channel",
      name: "transcript",
      description: "The channel to send transcript",
      required: false,
      autocomplete: false,
    },
    {
      type: "channel",
      name: "parentticket",
      description: "The category where tickets channel will be created",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args, db) {
    const { guildId, guild } = message;
    let state = args.getString("state");
    if (state !== "on" && state !== "off")
      return bot.function.reply.error(message, "State must be `on` or `off`");
    if (state === "off") {
      await db.Guild.updateOne(
        { guildID: guildId },
        {
          openTicketChannelID: "false",
          transcriptChannelID: "false",
          parentTicketChannelID: "false",
        }
      );
      bot.log.query("write", "Writing to Guild " + guildId);
      await bot.function.reply.success(message, "Tickets are disabled");
    } else {
      let ticket = args.getChannel("ticket");
      if (!ticket)
        return bot.function.reply.error(
          message,
          "Missing a channel to create the tickets"
        );
      ticket = await guild.channels.cache.get(ticket.id);
      if (!ticket || ticket.type !== 0)
        return bot.function.reply.error(message, "No  such channel");

      let transcript = args.getChannel("transcript");
      if (!transcript)
        return bot.function.reply.error(
          message,
          "Missing a channel to create the transcripts"
        );
      transcript = guild.channels.cache.get(transcript.id);
      if (!transcript || transcript.type !== 0)
        return bot.function.reply.error(message, "No  such channel");

      let parentTicket = args.getChannel("parentticket");
      if (!parentTicket)
        return bot.function.reply.error(
          message,
          "Missing a category to create the tickets channel"
        );
      parentTicket = guild.channels.cache.get(parentTicket.id);
      if (!parentTicket || parentTicket.type !== 4)
        return bot.function.reply.error(message, "No such parent channel");

      let everyoneRoleID = guild.roles.everyone.id;
      await db.Guild.updateOne(
        { guildID: guildId },
        {
          openTicketChannelID: ticket.id,
          transcriptChannelID: transcript.id,
          parentTicketChannelID: parentTicket.id,
          everyoneRoleID: everyoneRoleID,
        }
      );
      bot.log.query("write", "Writing to Guild " + guildId);

      await bot.function.reply.success(
        message,
        `Ticketing is enable with the following channel:\n Create ticket: ${ticket}\nTranscripts: ${transcript}\n Ticket parent: ${parentTicket}`
      );
    }
  },
};
