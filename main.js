require("dotenv").config();

const Discord = require("discord.js");
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({ intents });
const loadCommands = require("./Loaders/loadCommands");
const loadEvents = require("./Loaders/loadEvents");

bot.commands = new Discord.Collection();
bot.function = {
  createID: require("./Functions/createID"),
  generateCaptcha: require("./Functions/generateCaptcha"),
  calculXp: require("./Functions/calculXp"),
  queries: require("./queries"),
  reply: require("./Functions/reply"),
};
bot.queries = require("./queries");

bot.theme = {
  colors: require("./Theme/colors"),
};

bot.color = "#ffffff";
bot.login(process.env.TOKEN_BOT);
loadCommands(bot);
loadEvents(bot);
console.log("Success Connect");
