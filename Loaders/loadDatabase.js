require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");

module.exports = async (bot) => {
  bot.log.warning("Loading Database");

  await mongoose.connect(process.env.MONGODB_URL || "", {
    keepAlive: true,
  });

  if (mongoose.connect) {
    bot.log.success("MongoDB connected!");
    bot.log.warning("Loading Models & queries");
    bot.db = {};
    fs.readdirSync("./Models")
      .filter((f) => f.endsWith(".js"))
      .forEach(async (file) => {
        let name = file.replace(".js", "");
        let mgdb = require(`../Models/${file}`);
        bot.db[name] = mgdb;
        bot.log.success(`${file.replace(".js", "")}`);
      });
  } else {
    bot.log.error("Failed connecting to MongoDB");
  }
};
