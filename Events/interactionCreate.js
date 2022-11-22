const Discord = require("discord.js");

module.exports = async (bot, interaction) => {
  if (
    interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete
  ) {
    let entry = interaction.options.getFocused();
    if (interaction.commandName === "help") {
      let choices = bot.commands.filter((cmd) => cmd.name.includes(entry));
      await interaction.respond(
        entry === ""
          ? bot.commands.map((cmd) => ({ name: cmd.name, value: cmd.name }))
          : choices.map((choice) => ({ name: choice.name, value: choice.name }))
      );
    }
    if (
      [
        "setcaptcha",
        "setsuggest",
        "setlevel",
        "setticket",
        "settwitter",
      ].includes(interaction.commandName)
    ) {
      let choices = ["on", "off"];
      let output = choices.filter((c) => c.includes(entry));
      await interaction.respond(
        entry !== ""
          ? output.map((c) => ({ name: c, value: c }))
          : choices.map((c) => ({ name: c, value: c }))
      );
    } else if (interaction.commandName === "ticket") {
      let choices = ["add", "remove"];
      let output = choices.filter((c) => c.includes(entry));
      await interaction.respond(
        entry === ""
          ? output.map((c) => ({ name: c, value: c }))
          : choices.map((c) => ({ name: c, value: c }))
      );
    }
  }

  if (interaction.type === Discord.InteractionType.ApplicationCommand) {
    let command = require(`../Commands/${interaction.commandName}`);
    command.run(bot, interaction, interaction.options, bot.db);
  }

  if (interaction.type === Discord.InteractionType.ModalSubmit) {
    let command = require(`../Generators/Modals/${interaction.customId}.js`);
    command.run(bot, interaction, bot.db);
  }

  if (interaction.isButton()) {
    let id = interaction.customId;
    if (["member", "bug", "discord", "other"].includes(id)) id = "newticket";
    if (
      ["closeTicket", "lockTicket", "unlockTicket", "transcript"].includes(id)
    )
      id = "ticketactions";
    let command = require(`../Generators/Buttons/${id}.js`);
    if (command) command.run(bot, interaction, bot.db);
  }
};
