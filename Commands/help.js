const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "Display information about the bot command",
  permission: "None",
  dm: true,
  category: "Information",
  options: [
    {
      type: "string",
      name: "command",
      description: "The command to display",
      required: false,
      autocomplete: true,
    },
  ],

  async run(bot, message, args) {
    let command;
    if (args.getString("command")) {
      command = bot.commands.get(args.getString("command"));
      if (!command) return bot.function.reply.error(message, "No command");
    }

    if (!command) {
      let categories = [];
      bot.commands.forEach((command) => {
        if (!categories.includes(command.category))
          categories.push(command.category);
      });

      let Embed = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle(`Bot commands:`)
        .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `Available commands: \`${bot.commands.size}\`\nAvailable categories: \`${categories.length}\``
        )
        .setTimestamp()
        .setFooter({ text: "Bot commands" });

      await categories.sort().forEach(async (cat) => {
        let commands = bot.commands.filter((cmd) => cmd.category === cat);

        Embed.addFields({
          name: `${cat}`,
          value: `${commands
            ?.map((cmd) => `\`${cmd.name}\` : ${cmd.description}`)
            .join("\n")}`,
        });
      });

      await message.reply({ embeds: [Embed], ephemeral: true });
    } else {
      let Embed = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle(`Command ${command.name}`)
        .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `Name: \`${command.name}\`\nDescription: \`${
            command.description
          }\`\n Required Permission: \`${
            typeof command.permission !== "bbigint"
              ? command.permission
              : new Discord.PermissionsBitField(command.permission).toArray(
                  false
                )
          }\`\nCommand in PM: \`${command.dm ? "Yes" : "No"}\`\nCategory: \`${
            command.category
          }\``
        )
        .setTimestamp()
        .setFooter({ text: "Bot commands" });

      await message.reply({ embeds: [Embed], ephemeral: true });
    }
  },
};
