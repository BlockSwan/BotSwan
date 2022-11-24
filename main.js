require("dotenv").config();
const Logger = require("./Class/Logger");
const Discord = require("discord.js");
const wait = require("timers/promises").setTimeout;

const loadCommands = require("./Loaders/loadCommands");
const loadEvents = require("./Loaders/loadEvents");

const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({ intents });

let logger = new Logger();
bot.wait = wait;

bot.commands = new Discord.Collection();
bot.log = logger;
bot.function = {
  createID: require("./Functions/createID"),
  generateCaptcha: require("./Functions/generateCaptcha"),
  calculXp: require("./Functions/calculXp"),
  reply: require("./Functions/reply"),
  createWelcomeCard: require("./Functions/createWelcomeCard"),
  getInvite: require("./Functions/getInvite"),
  countRoleMember: require("./Functions/countRoleMember"),
};

bot.theme = {
  colors: require("./Theme/colors"),
};

bot.color = "#ffffff";
bot.login(process.env.TOKEN_BOT);
loadCommands(bot);
loadEvents(bot);

bot.log.success("Successfuly Loaded!");
