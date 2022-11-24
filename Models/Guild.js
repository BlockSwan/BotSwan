const { model, Schema } = require("mongoose");

let guildSchema = new Schema(
  {
    guildID: String,
    welcomeChannelID: String,
    captchaChannelID: String,
    verifiedRoleID: String,
    suggestChannelID: String,
    levelChannelID: String,
    openTicketChannelID: String,
    transcriptChannelID: String,
    parentTicketChannelID: String,
    twitterChannelID: String,
    everyoneRoleID: String,
    roleCounters: [{ roleID: String, description: String, channel: String }],
    reactionRoles: [{ roleID: String, description: String, emoji: String }],
    mainRoles: [{ roleID: String, description: String, emoji: String }],
    isDelete: Boolean,
  },
  {
    statics: {
      async initGuild(guild) {
        let everyoneRoleID = guild.roles.everyone.id;
        await this.create({
          guildID: guild.id,
          welcomeChannelID: "false",
          captchaChannelID: "false",
          verifiedRoleID: "false",
          suggestChannelID: "false",
          levelChannelID: "false",
          openTicketChannelID: "false",
          transcriptChannelID: "false",
          parentTicketChannelID: "false",
          twitterChannelID: "false",
          everyoneRoleID: everyoneRoleID,
          reactionRoles: [],
          mainRoles: [],
          isDelete: false,
        });
      },
      async getTwitterChannels() {
        let res = await this.aggregate([
          {
            $match: {
              twitterChannelID: { $ne: "false" },
              isDelete: false,
            },
          },
          { $group: { _id: "$twitterChannelID" } },
        ]);
        return res;
      },
    },
  }
);
guildSchema.set("timestamps", true);

module.exports = model("Guild", guildSchema);
