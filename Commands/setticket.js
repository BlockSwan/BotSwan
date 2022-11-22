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
    {
      type: "role",
      name: "everyone",
      description: "The everyone role",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args, db) {
    let state = args.getString("state");
    if (state !== "on" && state !== "off")
      return bot.function.reply.error(message, "State must be `on` or `off`");
    if (state === "off") {
      db.query(
        bot.queries.editTicketChannels(
          message.guild.id,
          "false",
          "false",
          "false"
        )
      );
      await bot.function.reply.success(message, "Tickets are disabled");
    } else {
      let ticket = args.getChannel("ticket");
      if (!ticket)
        return bot.function.reply.error(
          message,
          "Missing a channel to create the tickets"
        );
      ticket = await message.guild.channels.cache.get(ticket.id);
      if (!ticket || ticket.type !== 0)
        return bot.function.reply.error(message, "No  such channel");

      let transcript = args.getChannel("transcript");
      if (!transcript)
        return bot.function.reply.error(
          message,
          "Missing a channel to create the transcripts"
        );
      transcript = message.guild.channels.cache.get(transcript.id);
      if (!transcript || transcript.type !== 0)
        return bot.function.reply.error(message, "No  such channel");

      let parentTicket = args.getChannel("parentticket");
      if (!parentTicket)
        return bot.function.reply.error(
          message,
          "Missing a category to create the tickets channel"
        );
      parentTicket = message.guild.channels.cache.get(parentTicket.id);
      if (!parentTicket || parentTicket.type !== 4)
        return bot.function.reply.error(message, "No such parent channel");

      let everyone = args.getRole("everyone");
      if (!everyone)
        return bot.function.reply.error(message, "Missing the everyone role");

      console.log(
        message.guild.roles.everyone.id,
        typeof message.guild.roles.everyone.id
      );

      db.query(
        bot.queries.editTicketChannels(
          message.guild.id,
          ticket.id,
          transcript.id,
          parentTicket.id,
          message.guild.roles.everyone.id
        )
      );

      await bot.function.reply.success(
        message,
        `Ticketing is enable in with the following channel:\n Create ticket: ${ticket}\nTranscripts: ${transcript}\n Ticket parent: ${parentTicket}`
      );
    }
  },
};
