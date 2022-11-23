const fs = require("fs");

module.exports = async (bot) => {
  bot.log.warning("Loading Events");
  fs.readdirSync("./Events")
    .filter((f) => f.endsWith(".js"))
    .forEach(async (file) => {
      let event = require(`../Events/${file}`);
      bot.on(file.split(".js").join(""), event.bind(null, bot));
      bot.log.success(`on${file.replace(".js", "")}`);
    });
};
