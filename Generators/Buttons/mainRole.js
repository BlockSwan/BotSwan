module.exports = {
  async run(bot, interaction, db) {
    const { guild, member } = interaction;
    console.log(interaction.customId);
    let values = interaction.customId.split("-");

    const roleId = values[1];
    const role = guild.roles.cache.get(roleId);

    const hasRole = member.roles.cache.has(roleId);
    switch (hasRole) {
      case true:
        member.roles.remove(roleId);
        break;
      case false:
        member.roles.add(roleId);
        break;
    }

    bot.function.reply.success(interaction, "Role(s) updated!");
  },
};
