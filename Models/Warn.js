const { model, Schema } = require("mongoose");

let warnSchema = new Schema(
  {
    guildID: String,
    discordID: String,
    authorID: String,
    warnID: String,
    reason: String,
    date: Number,
  },
  {
    statics: {
      async initWarn(message, user, id, reason) {
        await this.create({
          guildID: message.guild.id,
          discordID: user.id,
          authorID: message.user.id,
          warnID: id,
          reason: reason,
          date: Date.now(),
        });
      },
    },
  }
);

warnSchema.set("timestamps", true);

module.exports = model("Warn", warnSchema);
