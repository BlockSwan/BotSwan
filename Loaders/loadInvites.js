const fs = require("fs");
const Discord = require("discord.js");

module.exports = async (bot) => {
  bot.log.warning(`Loading Invites`);
  const invites = new Discord.Collection();
  bot.guilds.cache.forEach(async (guild) => {
    // Fetch all Guild Invites
    const firstInvites = await guild.invites.fetch();
    // Set the key as Guild ID, and create a map which has the invite code, and the number of uses
    invites.set(
      guild.id,
      new Discord.Collection(
        firstInvites.map((invite) => [invite.code, invite.uses])
      )
    );
    bot.log.success(`Invite for guild ${guild.id} loaded`);
  });
  await bot.wait(2000);
  bot.invites = invites;
  bot.log.success(`All invites added to the bot collection`);
};
