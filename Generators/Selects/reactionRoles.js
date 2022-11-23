module.exports = {
  async run(bot, interaction, db) {
    const { values, guild, member } = interaction;

    for (let i = 0; i < values?.length; i++) {
      const roleId = values[i];
      const role = guild.roles.cache.get(roleId);

      const hasRole = member.roles.cache.has(roleId);
      console.log(hasRole);
      switch (hasRole) {
        case true:
          member.roles.remove(roleId);
          break;
        case false:
          member.roles.add(roleId);
          break;
      }
    }
    console.log(values);
    bot.function.reply.success(interaction, "Role(s) updated!");
  },
};
