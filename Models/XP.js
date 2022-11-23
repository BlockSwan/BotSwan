const { model, Schema } = require("mongoose");

let XPSchema = new Schema(
  {
    discordID: String,
    guildID: String,
    xp: Number,
  },
  {
    statics: {
      async getUserXP(discordId, guildId) {
        let res = await this.aggregate([
          {
            $match: { guildID: guildId, discordID: discordId },
          },
          { $group: { _id: null, sum_xp: { $sum: "$xp" } } },
        ]);
        return res[0].sum_xp;
      },
      async getLeaderboard(guildId) {
        let res = await this.aggregate([
          { $match: { guildID: guildId } },
          { $group: { _id: "$discordID", sum_xp: { $sum: "$xp" } } },
          { $sort: { sum_xp: -1 } },
          { $limit: 10 },
        ]);
        return res;
      },

      async getUserRank(discordId, guildId) {
        let res = await this.getLeaderboard(guildId);
        let rank = res?.findIndex((x) => x._id === discordId);
        return rank + 1;
      },
    },
  }
);

XPSchema.set("timestamps", true);

module.exports = model("XP", XPSchema);
