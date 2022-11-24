const { model, Schema } = require("mongoose");

let userSchema = new Schema(
  {
    discordID: String,
    guildID: String,
    inviterID: String,
    isMember: Boolean,
  },
  {
    statics: {
      async initUser(discordId, guildId, inviterId) {
        await this.create({
          discordID: discordId,
          guildID: guildId,
          inviterID: inviterId,
          isMember: true,
        });
      },
      async updateMembership(discordId, guildId, isMember) {
        await this.updateOne(
          {
            discordID: discordId,
            guildID: guildId,
          },
          {
            isMember: isMember,
          }
        );
      },
      async updateMembershipAndInviter(
        discordId,
        guildId,
        isMember,
        inviterId
      ) {
        await this.updateOne(
          {
            discordID: discordId,
            guildID: guildId,
          },
          {
            inviterID: inviterId,
            isMember: isMember,
          }
        );
      },
      async getUniqueVisitorCount(guildId) {
        let res = await this.aggregate([
          {
            $match: {
              guildID: guildId,
            },
          },
          {
            $count: "visitor_count",
          },
        ]);
        console.log(res[0]?.visitor_count);
        return res[0]?.visitor_count;
      },
      async getMemberCount(guildId) {
        let res = await this.aggregate([
          {
            $match: {
              guildID: guildId,
              isMember: true,
            },
          },
          {
            $count: "member_count",
          },
        ]);
        console.log(res[0]?.member_count);
        return res[0]?.member_count;
      },
      async getUserInvitation(guildId, inviterId) {
        let res = await this.aggregate([
          {
            $match: {
              guildID: guildId,
              inviterID: inviterId,
              isMember: true,
            },
          },
          {
            $count: "valid_invitation_count",
          },
        ]);
        console.log(res[0]?.valid_invitation_count);
        return res[0]?.valid_invitation_count || 0;
      },
    },
  }
);

userSchema.set("timestamps", true);

module.exports = model("User", userSchema);
