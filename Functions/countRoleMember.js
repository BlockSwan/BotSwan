const { XP_TO_LVL, LVL_TO_XP } = require("../constants");

module.exports = async (guild, roleID) => {
  const count = guild.members.cache.filter((m) =>
    m.roles.cache.has(roleID)
  ).size;

  return count || 0;
};
