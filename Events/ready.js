const Discord = require("discord.js");
const loadSlashCommands = require("../Loaders/loadSlashCommands");
const loadDatabase = require("../Loaders/loadDatabase");
const loadTwitter = require("../Loaders/loadTwitter");

module.exports = async (bot) => {
  bot.db = await loadDatabase();
  bot.db.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the database");
  });
  await loadSlashCommands(bot);
  await loadTwitter(bot);
  console.log(`${bot.user.tag} is ready to fire!.`);
};
