const { model, Schema } = require("mongoose");

let ticketSchema = new Schema(
  {
    guildID: String,
    ticketID: String,
    channelID: String,
    membersID: [String],
    isClose: Boolean,
    isLock: Boolean,
    isTranscript: Boolean,
    type: String,
    date: Number,
  },
  {
    statics: {
      async initTicket(guild, ticketId, channelId, membersId, type) {
        await this.create({
          guildID: guild.id,
          ticketID: ticketId,
          channelID: channelId,
          membersID: membersId,
          isClose: false,
          isLock: false,
          isTranscript: true,
          type: type,
          date: Date.now(),
        });
      },
    },
  }
);

ticketSchema.set("timestamps", true);

module.exports = model("Ticket", ticketSchema);
