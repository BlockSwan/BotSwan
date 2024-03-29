const Discord = require("discord.js");
const { emoji } = require("../constants");
const GoodIdeaBtn = require("../Components/Buttons/GoodIdea");

module.exports = {
  name: "setsuggest",
  description: "Set the suggestion channel",
  permission: Discord.PermissionFlagsBits.ManageGuild,
  dm: false,
  category: "Administration",
  options: [
    {
      type: "string",
      name: "state",
      description: "State of the suggestion",
      required: true,
      autocomplete: true,
    },
    {
      type: "channel",
      name: "channel",
      description: "The suggestion channel",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args, db) {
    const { guildId, guild } = message;
    let state = args.getString("state");
    if (state !== "on" && state !== "off")
      return bot.function.reply.error(message, "State must be `on` or `off`");
    if (state === "off") {
      await db.Guild.updateOne(
        { guildID: guildId },
        { suggestChannelID: "false" }
      );
      bot.log.query("write", "Writing to Guild " + guildId);
      await bot.function.reply.success(message, "Suggestion is disabled");
    } else {
      let channel = args.getChannel("channel");
      if (!channel)
        return bot.function.reply.error(
          message,
          "Missing a channel to deploy the suggestion"
        );
      channel = guild.channels.cache.get(channel.id);
      if (!channel) bot.function.reply.error(message, "No such channel");
      await db.Guild.updateOne(
        { guildID: guildId },
        { suggestChannelID: channel.id }
      );
      bot.log.query("write", "Writing to Guild " + guildId);

      await bot.function.reply.success(
        message,
        `Suggestion is enable in the channel ${channel}`
      );

      let embed = new Discord.EmbedBuilder()
        .setColor("Aqua")
        .setDescription(
          `Help us to improve **${emoji} Blockswan** by suggesting us some channe change, app and protocol ideas, or whatever you think will be good! 🤝\n\n To open a suggestion, just use the \`/suggest\` command and write your message in the modal. If you believe somone has a good idea, you can also use \`/goodidea\`!\n\n You can approve or reject the members suggestion!\nWe can't wait to read you! 👋`
        );

      const GoodIdea = GoodIdeaBtn();

      await channel.send({
        embeds: [embed],
        content: GoodIdea.content,
        components: [GoodIdea.button],
      });
    }
  },
};
