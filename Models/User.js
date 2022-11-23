const { model, Schema } = require("mongoose");

let userSchema = new Schema({
  discordID: String,
  guildID: String,
});

userSchema.set("timestamps", true);

module.exports = model("User", userSchema);
