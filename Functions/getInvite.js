const { XP_TO_LVL, LVL_TO_XP } = require("../constants");

module.exports = async (bot, member) => {
  const newInvites = await member.guild.invites.fetch();
  const oldInvites = bot.invites.get(member.guild.id);
  const invite = newInvites.find((i) => i.uses > oldInvites.get(i.code));
  // const inviter = await client.users.fetch(invite.inviter.id);

  return invite;
};
