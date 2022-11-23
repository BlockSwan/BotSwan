const Discord = require("discord.js");

module.exports = (message, mainRoles) => {
  let options = mainRoles?.map((x) => {
    const role = message.guild.roles.cache.get(x.roleID);

    return {
      label: role.name,
      value: role.id,
      description: x.roleDescription,
      emoji: x.roleEmoji || undefined,
    };
  });

  const createText = () => {
    let string = "";
    for (let i = 0; i < options?.length; i++) {
      string += `** ${
        options[i].emoji !== undefined ? options[i].emoji : ""
      }  ${options[i].label}**${
        options[i].description !== "No description"
          ? `\n${options[i].description}`
          : ""
      }\n${i + 1 === options?.length ? "" : "\n"}`;
    }

    return string;
  };

  let embed = new Discord.EmbedBuilder()
    .setDescription(
      `Hello friend! Please choose a main role between:\n\n${createText()}\n\n*If you already have the role selected, it will remove it.*`
    )
    .setColor("Aqua");

  let Buttons = [];

  for (let j = 0; j < options?.length; j++) {
    let but = {
      type: 1,
      components: [
        {
          type: 2,
          label: options[j].label,
          style: 1,
          custom_id: "mainRole-" + options[j].value,
        },
      ],
    };
    if (options[j]?.emoji !== null && options[j]?.emoji !== undefined)
      but.components[0].emoji = options[j]?.emoji;
    Buttons.push(but);
  }

  return { components: Buttons, embeds: embed };
};
