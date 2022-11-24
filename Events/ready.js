const Discord = require("discord.js");
const loadSlashCommands = require("../Loaders/loadSlashCommands");
const loadDatabase = require("../Loaders/loadDatabase");
const loadTwitter = require("../Loaders/loadTwitter");
const loadInvites = require("../Loaders/loadInvites");
const roleCounter = require("../Generators/Counters/roleCounter");
const { TWO_MIN } = require("../constants");

module.exports = async (bot) => {
  await bot.wait(2000);
  await loadDatabase(bot);
  await bot.wait(2000);
  await loadSlashCommands(bot);
  await bot.wait(2000);
  await loadTwitter(bot);
  await bot.wait(2000);
  await loadInvites(bot);
  await bot.wait(2000);

  await roleCounter(bot);
  setInterval(async () => {
    await roleCounter(bot);
  }, TWO_MIN);

  bot.log.ready();
};
