const Discord = require("discord.js");

module.exports = (message, roles) => {
  let embed = new Discord.EmbedBuilder()
    .setDescription(
      "Hello again builder!  Whether you are a buyer or a seller, please choose one role or more below related to your skills or needs.\n\n*If you already have the role slected, it will remove it.*"
    )
    .setColor("Aqua");

  const options = roles?.map((x) => {
    const role = message.guild.roles.cache.get(x.roleID);

    return {
      label: role.name,
      value: role.id,
      description: x.description,
      emoji: x.emoji || undefined,
    };
  });

  console.log(options);
  const menuComponents = [
    new Discord.ActionRowBuilder().addComponents(
      new Discord.SelectMenuBuilder()
        .setCustomId("reactionRoles")
        .setMaxValues(roles?.length)
        .setMinValues(0)
        .addOptions(options)
    ),
  ];

  return { embed: embed, menuComponents: menuComponents };
};
