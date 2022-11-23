const Discord = require("discord.js");
const loadSlashCommands = require("../Loaders/loadSlashCommands");
const loadDatabase = require("../Loaders/loadDatabase");
const loadTwitter = require("../Loaders/loadTwitter");

module.exports = async (bot) => {
  await loadDatabase(bot);
  await loadSlashCommands(bot);
  await loadTwitter(bot);
  bot.log.success(`${bot.user.tag} is ready to fire!.`);
};
