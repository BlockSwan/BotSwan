const Discord = require("discord.js");

module.exports = async (bot, guild) => {
  let db = bot.db;

  guild.invites.fetch().then((guildInvites) => {
    // This is the same as the ready event
    bot.invites.set(
      guild.id,
      new Map(guildInvites.map((invite) => [invite.code, invite.uses]))
    );
  });

  let data = await db.Guild.findOne({ GuildID: guild.id });
  if (!data) {
    await db.Guild.initGuild(guild);
  } else if (data.isDelete) {
    await db.Guild.updateOne({ guildID: guild.id }, { isDelete: false });
  }
};
